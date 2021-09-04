// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs/promises";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any[]>
) {
  const { id } = req.query;
  const uuid = id as string;
  const file = await fs.readFile(
    `${process.cwd()}/data/force-curve/${uuid}.json`
  );
  const fileAsJson = JSON.parse(file.toString());
  res.status(200).json(fileAsJson);
}
