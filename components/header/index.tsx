import styles from "./index.module.scss"
import Nav from "../Nav/Nav"
import Link from "next/link"
import { useRouter } from "next/router"
import DefaultBtn from "components/ui/btns/DefaultBtn/DefaultBtn"
import { useAuth } from "hooks/useAuth"
import { useEffect, useState } from "react"
import LogoLinki from "public/assets/svg/linki-logo.svg"
import UseWindowSize from "hooks/useWindowSIze"
import IconClock from "public/assets/svg/clock.svg"
import { scrollToFn } from "utils/scrollTo"

interface Props {
  wide?: boolean
  small?: boolean
  large?: boolean
  noburger?: boolean
  mainpage?: boolean
}

let lastScroll = 0

const mobileNav = [
  {
    id: 1,
    txt: "How it work",
    href: "use-cases",
    disabled: false,
  },
  {
    id: 2,
    txt: "About",
    href: "about",
    disabled: true,
  },
  {
    id: 3,
    txt: "Teams",
    href: "teams-section",
    disabled: true,
  },
  {
    id: 4,
    txt: "F.A.Q",
    href: "about",
    disabled: true,
  },
  {
    id: 5,
    txt: "Articles",
    href: "about",
    disabled: true,
  },
  {
    id: 6,
    txt: "Contact",
    href: "contact",
    disabled: true,
  },
]

const Header: React.FC<Props> = (props) => {
  const [width, height] = UseWindowSize()

  const [menuIsOopen, setMenuIsOPen] = useState(false)
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const headerLinkhandler = () => {
    const query = router.query
    if (router.pathname === "/signup") router.push({ pathname: "/signin", query: { ...query } })
    if (router.pathname === "/signin") router.push({ pathname: "/signup", query: { ...query } })
    if (router.pathname === "/reset/password") router.push("/signup")
    if (router.pathname === "/reset/password/[code]") router.push("/signup")
  }
  const [headerScrollState, setHeaderScrollState] = useState(false)
  useEffect(() => {
    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  })

  useEffect(() => {
    if (menuIsOopen) {
      document.documentElement.classList.add("no-scroll")
    } else {
      document.documentElement.classList.remove("no-scroll")
    }
  }, [menuIsOopen])

  useEffect(() => {
    appHeight()
  }, [width])

  const [scrollUpState, setScrollUpState] = useState(false)

  const handleScroll = () => {
    if (window.scrollY > 10) {
      setHeaderScrollState(true)
    } else {
      setHeaderScrollState(false)
    }
    scrollUp()
    // appHeight()
  }

  const scrollPosition = () => window.scrollY
  function scrollUp() {
    if (lastScroll > scrollPosition()) {
      // Скролл вверх
      setScrollUpState(true)
    } else if (lastScroll < scrollPosition()) {
      // Скролл вниз
      setScrollUpState(false)
    }

    lastScroll = scrollPosition()
  }

  const appHeight = () => {
    const doc = document.documentElement
    doc.style.setProperty("--jsvh", `${window.innerHeight}px`)
  }

  const clickFunction = (e) => {
    e.preventDefault()
    // window.Intercom("show")
  }

  return (
    <>
      <header
        className={[
          styles.header,
          props.wide && styles["header--wide"],
          headerScrollState && styles["is-scrolled"],
          scrollUpState && styles["scroll-up"],
          menuIsOopen && styles["menu-open"],
          props.mainpage && styles["header_mainpage"],
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <div
          className={`${props.wide ? "container--wide" : ""} ${props.small ? "container--small" : ""} ${
            props.large ? "container--large" : ""
          } container`}
        >
          <div className={`${styles.header__inner} ${styles["header-inner-mobile"]}`}>
            <Link href={isAuthenticated ? "/dashboard" : "/"}>
              <a className={`${styles.header__logo} logo`}>
                {props.mainpage && !headerScrollState && !menuIsOopen ? (
                  <LogoLinki className={styles["main-logo"]} />
                ) : (
                  <img src="/img/header/linlilogo.svg" alt="linlilogo" width={114} />
                )}
              </a>
            </Link>
            {props.noburger ? (
              <div className={styles["btn-menu"]} onClick={() => setMenuIsOPen(!menuIsOopen)}>
                <p>menu</p>
              </div>
            ) : (
              <div
                className={`burger-menu burger-menu--main-page ${styles["burger"]} ${menuIsOopen ? "is-active" : ""}`}
                onClick={() => setMenuIsOPen(!menuIsOopen)}
              >
                <span className="burger-menu__item"></span>
                <span className="burger-menu__item"></span>
                <span className="burger-menu__item"></span>
                <span className="burger-menu__item"></span>
              </div>
            )}
          </div>
          <div className={`${styles.header__inner} ${styles["header-inner-desktop"]}`}>
            <Link href={isAuthenticated ? "/dashboard" : "/"}>
              <a className={`${styles.header__logo} ${props.mainpage ? styles.header__logo_margin : ""} logo`}>
                {props.mainpage && !headerScrollState && !menuIsOopen ? (
                  <LogoLinki className={styles["main-logo"]} />
                ) : (
                  <img src="/img/header/linlilogo.svg" alt="linlilogo" width={114} />
                )}
              </a>
            </Link>
            {router.pathname === "/auth/role" ? null : router.pathname === "/signup" ||
              router.pathname === "/signin" ||
              router.pathname === "/reset/password" ||
              router.pathname === "/reset/password/[code]" ? (
              <DefaultBtn
                addClass={styles["header__btn"]}
                onClick={headerLinkhandler}
                txt={`${
                  router.pathname === "/signin" ||
                  router.pathname === "/reset/password" ||
                  router.pathname === "/reset/password/[code]"
                    ? "Sign up"
                    : "Sign In"
                }`}
                mod={"transparent"}
              />
            ) : (
              <>
                {props.mainpage && width < 991 && width ? (
                  <>
                    <div className={styles["mob-menu"]}>
                      <div className={styles["mob-menu__top"]}>
                        <div className={styles["mob-menu__for"]}>
                          <a
                            href={"#for-client"}
                            onClick={(e) => {
                              e.preventDefault()
                              scrollToFn("for-client", false, 0)
                              setMenuIsOPen(false)
                            }}
                          >
                            <div className={`${styles["mob-menu__for-el"]} ${styles["mob-menu__for-el_client"]}`}>
                              For
                              <br />
                              <span>Client</span>
                            </div>
                          </a>
                          <a
                            href={"#for-team"}
                            onClick={(e) => {
                              e.preventDefault()
                              scrollToFn("for-team", false, 0)
                              setMenuIsOPen(false)
                            }}
                          >
                            <div className={`${styles["mob-menu__for-el"]} ${styles["mob-menu__for-el_team"]}`}>
                              For
                              <br />
                              <span>Team</span>
                            </div>
                          </a>
                          <a
                            href={"#for-expert"}
                            onClick={(e) => {
                              e.preventDefault()
                              scrollToFn("for-expert", false, 0)
                              setMenuIsOPen(false)
                            }}
                          >
                            <div className={`${styles["mob-menu__for-el"]} ${styles["mob-menu__for-el_expert"]}`}>
                              For
                              <br />
                              <span>Expert</span>
                            </div>
                          </a>
                        </div>
                        <div className={styles["mob-menu__nav"]}>
                          {mobileNav.map((el) =>
                            !el.disabled ? (
                              <a href={el.href} key={el.id}>
                                <div
                                  className={styles["mob-menu__nav-el"]}
                                  onClick={(e) => {
                                    e.preventDefault()
                                    scrollToFn(el.href, false, 0)
                                    setMenuIsOPen(false)
                                  }}
                                >
                                  <p>{el.txt}</p>
                                </div>
                              </a>
                            ) : (
                              <div className={`${styles["mob-menu__nav-el"]} ${styles["is-disabled"]}`} key={el.id}>
                                <p>{el.txt}</p>
                                <IconClock />
                              </div>
                            )
                          )}
                        </div>
                      </div>
                      <div className={styles["mob-menu__bottom"]}>
                        <DefaultBtn
                          addClass={`${styles["header-btns__btn"]} ${styles["mob-menu__signup"]}`}
                          txt={"Sign Up"}
                          mod={"transparent-grey"}
                          minWidth={false}
                          size={"lg"}
                          href={"/signup"}
                        />
                        <DefaultBtn
                          addClass={`${styles["header-btns__btn"]}`}
                          txt={"Log In"}
                          mod={"transparent-grey"}
                          icon={"signin"}
                          minWidth={false}
                          size={"lg"}
                          href={"/signin"}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <Nav addClass={`${styles["nav"]}`} setMenuIsOPen={setMenuIsOPen} mainpage={props.mainpage} />
                    <div className={`${styles["header-btns"]}`}>
                      <DefaultBtn
                        addClass={`${styles["header-btns__btn"]}`}
                        txt={"Log In"}
                        mod={"transparent-grey"}
                        icon={props.mainpage ? undefined : "signin"}
                        minWidth={false}
                        size={"lg"}
                        href={"/signin"}
                      />
                      {router.pathname !== "/promo-team-launch" &&
                        router.pathname !== "/promo-team" &&
                        router.pathname !== "/promo-team-project" &&
                        router.pathname !== "/" &&
                        !props.mainpage && (
                          <DefaultBtn
                            onClick={clickFunction}
                            btnId={"fire-intercom"}
                            addClass={`${styles["header-btns__btn"]} `}
                            txt={"Talk to us"}
                            minWidth={false}
                            size={"lg"}
                          />
                        )}
                      {(router.pathname === "/promo-team-launch" ||
                        router.pathname === "/promo-team" ||
                        router.pathname === "/promo-team-project") && (
                        <DefaultBtn
                          addClass={`${styles["header-btns__btn"]} `}
                          txt={"Talk to us"}
                          minWidth={false}
                          size={"lg"}
                          isTargetBlank={true}
                          href={"https://calendly.com/semyon-linki/client-30-min"}
                        />
                      )}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </header>
    </>
  )
}

export default Header
