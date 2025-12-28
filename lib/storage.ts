// Google Cloud Storage configuration
const GCS_BUCKET = "onetn-documents";
const GCS_BASE_URL = `https://storage.googleapis.com/${GCS_BUCKET}`;

/**
 * Converts a local file URL to a GCS URL in production
 * Local: /documents/quality/GO-NO-148-20250626.pdf
 * GCS: https://storage.googleapis.com/onetn-documents/quality/GO-NO-148-20250626.pdf
 */
export function getFileUrl(localUrl: string): string {
  // If already a full URL, return as-is
  if (localUrl.startsWith("http://") || localUrl.startsWith("https://")) {
    return localUrl;
  }

  // In production, convert local paths to GCS URLs
  if (process.env.NODE_ENV === "production") {
    // Remove leading /documents/ and prepend GCS URL
    const path = localUrl.replace(/^\/documents\//, "");
    return `${GCS_BASE_URL}/${path}`;
  }

  // In development, use local paths
  return localUrl;
}

/**
 * Gets the storage base URL for the current environment
 */
export function getStorageBaseUrl(): string {
  if (process.env.NODE_ENV === "production") {
    return GCS_BASE_URL;
  }
  return "/documents";
}
