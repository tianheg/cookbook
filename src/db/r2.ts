/**
 * R2 bucket utilities for recipe image uploads
 */

import { textToPinyin } from '../utils/pinyin';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * Upload an image file to R2 bucket
 */
export async function uploadImageToR2(
  bucket: R2Bucket,
  file: File,
  recipeName: string
): Promise<string> {
  // Validate file type
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new Error('Invalid file type. Allowed types: JPEG, PNG, WebP');
  }

  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File size exceeds 5MB limit');
  }

  // Generate filename with pinyin conversion from recipe name
  const extension = file.type.split('/')[1];
  const pinyinName = textToPinyin(recipeName);
  const timestamp = Date.now();
  // Use format: pinyin-name-timestamp.extension to ensure uniqueness
  const filename = `${pinyinName}-${timestamp}.${extension}`;

  try {
    const buffer = await file.arrayBuffer();
    
    await bucket.put(filename, buffer, {
      httpMetadata: {
        contentType: file.type,
      },
      customMetadata: {
        uploadedAt: new Date().toISOString(),
        recipeName: recipeName,
      },
    });

    return `${process.env.R2_PUBLIC_URL || 'https://recipes.example.com'}/${filename}`;
  } catch (error) {
    console.error('R2 upload error:', error);
    throw new Error('Failed to upload image to R2');
  }
}

/**
 * Delete an image file from R2 bucket
 */
export async function deleteImageFromR2(
  bucket: R2Bucket,
  imageUrl: string
): Promise<void> {
  try {
    // Extract the filename from the URL
    const urlObj = new URL(imageUrl);
    const filename = urlObj.pathname.substring(1); // Remove leading slash

    await bucket.delete(filename);
  } catch (error) {
    console.error('R2 delete error:', error);
    throw new Error('Failed to delete image from R2');
  }
}

/**
 * Generate a signed URL for temporary access
 */
export async function getSignedUrl(
  bucket: R2Bucket,
  filename: string,
  expirationSeconds: number = 3600
): Promise<string> {
  try {
    const url = await bucket.createSignedUrl(filename, expirationSeconds);
    return url;
  } catch (error) {
    console.error('R2 signed URL error:', error);
    throw new Error('Failed to generate signed URL');
  }
}
