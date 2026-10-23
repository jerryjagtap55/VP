import type { ApiErrorBody, ApiErrorCode } from '../../../shared/api.ts';

const API_BASE_URL = '/api';
const UNREACHABLE_MESSAGE = 'Unable to reach the server. Please try again.';

export class ApiError extends Error {
  readonly status: number;
  readonly code: ApiErrorCode | undefined;

  constructor(message: string, status: number, code?: ApiErrorCode) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

interface RequestOptions {
  method?: 'GET' | 'PATCH';
  body?: unknown;
}

function isApiErrorBody(value: unknown): value is ApiErrorBody {
  return (
    typeof value === 'object' &&
    value !== null &&
    'error' in value &&
    typeof value.error === 'object' &&
    value.error !== null &&
    'message' in value.error &&
    typeof value.error.message === 'string'
  );
}

export async function request<T>(
  path: string,
  { method = 'GET', body }: RequestOptions = {},
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers:
        body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError(UNREACHABLE_MESSAGE, 0);
  }

  // Some failures (e.g. the proxy cannot reach the API) have no JSON body.
  const data: unknown = await response.json().catch(() => undefined);

  if (!response.ok) {
    if (isApiErrorBody(data)) {
      throw new ApiError(data.error.message, response.status, data.error.code);
    }
    // 502-504 come from the dev proxy (or a gateway) when the API is down.
    const message =
      response.status >= 502 && response.status <= 504
        ? UNREACHABLE_MESSAGE
        : `The server returned an error (${response.status}). Please try again.`;
    throw new ApiError(message, response.status);
  }

  // Trusted because the API's response types are shared with the backend.
  return data as T;
}

export function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Something went wrong.';
}
