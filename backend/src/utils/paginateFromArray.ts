import { Document } from "mongoose";
import { decodeCursor, encodeCursor } from "./cursorEncodeDecode.js";

export function paginateFromArray<T extends Document>(
  items: T[],
  first: number,
  after: string
) {
  const startIndex = after
    ? items.findIndex((i) => i._id.toString() === decodeCursor(after)) + 1
    : 0;

  const sliced = items.slice(startIndex, startIndex + first);
  const hasNextPage = startIndex + first < items.length;
  const endCursor = sliced.length
    ? encodeCursor(sliced[sliced.length - 1].id)
    : null;

  const totalCount = items.length;

  return {
    edges: sliced.map((i) => ({ node: i, cursor: encodeCursor(i.id) })),
    pageInfo: { hasNextPage, endCursor },
    totalCount,
  };
}
