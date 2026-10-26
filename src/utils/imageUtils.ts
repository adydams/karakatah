/**
 * Optimizes Cloudinary image URLs for better quality and performance.
 * Uses auto-format, auto-quality, and fill mode for a consistent look.
 */
export const optimizeImage = (url: string, width: number = 1000, height: number = 600): string => {
  if (!url || !url.includes('cloudinary.com')) return url;

  // Split URL to insert transformations after /upload/
  const parts = url.split('/upload/');
  if (parts.length < 2) return url;

  const baseUrl = parts[0] + '/upload/';
  const remainingUrl = parts[1];

  // Transformation parameters:
  // q_auto: Automatic quality
  // f_auto: Automatic format (WebP/AVIF)
  // c_fill: Fill the specified dimensions (crops center)
  // w_x, h_y: dimensions
  const transformations = `q_auto:best,f_auto,c_fill,w_${width},h_${height},dpr_auto`;

  return `${baseUrl}${transformations}/${remainingUrl}`;
};
