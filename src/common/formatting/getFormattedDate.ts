export function getFormattedDate(date: Date): string {
  const year = date.getFullYear().toString();
  const month = `${date.getMonth()}`.padStart(2, '0');
  const day = `${date.getDay()}`.padStart(2, '0');
  const hour = `${date.getHours()}`.padStart(2, '0');
  const minutes = `${date.getMinutes()}`.padStart(2, '0');
  const seconds = `${date.getSeconds()}`.padStart(2, '0');
  const array = [year, month, day, hour, minutes, seconds];

  return array.join('-');
}
