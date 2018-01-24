declare module 'network-byte-order' {
  export function ntohl(buffer: Uint8Array, index: number): number;
  export function htonl(buffer: Uint8Array, index: number, value: number): void;
}
