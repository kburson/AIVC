// @vitest-environment jsdom
import { afterEach, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { Answer, safeUrl } from '../../apps/web/components/Answer';
import { ProjectCard } from '../../apps/web/components/ProjectCard';
afterEach(cleanup);
it.each([
  'javascript:alert(1)',
  'data:text/html,x',
  'relative/path',
  'not a url',
  'https://secret:password@example.test',
])('keeps unsafe reference %s readable without a link', (url) => {
  render(
    <Answer
      text={'[Readable](' + url + ')'}
      sources={[{ title: 'Source', url }]}
    />,
  );
  expect(screen.queryAllByRole('link')).toHaveLength(0);
  expect(screen.getByText('Source')).toBeTruthy();
  expect(safeUrl(url)).toBeNull();
});
it('renders safe HTTP(S) links and ignores raw HTML', () => {
  render(
    <Answer
      text={
        '[Reference](https://example.test/path)\n\n<script>alert(1)</script>'
      }
      sources={[{ title: 'Other', url: 'http://example.test' }]}
    />,
  );
  const links = screen.getAllByRole('link');
  expect(links).toHaveLength(2);
  expect(links[0].getAttribute('rel')).toBe('noopener noreferrer');
  expect(links[0].getAttribute('target')).toBe('_blank');
  expect(document.querySelector('script')).toBeNull();
});
it('renders catalog fields as text without inventing a project URL', () => {
  render(
    <ProjectCard
      project={{
        id: 'atlas',
        name: 'Atlas',
        status: 'active',
        ownerTeam: 'North',
        openItems: 3,
        summary: 'Synthetic catalog',
      }}
    />,
  );
  expect(screen.getByText('Atlas')).toBeTruthy();
  expect(screen.getByText(/North/)).toBeTruthy();
  expect(screen.getByText(/3 open items/)).toBeTruthy();
  expect(screen.queryByRole('link')).toBeNull();
});
