import clientPromise from "../mongodb";

export const makeUserCollection = async () => {
  const client = await clientPromise;
  const collection = client.db("flaq").collection("users");
  collection.createIndex({ email: 1 }, { unique: true });
  return collection;
};
