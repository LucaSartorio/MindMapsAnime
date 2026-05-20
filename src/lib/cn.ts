/** Tiny classNames helper (no deps) */
export function cn(
  ...inputs: Array<string | number | false | null | undefined>
): string {
  return inputs.filter(Boolean).join(' ');
}
