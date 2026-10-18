import type { ProjectCatalog } from '@aivc/contracts';
import { validateProjectCatalog } from '@aivc/contracts';
import { AppError } from '../http/errors';
import { runWithDeadline } from '../turns/deadline';
export function createRetrievalClient(
  baseUrl: string,
): (name: string | undefined, signal: AbortSignal) => Promise<ProjectCatalog> {
  const origin = new URL(baseUrl);
  if (
    origin.origin !== baseUrl ||
    !['http:', 'https:'].includes(origin.protocol) ||
    origin.username ||
    origin.password ||
    baseUrl.includes('*')
  )
    throw new AppError(
      400,
      'INVALID_REQUEST',
      'Retrieval must use one configured canonical origin.',
      null,
      false,
    );
  return async (name, signal) => {
    signal.throwIfAborted();
    const url = new URL('/v1/projects', origin);
    if (name !== undefined) url.searchParams.set('name', name);
    const task = runWithDeadline(5000, signal, async (upstream) => {
      const response = await fetch(url, {
        signal: upstream,
        redirect: 'error',
        cache: 'no-store',
      });
      if (!response.ok) throw Error('Retrieval HTTP failure');
      return validateProjectCatalog(await response.json());
    });
    try {
      return await task.result;
    } catch {
      if (signal.aborted) throw signal.reason;
      throw new AppError(
        502,
        'RETRIEVAL_UNAVAILABLE',
        'Project retrieval is unavailable.',
        null,
        false,
      );
    } finally {
      await task.settled;
    }
  };
}
