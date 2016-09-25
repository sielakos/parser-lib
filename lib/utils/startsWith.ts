export function startsWith(str: string, start: string): boolean {
  const length = start.length;

  return str.substr(0, length) === start;
}