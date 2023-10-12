import Link from "next/link"
import styles from "./AsideMenu.module.scss"
import ArrowDouble from "public/assets/svg/arrow-double.svg"
import { useRouter } from "next/router"
import { useAuth } from "hooks/useAuth"
import ReactTooltip from "react-tooltip"
import React, { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "hooks"
import { selectMenuCollapsed, toggleDocumentScroll, toggleSideMenu } from "redux/slices/uiSlice"
import UserInfo from "components/UserInfo/UserInfo"
import IconClose from "public/assets/svg/close.svg"
import IconHouse from "public/assets/svg/house.svg"
import IconFile from "public/assets/svg/file.svg"
import IconThumbs from "public/assets/svg/Thumbs.svg"
import IconHeart from "public/assets/svg/heart.svg"
import IconUser from "public/assets/svg/Users.svg"
import IconData from "public/assets/svg/database2.svg"
import IconSquare from "public/assets/svg/UserSquare.svg"
import IconCrown from "public/assets/svg/crown.svg"
import IconWallet from "public/assets/svg/wallet.svg"
import IconSettings from "public/assets/svg/settings.svg"
import IconLightBulb from "public/assets/svg/Lightbulb.svg"
import IconQuestins from "public/assets/svg/question.svg"
import DefaultBtn from "components/ui/btns/DefaultBtn/DefaultBtn"
import { FC, memo, useMemo } from "react"
import { useLogout } from "hooks/useLogout"
import { USER_TYPE_CUSTOMER, USER_TYPE_PM } from "utils/constants"
import SearchBlock from "components/SearchBlock/SearchBlock"
// import Intercom from "packages/intercom"
import { selectApiParams } from "redux/slices/apiParams"

interface Props {
  addClass?: string
  props?: any
}

const cannySDK = (user) => {
  if (!user.id) return null
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `!function(w,d,i,s){function l(){if(!d.getElementById(i)){var f=d.getElementsByTagName(s)[0],e=d.createElement(s);e.type="text/javascript",e.async=!0,e.src="https://canny.io/sdk.js",f.parentNode.insertBefore(e,f)}}if("function"!=typeof w.Canny){var c=function(){c.q.push(arguments)};c.q=[],w.Canny=c,"complete"===d.readyState?l():w.attachEvent?w.attachEvent("onload",l):w.addEventListener("load",l,!1)}}(window,document,"canny-jssdk","script");`,
        }}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `Canny('identify', {
            appID: '6298a6d4e8a4bb0b5feb6ea0',
            user: {
              email: '${user.email}',
              name: '${user.name}',
              id: ${user.id},
              avatarURL: '${user.avatar || ""}',
            },
          });`,
        }}
      />
    </>
  )
}

const menus = [
  [
    {
      id: 1,
      href: "/dashboard",
      txt: "Dashboard",
      icon: <IconHouse />,
    },
    {
      id: 2,
      href: "/projects",
      txt: "Projects",
      icon: <IconFile />,
    },
    {
      id: 3,
      href: "/catalog-teams",
      txt: "Catalog",
      icon: <IconThumbs />,
    },
  ],
  [
    {
      id: 1,
      href: "/favorite",
      txt: "Favorite",
      icon: <IconHeart />,
    },
    {
      id: 2,
      href: "/teams/create",
      subHref: "/teams",
      txt: "Teams",
      icon: <IconUser />,
      userType: [USER_TYPE_PM],
      isNew: true,
    },
    {
      id: 3,
      href: "/referrals",
      txt: "Referrals",
      icon: <IconData />,
    },
    {
      id: 4,
      href: "/experts",
      txt: "Experts",
      icon: <IconSquare />,
      userType: [USER_TYPE_PM],
      premium: true,
    },
  ],
  [
    // {
    //   id: 1,
    //   href: "/pricing",
    //   txt: "Pricing",
    //   icon: <IconCrown/>,
    // },
    // {
    //   id: 2,
    //   href: "/payments",
    //   txt: "Payments",
    //   icon: <IconWallet/>,
    // },
    {
      id: 3,
      href: "/settings/profile",
      txt: "Settings",
      icon: <IconSettings />,
    },
    {
      id: 4,
      href: "https://feedback.linki.team/",
      txt: "Request a feature",
      icon: <IconLightBulb />,
      type: "external",
    },
    {
      id: 5,
      href: "mailto:support@linki.team",
      txt: "Help & Support",
      icon: <IconQuestins />,
      type: "external",
    },
  ],
]

const MenuLink: FC<{
  type?: string
  href?: string
  icon: string | JSX.Element
  txt: string
  onClick(): void
  disabled: boolean
  isBtnDisabled?: boolean
  isNew?: boolean
  menuToolTip?: boolean
}> = ({ type, href, icon, txt, onClick, disabled, isBtnDisabled, isNew, menuToolTip }) => {
  return !href ? (
    <button
      className={`${styles.nav__link} nav__link`}
      disabled={isBtnDisabled ? true : undefined}
      onClick={(e) => {
        disabled && e.preventDefault()
        onClick()
      }}
    >
      <div className={`${styles.nav__icon}`}>{icon}</div>
      <span>{txt}</span>
      {isNew && <span className={`${styles["nav__icon-new"]} nav__icon-new`}>new</span>}
    </button>
  ) : type === "external" ? (
    <a
      href={href}
      target={"_blank"}
      rel="noreferrer"
      className={`${styles.nav__link} nav__link`}
      onClick={(e) => {
        disabled && e.preventDefault()
        onClick()
      }}
      data-for="global-tooltip"
      data-place="right"
      data-tip={menuToolTip ? txt : ""}
    >
      <div className={`${styles.nav__icon}`}>{icon}</div>
      <span>{txt}</span>
      {isNew && <span className={`${styles["nav__icon-new"]} nav__icon-new`}>new</span>}
    </a>
  ) : (
    <Link href={href}>
      <a
        className={`${styles.nav__link} nav__link`}
        onClick={(e) => {
          disabled && e.preventDefault()
          onClick()
        }}
        data-for="global-tooltip"
        data-place="right"
        data-tip={menuToolTip ? txt : ""}
      >
        <div className={`${styles.nav__icon}`}>{icon}</div>
        <span>{txt}</span>
        {isNew && <span className={`${styles["nav__icon-new"]} nav__icon-new`}>New</span>}
      </a>
    </Link>
  )
}

const AsideMenu: React.FC<Props> = ({ addClass, ...props }) => {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const collapsed = useAppSelector(selectMenuCollapsed)
  const dispatch = useAppDispatch()
  const logout = useLogout()

  useEffect(() => {
    ReactTooltip.rebuild()
  }, [])

  const closeMObMenuFn = () => {
    if (window.innerWidth <= 767) {
      dispatch(toggleSideMenu(false))
    }
    dispatch(toggleDocumentScroll({ data: false }))
    // Intercom.changeVisibility(true)
  }
  const toggleSlideMenuFn = () => {
    // Intercom.changeVisibility(collapsed)
    dispatch(toggleSideMenu(!collapsed))
    dispatch(toggleDocumentScroll({ data: !collapsed, breakpoint: 768 }))
  }
  const menuNav = useMemo(() => {
    return menus.map((menu, i) => {
      return (
        <ul key={i} className={`${styles.nav} ${i === 1 ? styles["nav--border"] : ""}`}>
          {menu.map((menuLink) => {
            if (menuLink.userType && !menuLink.userType.includes(user.type)) return null
            if (menuLink.premium && !user.premium_subscribe) return null
            const { href, id, icon, type, txt } = menuLink
            const isActive = router.route === menuLink.href
            return (
              <li key={id} className={`${styles.nav__item} ${isActive ? styles["is-active"] : ""}`}>
                <MenuLink
                  isNew={menuLink.isNew}
                  disabled={isActive}
                  href={href}
                  icon={icon}
                  txt={txt}
                  type={type}
                  onClick={closeMObMenuFn}
                  menuToolTip={collapsed}
                />
              </li>
            )
          })}
        </ul>
      )
    })
  }, [router.route, collapsed])

  return (
    <>
      <div className={`${styles["aside-menu"]} ${addClass ? addClass : ""}`} {...props}>
        <div className={`aside-menu__close ${styles["aside-menu__close"]}`} onClick={closeMObMenuFn}></div>
        <div className={`${styles["aside-menu__top-mobile"]}`}>
          <UserInfo mod={"mob"} onMenuClose={closeMObMenuFn} />
          <button type="button" className={`${styles["aside-menu__close-btn"]}`} onClick={closeMObMenuFn}>
            <IconClose />
          </button>
        </div>
        <div className={`${styles["aside-menu__search-block"]}`}>
          <SearchBlock
            modalName={"mob-search"}
            onClickItem={() => {
              dispatch(toggleSideMenu(false))
            }}
          />
          {user.type === USER_TYPE_CUSTOMER && (
            <DefaultBtn
              txt={"Create a project"}
              addClass={`${styles["aside-menu__create-btn"]}`}
              mod={"transparent"}
              href="/projects/create"
              onClick={closeMObMenuFn}
            />
          )}
        </div>
        <div className={`${styles["aside-menu__top"]}`}>
          <Link href={isAuthenticated ? "/dashboard" : "/"}>
            <a className={`${styles["aside-menu__logo"]} aside-menu__logo`}>
              <img src="/img/header/linlilogo.svg" alt="linlilogo" width={114} />
            </a>
          </Link>
          <div className={`${styles["aside-menu__toggler"]} aside-menu__toggler`} onClick={toggleSlideMenuFn}>
            <ArrowDouble className="svg-arrow-double" width={20} />
          </div>
        </div>
        <div className={`${styles["navs-wrp"]}`}>
          {menuNav}
          <div className={`${styles["aside-menu__mob-logout"]}`}>
            <span
              className={`${styles.nav__link} ${styles["nav__link--out"]} nav__link`}
              onClick={() => {
                closeMObMenuFn()
                logout()
                router.push("/signin")
              }}
            >
              <div className={`${styles.nav__icon}`}>
                <img src={`/img/icons/signIn-out.svg`} alt="" />
              </div>
              <span>Log out</span>
            </span>
          </div>
        </div>
      </div>
      {cannySDK(user)}
    </>
  )
}

export default memo(AsideMenu)
