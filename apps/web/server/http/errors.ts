import { AppError } from '../../shared/contracts';
import type { AppErrorFields } from '../../shared/contracts';
export { AppError } from '../../shared/contracts';
function normalize(error: unknown): AppError {
  return error instanceof AppError
    ? error
    : new AppError(502, 'MODEL_FAILED', 'Request failed.', null, false);
}
export function errorFields(error: unknown): AppErrorFields {
  const safe = normalize(error);
  return {
    code: safe.code,
    message: safe.message,
    turnId: safe.turnId,
    retryable: safe.retryable,
  };
}
export function errorResponse(error: unknown): Response {
  const safe = normalize(error);
  return Response.json(
    { error: errorFields(safe) },
    { status: safe.httpStatus, headers: { 'cache-control': 'no-store' } },
  );
}
