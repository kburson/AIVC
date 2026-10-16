import { getRuntime } from '../../../server/runtime';
import { assertAdmission } from '../../../server/http/admission';
import { errorResponse } from '../../../server/http/errors';
import { validateCapabilities } from '../../../shared/validation';
export const runtime = 'nodejs';
export async function GET(request: Request): Promise<Response> {
  try {
    const state = getRuntime();
    assertAdmission(request.headers, state.config, false);
    const build = await state.buildInfo;
    return Response.json(
      validateCapabilities({ ...state.capabilities, build }),
      { headers: { 'cache-control': 'no-store' } },
    );
  } catch (error) {
    return errorResponse(error);
  }
}
