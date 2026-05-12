<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use TesseractOCR;

class OcrService
{
    /**
     * Extract text from an uploaded file (jpg, png, pdf).
     * Returns null on failure.
     */
    public function extractText(UploadedFile $file): ?string
    {
        $tmpDir  = sys_get_temp_dir();
        $tmpBase = $tmpDir . '/' . uniqid('ocr_', true);

        try {
            $extension = strtolower($file->getClientOriginalExtension());

            if ($extension === 'pdf') {
                $pdfPath = $tmpBase . '.pdf';
                copy($file->getRealPath(), $pdfPath);

                $imgPath = $tmpBase . '_page';
                exec("pdftoppm -r 200 -l 1 -png " . escapeshellarg($pdfPath) . " " . escapeshellarg($imgPath), $out, $code);

                $generated = $imgPath . '-1.png';
                if (! file_exists($generated)) {
                    $generated = $imgPath . '-01.png';
                }
                if (! file_exists($generated)) {
                    return null;
                }
                $imageToOcr = $generated;
            } else {
                $imageToOcr = $tmpBase . '.' . $extension;
                copy($file->getRealPath(), $imageToOcr);
            }

            $text = (new TesseractOCR($imageToOcr))
                ->lang('spa', 'eng')
                ->run();

            return trim($text) ?: null;

        } catch (\Throwable $e) {
            Log::warning('OcrService: extraction failed — ' . $e->getMessage());
            return null;
        } finally {
            foreach (glob($tmpBase . '*') as $f) {
                @unlink($f);
            }
        }
    }
}
