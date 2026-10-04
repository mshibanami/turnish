import domino from '@mixmark-io/domino';

export function parseWithoutNativeDOM(html: string): Document {
  return domino.createDocument(html);
}
