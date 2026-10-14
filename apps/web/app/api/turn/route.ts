import { getRuntime } from '../../../server/runtime';
import { turnResponse } from '../../../server/http/sse-response';
import { errorResponse } from '../../../server/http/errors';
export const runtime = 'nodejs';
export async function POST(req: Request): Promise<Response> {
  try {
    return await turnResponse(req, getRuntime());
  } catch (error) {
    return errorResponse(error);
  }
}
