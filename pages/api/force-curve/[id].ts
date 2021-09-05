// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs/promises";
import path from "path";

const isVercel = typeof process.env.VERCEL !== "undefined";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any[]>
) {
  fs.readdir(process.cwd()).then((files) =>
    files.forEach((file) => {
      console.log(file);
    })
  );
  console.log("DEBUG", __dirname, __filename);
  const { id } = req.query;
  const uuid = id as string;
  const folderPath = isVercel
    ? [process.cwd(), "force-curve"]
    : ["./public", "force-curve"];
  const dir = path.resolve(...folderPath.concat(`${uuid}.json`));
  const file = await fs.readFile(dir);
  const fileAsJson = JSON.parse(file.toString());
  res.status(200).json(fileAsJson);
}
