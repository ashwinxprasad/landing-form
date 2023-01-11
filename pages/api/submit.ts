// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/mongodb";
import airtable from "airtable";
import moment from "moment";
import NextCors from "nextjs-cors";
import validator from "validator";
import { makeUserCollection } from "../../lib/collections/user";
import { Collection } from "mongoose";

const base = airtable.base(process.env.BASE_ID as string);
const table = base(process.env.TABLE_NAME as string);

async function findAllUsers() {
  const data = await table
    .select({
      view: "Grid view",
    })
    .all();
  const users: string[] = [];
  for (const user of data) {
    users.push(user.get("Email") as string);
  }
  return users;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await NextCors(req, res, {
    // Options
    methods: ["POST", "OPTION"],
    origin: "*",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  });
  const email = req.body.data["user_email"];

  if (!validator.isEmail(email)) {
    console.log("Error validating", email);
    return res.status(400).json({ oops: "error" });
  }

  try {
    const userCollection: Collection = await makeUserCollection();
    await userCollection.insertOne({
      email,
      createdAt: new Date(),
      level: 0,
    });
  } catch (e) {
    console.log(e);
  }

  res.status(200).json({ data: req.body });
}
