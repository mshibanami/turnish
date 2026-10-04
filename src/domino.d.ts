declare module '@mixmark-io/domino' {
  const domino: {
    createDocument(html?: string, force?: boolean): Document;
  };
  export default domino;
}
