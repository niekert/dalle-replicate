import type { VercelRequest, VercelResponse } from "@vercel/node";
import { allowCors } from "../allowCors";

export const maxDuration = 250; // This function can run for a maximum of 200 seconds

async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "POST") {
    try {
      const resp = await fetch("https://api.openai.com/v1/images/generations", {
        headers: {
          // TODO: 🤠
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(req.body),
      });

      const json = await resp.json();

      return res.json(json);
    } catch (err) {
      return res
        .status(500)
        .json({ error: "Something went wrong" + err.message });
    }
  }

  return res.status(405).json({ error: "Methode not allowed" });
}

export default allowCors(handler);
