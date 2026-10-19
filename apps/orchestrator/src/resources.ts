import { LeasePools } from './turns/leases.js';
// Pipeline permits and paid-operation leases have independent ownership.
export class PipelinePools extends LeasePools {}
export type ResourceContext = {
  leasePools: LeasePools;
  pipelines: PipelinePools;
};
const processState = globalThis as typeof globalThis & {
  __aivcPipelinePoolsV1?: PipelinePools;
};
export function getPipelinePools(): PipelinePools {
  return (processState.__aivcPipelinePoolsV1 ??= new PipelinePools());
}
