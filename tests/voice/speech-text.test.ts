import { expect, it } from 'vitest';
import {
  SpeechText,
  scannerWhitespace,
} from '../../apps/web/client/voice/speech-text';
import { wireDeltaFixture } from '../helpers/wire-contract-fixtures';
const cases: Array<[string, string[]]> = [
  ['Hello. Next', ['Hello.', 'Next']],
  ['Ask (Dr. Jones) now. Next.', ['Ask (Dr. Jones) now.', 'Next.']],
  [
    'Dr. Jones met the U.S. team. The value is 3.5.',
    ['Dr. Jones met the U.S. team.', 'The value is 3.5.'],
  ],
  ['See https://example.com/path now. Next.', ['See now.', 'Next.']],
  ['First [1]. Next [label](https://x.test).', ['First.', 'Next label.']],
  ['Say `secret. no` hello. Next.', ['Say hello.', 'Next.']],
  [
    'Before ```js\nhidden. text\n``` after. Final fragment',
    ['Before after.', 'Final fragment'],
  ],
  ['Value 3.5 and 12 are ordinary.', ['Value 3.5 and 12 are ordinary.']],
  ['First 【citation. 1】 answer.', ['First answer.']],
];
for (const [input, expected] of cases)
  it('sanitizes independently of every split: ' + input, () => {
    for (let split = 0; split <= input.length; split++) {
      const s = new SpeechText(120);
      expect([
        ...s.push(input.slice(0, split)),
        ...s.push(input.slice(split)),
        ...s.finish(),
      ]).toEqual(expected);
    }
    const s = new SpeechText(120);
    expect([
      ...Array.from(input).flatMap((char) => s.push(char)),
      ...s.finish(),
    ]).toEqual(expected);
  });
it.each([
  'The value is 3.',
  'https://example.',
  'Dr.',
  'Open [1',
  'Open [label](',
  'Open `',
  'Open ``',
  'Open ```js\ncode.',
])('holds ambiguous unfinished token %s', (text) => {
  const s = new SpeechText();
  expect(s.push(text)).toEqual([]);
});
it('emits a stable sentence before answer completion and uses literal whitespace', () => {
  expect(scannerWhitespace(' ')).toBe(true);
  const s = new SpeechText();
  expect(s.push('Hello. Next')).toEqual(['Hello.']);
  expect(s.finish()).toEqual(['Next']);
  expect(s.finish()).toEqual([]);
});
it('speaks canonical preamble plus separator while later answer is still pending', () => {
  const s = new SpeechText();
  expect(s.push(wireDeltaFixture[0])).toEqual([]);
  expect(s.push(wireDeltaFixture[1])).toEqual(['Let me check Atlas.']);
  expect(s.push(wireDeltaFixture[2])).toEqual([]);
  expect(s.finish()).toEqual([
    'Atlas is active, owned by North, with 3 open items.',
  ]);
});
it('splits stable sanitized sentences at the capability cap and reports omitted overlong tokens', () => {
  const omitted: string[] = [];
  const s = new SpeechText(10, (reason) => omitted.push(reason));
  expect(s.push('One two three four. Next')).toEqual([
    'One two',
    'three',
    'four.',
  ]);
  expect(s.finish()).toEqual(['Next']);
  const long = new SpeechText(5, (r) => omitted.push(r));
  expect([...long.push('abcdefgh. '), ...long.finish()]).toEqual([]);
  expect(omitted).toEqual(['SPEECH_TOKEN_TOO_LONG']);
});
it('counts raw retained text and conservatively drops unfinished structured suffixes at finish', () => {
  const s = new SpeechText();
  s.push('Read [open');
  expect(s.pendingChars()).toBe(10);
  expect(s.finish()).toEqual(['Read']);
  expect(s.pendingChars()).toBe(0);
  const u = new SpeechText();
  u.push('Read https://unclosed');
  expect(u.finish()).toEqual(['Read']);
});

it('retains an ordered-list prefix with its item across every chunk split', () => {
  const input =
    'First answer.\n\n  2. Atlas is active.\n3. Beacon is paused. Next';
  const expected = [
    'First answer.',
    '2. Atlas is active.',
    '3. Beacon is paused.',
    'Next',
  ];
  for (let split = 0; split <= input.length; split++) {
    const scanner = new SpeechText();
    expect([
      ...scanner.push(input.slice(0, split)),
      ...scanner.push(input.slice(split)),
      ...scanner.finish(),
    ]).toEqual(expected);
  }
  const scanner = new SpeechText();
  expect(scanner.push('2. ')).toEqual([]);
  expect(scanner.push('Atlas is active. Next')).toEqual([
    '2. Atlas is active.',
  ]);
  expect(scanner.finish()).toEqual(['Next']);
});

it('preserves numeric-only answers and decimal model versions near list items', () => {
  const numeric = new SpeechText();
  expect(numeric.push('2. ')).toEqual([]);
  expect(numeric.finish()).toEqual(['2.']);
  const scanner = new SpeechText();
  expect([
    ...scanner.push('2. Claude 3.7 costs 10.50 today. Next'),
    ...scanner.finish(),
  ]).toEqual(['2. Claude 3.7 costs 10.50 today.', 'Next']);
});

it('keeps the observed detailed-answers phrase together at an existing clause boundary', () => {
  const input =
    'perform iterative searches, refining queries based on previous results to generate more detailed answers. Next';
  const expected = [
    'perform iterative searches,',
    'refining queries based on previous results to generate more detailed answers.',
    'Next',
  ];
  for (let split = 0; split <= input.length; split++) {
    const scanner = new SpeechText(84);
    expect([
      ...scanner.push(input.slice(0, split)),
      ...scanner.push(input.slice(split)),
      ...scanner.finish(),
    ]).toEqual(expected);
  }
});

it.each([',', ';', ':', '—'])(
  'prefers an existing %s clause boundary within the unchanged cap',
  (punctuation) => {
    const scanner = new SpeechText(40);
    const segments = [
      ...scanner.push(
        'First useful clause' +
          punctuation +
          ' second useful clause stays together. Next',
      ),
      ...scanner.finish(),
    ];
    expect(segments).toEqual([
      'First useful clause' + punctuation,
      'second useful clause stays together.',
      'Next',
    ]);
    expect(segments.every((segment) => segment.length <= 40)).toBe(true);
  },
);

it('does not reinterpret an inline numeric sentence as a line-leading list item', () => {
  const input = 'Count now. 2. Next answer.';
  for (let split = 0; split <= input.length; split++) {
    const scanner = new SpeechText();
    expect([
      ...scanner.push(input.slice(0, split)),
      ...scanner.push(input.slice(split)),
      ...scanner.finish(),
    ]).toEqual(['Count now.', '2.', 'Next answer.']);
  }
});
