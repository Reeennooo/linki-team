import { NextApiRequest, NextApiResponse } from "next"
import { BACKEND_API_URL, MANAGER_TEAM_CODE, REFERRAL_USER_CODE, REFERRAL_VACANCY_CODE } from "utils/constants"
import { paramsStringify } from "utils/queryStringUtils"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { provider, role } = req.query
  const vacancyCode = req.query[REFERRAL_VACANCY_CODE]
  const userReferralCode = req.query[REFERRAL_USER_CODE]
  const managerReferralCode = req.query[MANAGER_TEAM_CODE]
  const lid_id = req.query.lid_id

  // console.log("*** API/[PROVIDER]/INDEX ***")
  // console.log(req.query)
  // console.log("provider: ", provider)
  // console.log("role: ", role)

  try {
    const queryStr = paramsStringify({
      role: role || undefined,
      referal_code: vacancyCode,
      register_code: userReferralCode,
      manager_team_code: managerReferralCode,
      lid_id: lid_id || undefined,
    })
    const rawResponse = await fetch(`${BACKEND_API_URL}user/social/${provider}?${queryStr}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
    const url = await rawResponse.text()
    // console.log("provider index: ", url)
    res.redirect(url ? url : "/signup")
  } catch (err) {
    console.log("[API/[PROVIDER]/INDEX] error: ", err)
    res.redirect(`/signup?auth=false&role=${role}`)
  }
}
