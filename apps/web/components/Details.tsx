import type { TurnView } from '../client/turn-controller';
export function Details({ turn }: { turn: TurnView }) {
  return (
    <div className="diagnostics">
      <details>
        <summary>Transcript / details</summary>
        <p>{turn.user || 'No recognized question.'}</p>
        <p>Turn status: {turn.status}</p>
      </details>
      <details>
        <summary>Request trace</summary>
        <ol>
          {turn.trace.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
        {turn.usage && (
          <p>
            Input tokens: {turn.usage.inputTokens ?? 'unavailable'} · Output
            tokens: {turn.usage.outputTokens ?? 'unavailable'} · Search uses:{' '}
            {turn.usage.searchUses ?? 'unavailable'}
          </p>
        )}
      </details>
    </div>
  );
}
