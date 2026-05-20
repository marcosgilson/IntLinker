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

    public function pollJob(string $jobId, int $maxAttempts = 15): void
    {
        $wait = 2;

        for ($i = 0; $i < $maxAttempts; $i++) {
            sleep($wait);

            $response = Http::withHeaders($this->headers())
                ->get("{$this->baseUrl}/job/{$jobId}");

            $status = $response->json('status') ?? 'processing';

            if ($status === 'completed') {
                return;
            }

            if ($status === 'failed') {
                throw new RuntimeException('DocuPipe job failed');
            }

            $wait = min($wait * 2, 16);
        }

        throw new RuntimeException('DocuPipe job timed out');
    }

    public function standardize(string $documentId, string $schemaId): string
    {
        $response = Http::withHeaders($this->headers())
            ->post("{$this->baseUrl}/v2/standardize/batch", [
                'schemaId'    => $schemaId,
                'documentIds' => [$documentId],
            ]);

        if (! $response->successful()) {
            throw new RuntimeException('DocuPipe standardize failed: ' . $response->body());
        }

        $jobId             = $response->json('jobId');
        $standardizationId = $response->json('standardizationIds.0');

        $this->pollJob($jobId);

        return $standardizationId;
    }

    public function getStandardization(string $standardizationId): array
    {
        $response = Http::withHeaders($this->headers())
            ->get("{$this->baseUrl}/standardization/{$standardizationId}");

        if (! $response->successful()) {
            throw new RuntimeException('DocuPipe get standardization failed');
        }

        return $response->json();
    }

    public function extractStudentCard(UploadedFile $file): array
    {
        $schemaId = config('services.docupipe.student_schema_id');

        // 1. Upload and poll until parsed
        $upload     = $this->uploadDocument($file);
        $documentId = $upload['documentId'];
        $uploadJobId = $upload['jobId'];

        $this->pollJob($uploadJobId);

        // 2. Standardize with schema
        $standardizationId = $this->standardize($documentId, $schemaId);

        // 3. Get result
        return $this->getStandardization($standardizationId);
    }
}