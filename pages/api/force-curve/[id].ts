// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs/promises";
import path from "path";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any[]>
) {
  const { id } = req.query;
  const uuid = id as string;
  const dir = path.resolve("./public", "force-curve", `${uuid}.json`);
  const file = await fs.readFile(dir);
  const fileAsJson = JSON.parse(file.toString());
  res.status(200).json(fileAsJson);
}
