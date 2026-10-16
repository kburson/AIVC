import Markdown from 'react-markdown';
import type { ReactNode } from 'react';
import type { Source } from '../shared/contracts';
export function safeUrl(value: string): string | null {
  try {
    const u = new URL(value);
    return (u.protocol === 'http:' || u.protocol === 'https:') &&
      !u.username &&
      !u.password
      ? u.href
      : null;
  } catch {
    return null;
  }
}
function Reference({ href, children }: { href?: string; children: ReactNode }) {
  const url = href ? safeUrl(href) : null;
  return url ? (
    <a href={url} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ) : (
    <span>{children}</span>
  );
}
export function Answer({
  text,
  sources = [],
}: {
  text: string;
  sources?: Source[];
}) {
  return (
    <div className="answer">
      <Markdown
        skipHtml
        urlTransform={(value) => safeUrl(value) ?? ''}
        components={{
          a: ({ href, children }) => (
            <Reference href={href}>{children}</Reference>
          ),
          img: ({ alt }) => <span>{alt}</span>,
        }}
      >
        {text}
      </Markdown>
      {sources.length > 0 && (
        <ul aria-label="Sources">
          {sources.map((source, i) => (
            <li key={i}>
              <Reference href={source.url}>{source.title}</Reference>
              {source.citedText && <p>{source.citedText}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
