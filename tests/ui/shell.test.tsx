// @vitest-environment jsdom
import { render, screen, cleanup } from '@testing-library/react';
import { afterEach, expect, it } from 'vitest';
import Page from '../../apps/web/app/page';
afterEach(cleanup);
it('renders the initial usable reference shell without future feature imports', () => {
  render(<Page />);
  expect(
    screen.getByRole('heading', { name: 'Voice BFF reference' }),
  ).toBeTruthy();
  expect(screen.getByText(/synthetic project catalog/i)).toBeTruthy();
});
