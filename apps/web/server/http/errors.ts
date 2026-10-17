import { AppError } from '@aivc/contracts';
import type { AppErrorFields } from '@aivc/contracts';
export { AppError } from '@aivc/contracts';
const processState = globalThis as typeof globalThis & {
  __aivcAppErrorConstructorsV1?: WeakSet<object>;
};
const constructors = (processState.__aivcAppErrorConstructorsV1 ??=
  new WeakSet<object>());
// Register only the exact frozen shared class imported by each server module generation.
// Weak references retain no abandoned HMR generation, and error names/fields alone grant no trust.
constructors.add(AppError);
function normalize(error: unknown): AppError {
  if (error instanceof Error) {
    const constructor: unknown = Object.getPrototypeOf(error)?.constructor;
    if (
      typeof constructor === 'function' &&
      constructors.has(constructor) &&
      error instanceof constructor
    )
      return error as AppError;
  }
  return new AppError(502, 'MODEL_FAILED', 'Request failed.', null, false);
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
