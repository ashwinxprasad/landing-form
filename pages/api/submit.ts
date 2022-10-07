// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import airtable from "airtable";

const base = airtable.base(process.env.BASE_ID as string);
const table = base(process.env.TABLE_NAME as string);

async function findAllUsers() {
  const data = await table
    .select({
      view: "Grid view",
    })
    .all();
  const users: any = [];
  for (const user of data) {
    users.push({ email: user.get("Email"), name: user.get("Name") });
  }
  return users;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const data = await findAllUsers();
  console.log({ data: req.body });
  res.status(200).json({ data: req.body });
}
