import { VercelRequest, VercelResponse } from "@vercel/node";
import { allowCors } from "../allowCors";

async function handler(req: VercelRequest, res: VercelResponse) {
  return res.json({ hello: "world" });
}

export default allowCors(handler);
