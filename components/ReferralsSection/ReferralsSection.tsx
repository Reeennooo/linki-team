import DetailedPopupInviteExpert from "components/DetailedPopup/DetailedPopupInviteExpert/DetailedPopupInviteExpert"
import { useEffect, useState } from "react"
import styles from "./ReferralsSection.module.scss"
import PersonCard from "components/PersonCard/PersonCard"
import { useGetReferralsQuery } from "redux/api/user"
import { useAuth } from "hooks/useAuth"
import { USER_TYPE_CUSTOMER, USER_TYPE_EXPERT } from "utils/constants"
import { closeModal, openModal, selectModals } from "redux/slices/modals"
import ModalUser from "components/Modals/ModalUser/ModalUser"
import { useAppDispatch, useAppSelector } from "hooks"
import { updateApiParams } from "redux/slices/apiParams"
import IconDatabase from "public/assets/svg/database.svg"

const ReferralsSection = () => {
  const { data: referrals, isLoading, isFetching: isFetchingReferras } = useGetReferralsQuery()

  const { modalsList } = useAppSelector(selectModals)

  const dispatch = useAppDispatch()
  const {
    user: { referal_code },
  } = useAuth()

  const [refCode, setRefCode] = useState("")
  const [referralsList, setReferralsList] = useState([])

  useEffect(() => {
    if (referal_code) setRefCode(referal_code)
  }, [referal_code])

  useEffect(() => {
    if (referrals) setReferralsList(referrals)
  }, [referrals])

  const referralPersonHandle = (id) => {
    if (modalsList.includes("modal-user-referral")) return
    dispatch(updateApiParams({ field: "currentUserID", data: id }))
    dispatch(openModal("modal-user-referral"))
  }

  const list = referralsList?.map((person) => {
    return (
      <PersonCard
        key={person.id}
        {...person}
        userId={person.id}
        rating={null}
        position={
          person.type === USER_TYPE_CUSTOMER
            ? "Client"
            : person.type === USER_TYPE_EXPERT
            ? "Expert"
            : "Project manager"
        }
        onClick={() => {
          referralPersonHandle(person.id)
        }}
      />
    )
  })

  return (
    <div className={styles.referrals}>
      <DetailedPopupInviteExpert
        referralCode={refCode}
        title={"Invite an user to the platform"}
        shareTitle={"Share this site"}
        isReferralReg
      />
      <div className={styles.referrals__main}>
        {isFetchingReferras ? (
          <div className={styles.loading} />
        ) : (
          <>
            {list.length > 0 ? (
              list
            ) : (
              <div className={styles["referrals__empty-list"]}>
                <span className={styles["referrals__empty-btn"]}>
                  <IconDatabase />
                </span>
                <p>You don&apos;t have any referrals yet</p>
              </div>
            )}
          </>
        )}
      </div>
      <ModalUser
        isOpen={modalsList.includes("modal-user-referral")}
        onClose={() => {
          dispatch(closeModal("modal-user-referral"))
        }}
        headerUserClickable={false}
        isFooterExist={false}
      />
    </div>
  )
}

export default ReferralsSection
