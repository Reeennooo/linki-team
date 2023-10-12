import Checkbox from "components/ui/Checkbox/Checkbox"
import TabsLinear from "components/ui/TabsLinear/TabsLinear"
import React, { useEffect, useState } from "react"
import { useGetNotificationSettingsQuery, useUpdateNotificationSettingsMutation } from "redux/api/user"
import styles from "./NotificationLayout.module.scss"

interface Props {
  addClass?: string
  props?: any
}

const NotificationLayout: React.FC<Props> = ({ addClass, ...props }) => {
  const [linksTabsData, setLinksTabsData] = useState([
    { id: 1, txt: "Profile", url: "/settings/profile" },
    // { id: 2, txt: "Payment", url: "/settings/payment" },
    { id: 3, txt: "Notifications", url: "/settings/notification" },
    { id: 4, txt: "Security", url: "/settings/security" },
  ])

  const { data: notifications } = useGetNotificationSettingsQuery()

  const [updateNotificationsRequest] = useUpdateNotificationSettingsMutation()

  const [checkList, setCheckList] = useState([])

  const updateNotifications = (newList) => {
    updateNotificationsRequest({
      payments: newList.filter((el) => el.type === "payments")[0].value,
      projects: newList.filter((el) => el.type === "projects")[0].value,
      chats: newList.filter((el) => el.type === "chats")[0].value,
      news: newList.filter((el) => el.type === "news")[0].value,
    })
  }

  useEffect(() => {
    if (!notifications) return
    setCheckList([
      {
        name: "Payment",
        value: notifications.payments,
        type: "payments",
      },
      {
        name: "Projects",
        value: notifications.projects,
        type: "projects",
      },
      {
        name: "Chats",
        value: notifications.chats,
        type: "chats",
      },
      {
        name: "News",
        value: notifications.news,
        type: "news",
      },
    ])
  }, [notifications])

  return (
    <>
      <TabsLinear
        list={linksTabsData}
        activeId={3}
        onClick={
          (id) => null
          //   {
          //   // console.log("id", id)
          // }
        }
        isLinks
      />
      <div className={styles.notification}>
        <div className={`${styles.notification__head}`}>
          <div className={`${styles.notification__col} ${styles.name}`}></div>
          <div className={`${styles.notification__col} ${styles.mail}`}>E-mail</div>
          <div className={`${styles.notification__col} ${styles.browser}`}>Browser</div>
        </div>
        {checkList.map((el, kk) => {
          return (
            <div className={styles.notification__row} key={kk}>
              <div className={`${styles.notification__col} ${styles.name}`}>{el.name}</div>
              <div className={`${styles.notification__col} ${styles.mail}`}>
                <Checkbox
                  name={el.nameCheckMail}
                  value={el.type}
                  checked={el.value === 1 || el.value === 3}
                  onChange={() => {
                    const newList = checkList.map((ell, iter) =>
                      iter === kk
                        ? { ...ell, value: el.value === 1 ? 0 : el.value === 3 ? 2 : el.value === 2 ? 3 : 1 }
                        : ell
                    )
                    updateNotifications(newList)
                    setCheckList(newList)
                  }}
                />
              </div>
              <div className={`${styles.notification__col} ${styles.browser}`}>
                <Checkbox
                  name={el.nameCheckBrw}
                  value={el.type}
                  checked={el.value === 2 || el.value === 3}
                  onChange={() => {
                    const newList = checkList.map((ell, iter) =>
                      iter === kk
                        ? { ...ell, value: el.value === 1 ? 3 : el.value === 2 ? 0 : el.value === 3 ? 1 : 2 }
                        : ell
                    )
                    updateNotifications(newList)
                    setCheckList(newList)
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}

export default NotificationLayout
