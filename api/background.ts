import type { VercelRequest, VercelResponse } from "@vercel/node";
import { allowCors } from "../allowCors";

export const maxDuration = 200; // This function can run for a maximum of 200 seconds

async function waitForSuccess(json: any) {
  console.log("received json", json);
  if (json.status === "succeeded") return json;

  if (json.status === "failed") {
    throw new Error("failed to get replicate status");
  }

  await new Promise((resolve) => setTimeout(resolve, 500));

  const nextJson = await fetch(json.urls.get, {
    headers: {
      method: "POST",
      "Content-Type": "application/json",
      Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
    },
    method: "GET",
  }).then((resp) => resp.json());

  return waitForSuccess(nextJson);
}

async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "POST") {
    try {
      const { url } = req.body;

      console.log("with url", url);

      const resp = await fetch("https://api.replicate.com/v1/predictions", {
        headers: {
          method: "POST",
          "Content-Type": "application/json",
          Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
        },
        method: "POST",
        body: JSON.stringify({
          version:
            "fb8af171cfa1616ddcf1242c093f9c46bcada5ad4cf6f2fbe8b81b330ec5c003",
          input: {
            image: url,
          },
        }),
      });

      const json = await resp.json();
      console.log("initial", json);

      const result = await waitForSuccess(json);

      console.log("resp json", result);

      return res.json(result);
    } catch (err) {
      return res
        .status(500)
        .json({ error: "Something went wrong" + err.message });
    }
  }

  return res.status(405).json({ error: "Methode niet welkom allowed" });
}

export default allowCors(handler);
