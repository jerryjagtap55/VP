import type { ErrorRequestHandler, RequestHandler } from 'express';
import type { ApiErrorBody, ApiErrorCode } from '../../../shared/api.ts';
import { AppError } from '../errors.ts';
import { isRecord } from '../validation.ts';

function errorBody(code: ApiErrorCode, message: string): ApiErrorBody {
  return { error: { code, message } };
}

export const notFoundHandler: RequestHandler = (req, res) => {
  res
    .status(404)
    .json(errorBody('ROUTE_NOT_FOUND', `Cannot ${req.method} ${req.path}`));
};

// Express identifies error handlers by their four parameters, so `_next` must stay.
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json(errorBody(err.code, err.message));
    return;
  }

  // Thrown by express.json() when the request body is not valid JSON.
  if (isRecord(err) && err.type === 'entity.parse.failed') {
    res
      .status(400)
      .json(errorBody('VALIDATION_ERROR', 'Request body must be valid JSON'));
    return;
  }

  console.error(err);
  res
    .status(500)
    .json(errorBody('INTERNAL_ERROR', 'An unexpected error occurred'));
};
