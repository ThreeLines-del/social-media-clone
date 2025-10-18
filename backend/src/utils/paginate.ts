import { Document, Model, Types } from "mongoose";

export async function paginate<T extends Document>(
  query: any,
  first: number,
  after: string,
  model: Model<T>
) {
  if (after) {
    const decoded = Buffer.from(after, "base64").toString("ascii");
    if (Types.ObjectId.isValid(decoded)) {
      query._id = { $gt: new Types.ObjectId(decoded) };
    }
  }

  const items = await model
    .find(query)
    .sort({ _id: 1 })
    .limit(first + 1);

  const hasNextPage = items.length > first;
  const edges = items.slice(0, first).map((item) => ({
    node: item,
    cursor: Buffer.from(item._id.toString()).toString("base64"),
  }));

  const endCursor = edges.length > 0 ? edges[edges.length - 1].cursor : null;
  const { _id, ...rest } = query;
  const totalCount = await model.countDocuments(rest);

  return {
    edges,
    pageInfo: {
      hasNextPage,
      endCursor,
    },
    totalCount,
  };
}
