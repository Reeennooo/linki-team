import InputGroup from "components/ui/InputGroup/InputGroup"
import Rating from "components/ui/Rating/Rating"
import React, { useEffect, useRef } from "react"
import styles from "./ProfileInfoBlock.module.scss"
import CameraIcon from "public/assets/svg/camera-icon.svg"
import { USER_TYPE_EXPERT } from "utils/constants"

interface Props {
  userType?: number
  formik: any
  props?: any
  forPage?: string
}

const ProfileInfoBlock: React.FC<Props> = ({ userType, formik, forPage, ...props }) => {
  const addPhotoFn = (event) => {
    const reader = new FileReader()
    reader.readAsDataURL(event.currentTarget.files[0])
    reader.onload = () => formik.setFieldValue("avatar", reader.result)
    formik.setFieldValue("avatarFile", event.currentTarget.files[0])
  }

  return (
    <div className={styles.profileInfo}>
      <div className={styles.profileInfo__photo} id="photoedit">
        <label className={styles.profileInfo__preview}>
          <div
            className={styles["profileInfo__preview-wp"]}
            style={{ backgroundImage: "url(/assets/icons/user-grey.svg)" }}
          >
            {formik.values.avatar?.length > 0 && <img src={formik.values.avatar} alt="" />}
          </div>
          <div className={styles["profileInfo__preview-icon"]}>
            <CameraIcon />
          </div>
          <input type="file" accept="image/*" hidden onChange={(event) => addPhotoFn(event)} />
        </label>
        {/* <div className={styles["profileInfo__rating"]}>
          <Rating rating={formik.values.rating ?? 2} mod="md" disabled label />
        </div> */}
      </div>
      <div className={styles.profileInfo__form}>
        {forPage === "team" && (
          <div className={`${styles["profileInfo__form-block"]} ${styles["profileInfo__form-block--full-width"]}`}>
            <div className={styles["profileInfo__form-label"]}>Team name</div>
            <InputGroup
              placeholder={"Enter a team name"}
              type={"text"}
              fieldProps={formik.getFieldProps("teamName")}
              smClass
              addClass={styles["profileInfo__form-input"]}
              error={formik.touched.teamName && formik.errors && formik.errors.teamName ? formik.errors.teamName : ""}
              editId={"firstnameedit"}
            />
          </div>
        )}
        {!forPage && (
          <>
            <div
              className={`${styles["profileInfo__form-block"]} ${userType === USER_TYPE_EXPERT ? "" : styles.userName}`}
            >
              <div className={styles["profileInfo__form-label"]}>First Name</div>
              <InputGroup
                placeholder={"Enter First Name"}
                type={"text"}
                fieldProps={formik.getFieldProps("firstName")}
                smClass
                addClass={styles["profileInfo__form-input"]}
                error={
                  formik.touched.firstName && formik.errors && formik.errors.firstName ? formik.errors.firstName : ""
                }
                editId={"firstnameedit"}
              />
            </div>
            <div className={`${styles["profileInfo__form-block"]} ${userType === 2 ? "" : styles.userSurname}`}>
              <div className={styles["profileInfo__form-label"]}>Last Name</div>
              <InputGroup
                placeholder={"Enter Last Name"}
                type={"text"}
                fieldProps={formik.getFieldProps("lastName")}
                smClass
                addClass={styles["profileInfo__form-input"]}
                error={formik.touched.lastName && formik.errors && formik.errors.lastName ? formik.errors.lastName : ""}
                editId={"lasttnameedit"}
              />
            </div>
            {/* {userType === USER_TYPE_EXPERT && (
              <div className={`${styles["profileInfo__form-block"]} ${styles["profileInfo__form-block_pay"]}`}>
                <div className={styles["profileInfo__form-label"]}>Hourly pay</div>
                <InputGroup
                  placeholder={"$"}
                  type={"number"}
                  fieldProps={formik.getFieldProps("pay")}
                  smClass
                  addClass={styles["profileInfo__form-input"]}
                  inputPrefix="$"
                  error={formik.touched.pay && formik.errors && formik.errors.pay ? formik.errors.pay : ""}
                />
              </div>
            )} */}
          </>
        )}
      </div>
    </div>
  )
}

export default ProfileInfoBlock
