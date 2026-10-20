export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}
export const NETWORK_ERROR_MESSAGE =
  "Can't reach the server. Check your connection and try again.";

export function getErrorMessage(
  err: unknown,
  fallback = "Something went wrong. Try again.",
): string {
  if (err instanceof TypeError) return NETWORK_ERROR_MESSAGE;
  if (err instanceof ApiError && err.status < 500 && err.message) {
    return err.message;
  }
  return fallback;
}
