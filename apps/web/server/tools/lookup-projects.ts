export function lookupArguments(
  name: string,
  input: unknown,
): { name?: string } {
  if (
    name !== 'lookup_projects' ||
    !input ||
    typeof input !== 'object' ||
    Array.isArray(input)
  )
    throw Error('Invalid lookup arguments.');
  const v = input as Record<string, unknown>;
  if (
    Object.keys(v).some((k) => k !== 'name') ||
    (v.name !== undefined &&
      (typeof v.name !== 'string' || !v.name.trim() || v.name.length > 200))
  )
    throw Error('Invalid lookup arguments.');
  return v.name === undefined ? {} : { name: v.name as string };
}
export const lookupTool = {
  name: 'lookup_projects',
  description: 'Look up synthetic project facts from the project service.',
  input_schema: {
    type: 'object' as const,
    properties: { name: { type: 'string', minLength: 1, maxLength: 200 } },
    additionalProperties: false,
  },
};
