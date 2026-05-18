<?php

namespace App\Helpers;

use Illuminate\Http\UploadedFile;

class ImageHelper
{
    /**
     * Compress an uploaded image and return it as a Base64 data URL.
     * Resizes to maxDim x maxDim keeping aspect ratio, converts to JPEG.
     */
    public static function compressToBase64(
        UploadedFile $file,
        int $maxDim = 500,
        int $quality = 75
    ): string {
        $img = imagecreatefromstring(file_get_contents($file->getRealPath()));

        $w = imagesx($img);
        $h = imagesy($img);

        if ($w > $maxDim || $h > $maxDim) {
            $ratio = min($maxDim / $w, $maxDim / $h);
            $newW  = (int) ($w * $ratio);
            $newH  = (int) ($h * $ratio);

            $resized = imagecreatetruecolor($newW, $newH);
            imagecopyresampled($resized, $img, 0, 0, 0, 0, $newW, $newH, $w, $h);
            imagedestroy($img);
            $img = $resized;
        }

        ob_start();
        imagejpeg($img, null, $quality);
        $jpeg = ob_get_clean();
        imagedestroy($img);

        return 'data:image/jpeg;base64,' . base64_encode($jpeg);
    }

    /** Returns true if the string is already a Base64 data URL. */
    public static function isBase64(mixed $value): bool
    {
        return is_string($value) && str_starts_with($value, 'data:');
    }
}
