/**
 * Utility to convert Chinese characters to pinyin using pinyin-pro
 * This provides accurate Chinese to pinyin conversion for filenames
 */

import { pinyin as pinyinPro } from 'pinyin-pro';

/**
 * Convert Chinese text to pinyin using pinyin-pro library
 * @param text - Text to convert (can contain Chinese, English, numbers)
 * @returns Pinyin string suitable for filenames
 */
export function textToPinyin(text: string): string {
  if (!text) return '';

  const pinyinResult = pinyinPro(text, {
    toneType: 'none', // no tone marks
    multiple: false, // use first pronunciation only
  });

  // Convert to filename format
  const result = pinyinResult
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '');

  return result || 'recipe';
}
