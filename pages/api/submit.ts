// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import airtable from "airtable";
import moment from "moment";
import NextCors from "nextjs-cors";

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
    methods: ['POST', "OPTION"],
    origin: '*',
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  });

  const data = await findAllUsers();
  const email = req.body.data["user_email"];
  if (!data.includes(email)) {
    await table.create([
      {
        fields: {
          Email: email,
          Date: moment().format("YYYY-MM-DD"),
          Name: "Webflow Form",
        },
      },
    ]);
    console.log("Record added");
  } else {
    console.log("Redundant email");
  }
  res.status(200).json({ data: req.body });
}
