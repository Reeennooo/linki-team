// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next"
const ogs = require("open-graph-scraper")

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { url } = req.query

  try {
    if (!url || typeof url !== "string") {
      return res.status(400).json({ message: "Bad Request" })
    }
    const urls = url.split(",")

    await Promise.all(
      urls.map((link) => {
        return new Promise((resolve) => {
          ogs({
            url: link,
            // headers: {
            //   "user-agent": "Googlebot/2.1 (+http://www.google.com/bot.html)",
            // },
          })
            .then(async (data) => {
              const { result } = data

              if (result) {
                const {
                  requestUrl,
                  ogSiteName,
                  ogTitle,
                  ogDescription,
                  ogImage: { url: imageUrl },
                  ogUrl,
                } = result

                resolve({
                  url: ogUrl || requestUrl,
                  site_name: ogSiteName,
                  title: ogTitle,
                  description: ogDescription,
                  image_url: imageUrl,
                })
              } else {
                resolve({ url: link })
              }
            })
            .catch(() => {
              resolve({ url: link })
            })
        })
      })
    )
      .then((results) => {
        res.status(200).json(results)
      })
      .catch(() => {
        res.status(500).json({ message: "failed" })
      })
  } catch (err) {
    console.log("catch - error message: ", err?.result?.error)
    res.status(500).json({ message: "failed" })
  }
}
