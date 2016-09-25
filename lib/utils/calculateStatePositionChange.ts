export function calculateStatePositionChange(text: string): {row: number, col: number} {
  const parts: Array<string> = text.split(/\r?\n/g);

  return {
    row: parts.length - 1,
    col: parts[parts.length - 1].length
  };
}