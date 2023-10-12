import crypto from "crypto"
import { NextApiRequest, NextApiResponse } from "next"

export default (req: NextApiRequest, res: NextApiResponse<{ message?: string; hash?: string }>) => {
  try {
    const { str } = req.query

    if (!str) return res.status(400).json({ message: "Bad Request" })
    if (!process.env.INTERCOM_SECRET) return res.status(500).json({ message: "Internal Server Error" })

    const hmac = crypto.createHmac("sha256", process.env.INTERCOM_SECRET)
    hmac.update(str as string)
    const hmacStr = hmac.digest("hex")

    res.status(200).json({ hash: hmacStr })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Internal Server Error" })
  }
}
