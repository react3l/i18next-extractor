export function getMarkedPattern(marker: string) {
  return new RegExp(`${marker}\\(['"]([a-zA-Z0-9]+((\\.[a-zA-Z0-9]+)*))['"]\\)`, 'gm');
}
