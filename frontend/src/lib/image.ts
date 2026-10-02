type ImageOptions = {
  /** Trim uniform borders baked into the source. Tolerance 1-100, false = off */
  trim?: number | false;
  /** Max width in px (tiles don't need the 1600px originals) */
  width?: number;
};

/**
 * Display-time Cloudinary transformations, nothing is re-uploaded.
 * Non-Cloudinary URLs are returned untouched, so it is safe to wrap any image src.
 */
export function productImage(
  url: string,
  { trim = 10, width }: ImageOptions = {},
): string {
  if (!url.includes("/image/upload/")) return url;

  const steps = [
    trim !== false && !url.includes("e_trim") ? `e_trim:${trim}` : null,
    width ? `c_limit,w_${width}` : null,
  ].filter(Boolean);

  if (steps.length === 0) return url;
  // Chained transformations are separated by "/" and run in order
  return url.replace("/image/upload/", `/image/upload/${steps.join("/")}/`);
}
