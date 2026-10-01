/**
 * Minimal, dependency-free flag parser: `--key value`, `--key=value`, `--flag`.
 * Unknown flags are errors (a typo must never be silently ignored).
 */
export type FlagSpec = Record<string, 'string' | 'boolean'>;
export type ParsedArgs = { flags: Record<string, string | boolean>; errors: string[] };

export function parseArgs(argv: string[], spec: FlagSpec): ParsedArgs {
  const flags: Record<string, string | boolean> = {};
  const errors: string[] = [];
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (!arg.startsWith('--')) {
      errors.push(`unexpected argument "${arg}"`);
      continue;
    }
    const [rawKey, inline] = arg.slice(2).split(/=(.*)/s, 2);
    const kind = spec[rawKey];
    if (!kind) {
      errors.push(`unknown option --${rawKey}`);
      continue;
    }
    if (kind === 'boolean') {
      flags[rawKey] = inline === undefined ? true : inline !== 'false';
      continue;
    }
    const value = inline ?? argv[i + 1];
    if (value === undefined || (inline === undefined && value.startsWith('--'))) {
      errors.push(`option --${rawKey} needs a value`);
      continue;
    }
    if (inline === undefined) i++;
    flags[rawKey] = value;
  }
  return { flags, errors };
}
