import DefaultBtn from "components/ui/btns/DefaultBtn/DefaultBtn"
import InputGroup from "components/ui/InputGroup/InputGroup"
import { useFormik } from "formik"
import { useEffect, useState } from "react"
import styles from "./DetailedPopupInviteExpert.module.scss"
import IconClose from "public/assets/svg/close.svg"
import { SITE_URL } from "utils/constants"
import { useSendInviteEmailMutation } from "redux/api/team"
import { useAppSelector } from "hooks"
import { selectApiParams } from "redux/slices/apiParams"
import { useSendUserInviteEmailMutation } from "redux/api/user"
import Share from "components/Share/Share"
import { useSendEmailInviteToTeamMutation } from "redux/api/pmteam"
import { addPopupNotification } from "utils/addPopupNotification"

interface Props {
  addClass?: string
  referralCode: string
  title?: string
  isReferralReg?: boolean
  shareTitle?: string
  currentPmTeamId?: number
  referalType?: string
}

const DetailedPopupInviteExpert: React.FC<Props> = ({
  addClass,
  referralCode,
  title = "Invite an expert to the platform",
  isReferralReg,
  shareTitle = "Share this Job",
  currentPmTeamId = null,
  referalType,
}) => {
  const [sendInviteEmail, resultSendInviteEmail] = useSendInviteEmailMutation()
  const [sendInvteToPmTeam] = useSendEmailInviteToTeamMutation()
  const [sendUserInviteEmail, resultSendUserInviteEmail] = useSendUserInviteEmailMutation()

  const { activeTeamMemberIDVacancy, teamMemberID, activeVacancyIDAtWork } = useAppSelector(selectApiParams)

  const [iconsOpen, setIconsOpen] = useState(false)

  const formik = useFormik({
    initialValues: {
      email: "",
      link: `${SITE_URL}signup?${referalType ? referalType : isReferralReg ? "ref_code" : "rv_code"}=${referralCode}`,
    },
    validate(values) {
      let errors = {}
      if (!values.email) {
        errors = { ...errors, email: "The email field is required" }
      } else if (
        values.email !== "" &&
        !/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(
          values.email
        )
      ) {
        errors = {
          ...errors,
          email: `Enter the correct registered mail`,
        }
      }
      return errors
    },
    onSubmit(values) {
      if (currentPmTeamId) {
        sendInvteToPmTeam({ teamId: currentPmTeamId, email: values.email })
      } else {
        if (isReferralReg) {
          sendUserInviteEmail({ email: values.email })
        } else {
          sendInviteEmail({ team_member_id: teamMemberID, email: values.email })
        }
      }
      addPopupNotification({
        title: "Invite",
        txt: `You ${title}`,
      })
      formik.setSubmitting(false)
      formik.setFieldValue("email", "")
    },
  })

  useEffect(() => {
    formik.setFieldValue(
      "link",
      `${SITE_URL}signup?${referalType ? referalType : isReferralReg ? "ref_code" : "rv_code"}=${referralCode}`
    )
  }, [referralCode])

  const copyFn = () => {
    navigator.clipboard.writeText(formik.values.link)
  }

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <div className={`invite-expert ${styles["invite-expert"]} ${addClass ? addClass : ""}`}>
          <h4 className={`${styles["invite-expert__title"]}`}>{title}</h4>
          <div className={`invite-expert__inputs ${styles["invite-expert__inputs"]}`}>
            <InputGroup
              type={"text"}
              placeholder={"Enter email"}
              fieldProps={formik.getFieldProps("email")}
              // error={formik.touched.email && formik.errors && formik.errors.email ? formik.errors.email : ""}
              smClass={true}
              absError={true}
              addClass={`invite-expert__inp-group ${styles["invite-expert__inp-group"]}`}
            />
            <DefaultBtn
              txt={"Send Invite"}
              disabled={!formik.isValid || !formik.dirty}
              minWidth={false}
              addClass={`invite-expert__send-btn ${styles["send-btn"]}`}
              type={"submit"}
            />
          </div>
        </div>
      </form>
      <div className={`${styles["invite-expert"]} ${addClass ? addClass : ""}`}>
        <h4 className={`${styles["invite-expert__title"]}`}>Link to share</h4>
        <div className={`${styles["invite-expert__inputs"]}`}>
          <InputGroup
            type={"text"}
            placeholder={""}
            fieldProps={formik.getFieldProps("link")}
            smClass={true}
            absError={true}
            addClass={`invite-expert__inp-group ${styles["invite-expert__inp-group"]} ${styles["share-link-input"]}`}
          />
          <DefaultBtn
            txt={"Copy"}
            minWidth={false}
            mod={"transparent-grey"}
            addClass={`invite-expert__copy-btn ${styles["copy-btn"]}`}
            onClick={copyFn}
          />
          <DefaultBtn
            txt={""}
            minWidth={false}
            mod={"transparent-grey"}
            icon={"share"}
            addClass={`invite-expert__share-btn ${styles["share-btn"]}`}
            onClick={() => setIconsOpen(true)}
          />
        </div>
        <div
          className={`${styles["invite-expert__share-block"]} ${styles["share-popup"]} ${
            iconsOpen ? styles["is-active"] : ""
          }`}
        >
          <span onClick={() => setIconsOpen(false)} className={`${styles["share-popup__close"]}`}>
            <IconClose />
          </span>
          <h4 className={`${styles["invite-expert__share-title"]}`}>{shareTitle}</h4>
          <Share
            link={`${SITE_URL}signup?${isReferralReg ? "ref_code" : "rv_code"}=${referralCode}`}
            list={["facebook", "twitter", "linkedIn", "whatsapp", "telegram"]}
          />
        </div>
      </div>
    </>
  )
}

export default DetailedPopupInviteExpert
