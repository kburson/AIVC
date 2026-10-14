// @vitest-environment jsdom
import { expect, it } from 'vitest';
it('provides a DOM for browser-facing test contracts', () => {
  expect(window.document).toBe(document);
  expect(document.createElement('main').tagName).toBe('MAIN');
});
