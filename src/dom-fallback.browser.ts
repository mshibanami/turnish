export function parseWithoutNativeDOM(_html: string): Document {
  throw new Error('Turnish requires a DOM implementation, but none is available in this environment.');
}
