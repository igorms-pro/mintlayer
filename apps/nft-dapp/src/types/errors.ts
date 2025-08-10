// Error types for better type safety
export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public statusText: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export class NetworkError extends Error {
  constructor(
    message: string,
    public code?: string
  ) {
    super(message);
    this.name = 'NetworkError';
  }
}

export type AppError = APIError | NetworkError | Error;

// Type guard functions
export const isAPIError = (error: unknown): error is APIError => {
  return error instanceof APIError;
};

export const isNetworkError = (error: unknown): error is NetworkError => {
  return error instanceof NetworkError;
};

export const isError = (error: unknown): error is Error => {
  return error instanceof Error;
};

// Helper function to safely get error message
export const getErrorMessage = (error: unknown): string => {
  if (isAPIError(error)) {
    return `${error.message} (${error.status} ${error.statusText})`;
  }
  if (isNetworkError(error)) {
    return error.message;
  }
  if (isError(error)) {
    return error.message;
  }
  return 'An unknown error occurred';
};
