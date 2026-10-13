import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
/** @param {{root?: string, nodeVersion?: string, npmVersion?: string}} [options] */
export function verifyToolchain({
  root = resolve(dirname(fileURLToPath(import.meta.url)), '..'),
  nodeVersion = process.version,
  npmVersion,
} = {}) {
  const errors = [];
  let nodePin, manager, engine;
  try {
    nodePin = readFileSync(resolve(root, '.nvmrc'), 'utf8').trim();
    const pkg = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'));
    manager = pkg.packageManager;
    engine = pkg.engines?.npm;
  } catch (error) {
    return ['Cannot read toolchain pins: ' + error.message];
  }
  if (!/^\d+\.\d+\.\d+$/.test(nodePin))
    errors.push('Malformed .nvmrc pin: ' + nodePin);
  const npmPin =
    typeof manager === 'string'
      ? /^npm@(\d+\.\d+\.\d+)$/.exec(manager)?.[1]
      : undefined;
  if (!npmPin) errors.push('Malformed packageManager pin: ' + manager);
  if (engine !== npmPin || !npmPin)
    errors.push(
      'engines.npm must equal packageManager version: expected ' +
        npmPin +
        ', actual ' +
        engine,
    );
  if (nodeVersion !== 'v' + nodePin)
    errors.push(
      'Node mismatch: expected v' + nodePin + ', actual ' + nodeVersion,
    );
  if (npmVersion === undefined) {
    const result = spawnSync('npm', ['--version'], { encoding: 'utf8' });
    if (result.error || result.status !== 0)
      errors.push(
        'Cannot read npm version: ' + (result.error?.message ?? result.stderr),
      );
    npmVersion = result.stdout?.trim();
  }
  if (npmPin && npmVersion !== npmPin)
    errors.push('npm mismatch: expected ' + npmPin + ', actual ' + npmVersion);
  return errors;
}
if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const errors = verifyToolchain();
  if (errors.length) {
    console.error(errors.join('\n'));
    process.exitCode = 1;
  } else console.log('Reproducible toolchain verified.');
}
