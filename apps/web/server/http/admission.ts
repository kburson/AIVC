import { AppError } from './errors';
import type { ServerConfig } from '../config';
function reject(): never {
  throw new AppError(
    403,
    'ORIGIN_NOT_ALLOWED',
    'Origin or Host is not allowed.',
    null,
    false,
  );
}
export function assertAdmission(
  headers: Headers,
  config: ServerConfig,
  requireOrigin: boolean,
): void {
  const host = headers.get('host');
  if (!host || !config.allowedHosts.has(host)) reject();
  if (!requireOrigin) return;
  const supplied = headers.get('origin');
  if (!supplied || !config.allowedOrigins.has(supplied)) reject();
  try {
    const origin = new URL(supplied);
    if (
      !['http:', 'https:'].includes(origin.protocol) ||
      origin.origin !== supplied ||
      origin.host !== host
    )
      reject();
  } catch {
    reject();
  }
}
