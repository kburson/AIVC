import type { Capabilities as CapabilityContract } from '../shared/contracts';
export function Capabilities({
  value,
  error,
}: {
  value: CapabilityContract | null;
  error: string | null;
}) {
  if (!value)
    return (
      <aside aria-label="Capabilities">
        <p>{error ?? 'Checking capabilities…'}</p>
      </aside>
    );
  return (
    <aside className="capabilities" aria-label="Capabilities">
      <p className="mode">
        {value.mode === 'mock' ? 'Mock/Contract Simulation' : 'Live'}
      </p>
      <p>
        Search: {value.search.state} · Account validation:{' '}
        {value.search.accountValidation}
      </p>
      {value.search.reason && <p>{value.search.reason}</p>}
      <p>
        {value.mode === 'live'
          ? 'Model: ' + (value.model ?? 'unavailable')
          : 'Responses and project cards are simulated.'}
      </p>
      <p>
        {value.turnsAvailable
          ? 'Typed questions available.'
          : 'Turns are unavailable. Check server configuration.'}
      </p>
      <p>
        {value.speechAvailable
          ? 'Speech service configured. Playback requires browser audio permission.'
          : 'Speech unavailable. Answer text stays available.'}
      </p>
    </aside>
  );
}
