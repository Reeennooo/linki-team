import { NextApiRequest, NextApiResponse } from "next"
import { setCookies } from "cookies-next"
import {
  USER_TOKEN_COOKIE,
  MAX_AGE_TOKEN_30_DAYS_IN_SECONDS,
  USER_ID_COOKIE,
  BACKEND_API_URL,
  MAX_AGE_COOKIE_1_DAY_IN_SECONDS,
  USER_TYPE_PM,
} from "utils/constants"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { provider, ...query } = req.query

  // console.log("*** API/[PROVIDER]/CALLBACK ***")
  // console.log(provider, ": ", query)

  try {
    const rawResponse = await fetch(`${BACKEND_API_URL}user/${provider}/callback`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(query),
    })
    const response = await rawResponse.json()

    // console.log("response: ", response)

    if (response.message === "no_roles") {
      setCookies(USER_ID_COOKIE, response.data.id, { req, res, sameSite: "lax" })
      setCookies(
        "auth_soc",
        { type: "registration", provider: provider },
        {
          req,
          res,
          maxAge: MAX_AGE_COOKIE_1_DAY_IN_SECONDS,
          sameSite: "lax",
        }
      )
      res.redirect(`/auth/role`)
      return
    }

    // response.message === "referal_wrong_user_type" - пока что не требует обработки, будет уведомление приходить в центр уведомлений
    if (response && response.data.api_token) {
      setCookies(USER_TOKEN_COOKIE, response.data.api_token, {
        req,
        res,
        maxAge: MAX_AGE_TOKEN_30_DAYS_IN_SECONDS,
        sameSite: "lax",
      })
      setCookies(
        "auth_soc",
        { type: query?.state ? "registration" : "login", provider: provider },
        {
          req,
          res,
          maxAge: MAX_AGE_COOKIE_1_DAY_IN_SECONDS,
          sameSite: "lax",
        }
      )
      if (response.data.type === USER_TYPE_PM && response.data.is_confirmed !== 2) res.redirect("/waitlist")
      if (response.lead_order_id) {
        res.redirect(`/projects/create?projectid=${response.lead_order_id}`)
      } else {
        res.redirect("/dashboard")
      }
    } else {
      res.redirect("/signup")
    }
  } catch (err) {
    console.log("[API/[PROVIDER]/CALLBACK] error: ", err)
    res.redirect(`/signup?auth=false&role=${query.state}`)
  }
}
