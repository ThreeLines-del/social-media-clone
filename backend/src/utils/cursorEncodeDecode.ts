export const encodeCursor = (id: string) => Buffer.from(id).toString("base64");
export const decodeCursor = (cursor: string) =>
  Buffer.from(cursor, "base64").toString("ascii");
