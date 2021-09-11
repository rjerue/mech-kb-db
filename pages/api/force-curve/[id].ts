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
  const basePath =
    process.env.NODE_ENV === "production"
      ? path.join(process.cwd(), ".next/server/chunks")
      : process.cwd();
  const dir = path.resolve(
    ...[basePath, "data", "force-curve", `${uuid}.json`]
  );
  const file = await fs.readFile(dir);
  const fileAsJson = JSON.parse(file.toString());
  res.status(200).json(fileAsJson);
}
