<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class DocuPipeService
{
    private string $apiKey;
    private string $baseUrl = 'https://app.docupipe.ai';

    public function __construct()
    {
        $this->apiKey = config('services.docupipe.key');
    }

    private function headers(): array
    {
        return [
            'Accept'    => 'application/json',
            'X-API-Key' => $this->apiKey,
        ];
    }

    /**
     * Upload a document to DocuPipe. Returns immediately with documentId and jobId.
     */
    public function uploadDocument(UploadedFile $file): array
    {
        $contents = base64_encode(file_get_contents($file->getRealPath()));
        $filename = $file->getClientOriginalName() ?: 'document.jpg';

        $response = Http::withHeaders($this->headers())
            ->post("{$this->baseUrl}/document", [
                'document' => [
                    'file' => [
                        'contents' => $contents,
                        'filename' => $filename,
                    ],
                ],
            ]);

        if (! $response->successful()) {
            throw new RuntimeException('DocuPipe upload failed: ' . $response->body());
        }

        return $response->json(); // { documentId, jobId }
    }

    /**
     * Upload from raw base64 content (for use inside queued jobs).
     */
    public function uploadFromBase64(string $base64Contents, string $filename): array
    {
        $response = Http::withHeaders($this->headers())
            ->post("{$this->baseUrl}/document", [
                'document' => [
                    'file' => [
                        'contents' => $base64Contents,
                        'filename' => $filename,
                    ],
                ],
            ]);

        if (! $response->successful()) {
            throw new RuntimeException('DocuPipe upload failed: ' . $response->body());
        }

        return $response->json(); // { documentId, jobId }
    }

    /**
     * Check the status of a DocuPipe job. Returns 'completed', 'failed', or 'processing'.
     */
    public function checkJob(string $jobId): string
    {
        $response = Http::withHeaders($this->headers())
            ->get("{$this->baseUrl}/job/{$jobId}");

        if (! $response->successful()) {
            throw new RuntimeException('DocuPipe job check failed: ' . $response->body());
        }

        return $response->json('status') ?? 'processing';
    }

    /**
     * Start standardization for a document. Returns immediately with jobId and standardizationId.
     */
    public function startStandardize(string $documentId, string $schemaId): array
    {
        $response = Http::withHeaders($this->headers())
            ->post("{$this->baseUrl}/v2/standardize/batch", [
                'schemaId'    => $schemaId,
                'documentIds' => [$documentId],
            ]);

        if (! $response->successful()) {
            throw new RuntimeException('DocuPipe standardize failed: ' . $response->body());
        }

        return [
            'jobId'              => $response->json('jobId'),
            'standardizationId'  => $response->json('standardizationIds.0'),
        ];
    }

    /**
     * Get the standardization result.
     */
    public function getStandardization(string $standardizationId): array
    {
        $response = Http::withHeaders($this->headers())
            ->get("{$this->baseUrl}/standardization/{$standardizationId}");

        if (! $response->successful()) {
            throw new RuntimeException('DocuPipe get standardization failed: ' . $response->body());
        }

        return $response->json();
    }

    /**
     * Synchronous full extraction (used in test route or sync queue).
     */
    public function extractStudentCard(UploadedFile $file): array
    {
        $schemaId   = config('services.docupipe.student_schema_id');
        $upload     = $this->uploadDocument($file);
        $documentId = $upload['documentId'];
        $jobId      = $upload['jobId'];

        $this->pollJob($jobId);

        $std = $this->startStandardize($documentId, $schemaId);
        $this->pollJob($std['jobId']);

        return $this->getStandardization($std['standardizationId']);
    }

    /**
     * Blocking poll — only use in sync contexts (test route).
     */
    public function pollJob(string $jobId, int $maxAttempts = 15): void
    {
        $wait = 2;
        for ($i = 0; $i < $maxAttempts; $i++) {
            sleep($wait);
            $status = $this->checkJob($jobId);
            if ($status === 'completed') return;
            if ($status === 'failed') throw new RuntimeException('DocuPipe job failed');
            $wait = min($wait * 2, 16);
        }
        throw new RuntimeException('DocuPipe job timed out');
    }
}