import { getRuntime } from '../../../server/runtime';
import { speechResponse } from '../../../server/http/speech-response';
import { errorResponse } from '../../../server/http/errors';
export const runtime = 'nodejs';
export async function POST(req: Request): Promise<Response> {
  try {
    return await speechResponse(req, getRuntime());
  } catch (error) {
    return errorResponse(error);
  }
}
