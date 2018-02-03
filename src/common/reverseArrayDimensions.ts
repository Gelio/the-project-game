/**
 * @return Array with reversed dimensions
 */
export function reverseArrayDimensions<T>(array: T[][]): T[][] {
  if (array.length === 0) {
    return [...array];
  }

  const reversed: T[][] = [];
  const width = array[0].length;
  for (let x = 0; x < width; x++) {
    const column: T[] = [];
    reversed.push(column);

    array.forEach(row => column.push(row[x]));
  }

  return reversed;
}
