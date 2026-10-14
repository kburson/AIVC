export function enumerateOwnedFiles(root?: string): string[];
export function isProtectedDocument(path: string): boolean;
export function checkFormatting(options?: {
  root?: string;
  paths?: string[];
  write?: boolean;
  log?: (line: string) => void;
}): Promise<number>;
export { verifyEvidenceArchive } from './sealed-evidence.mjs';
