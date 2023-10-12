import styles from "./FooterLarge.module.scss"
import FaceBook from "public/assets/svg/soc/facebook.svg"
import Inst from "public/assets/svg/soc/instagram.svg"
import Reddit from "public/assets/svg/soc/reddit.svg"
import RedditBlack from "public/assets/svg/soc/reddit-black.svg"
import Telegram from "public/assets/svg/soc/telegram.svg"
import Linkin from "public/assets/svg/soc/linkendin.svg"
import Twitter from "public/assets/svg/soc/twitter.svg"
import Medium from "public/assets/svg/soc/medium.svg"
import YouTube from "public/assets/svg/soc/youtube.svg"

const icons = [
  [
    {
      id: 1,
      icon: <FaceBook />,
      href: "https://www.facebook.com/Linki-104963288970603/",
    },
    {
      id: 2,
      icon: <Inst />,
      href: "https://www.instagram.com/linkiteamofficial/",
    },
    {
      id: 3,
      icon: <Twitter />,
      href: "https://twitter.com/linki_team",
    },
    {
      id: 4,
      icon: <Linkin />,
      href: "https://www.linkedin.com/company/linki-team/",
    },
  ],
  [
    {
      id: 5,
      icon: <Telegram />,
      href: "https://t.me/linkiteam",
    },
    {
      id: 6,
      icon: <Medium />,
      href: "https://medium.com/@LinkiTeam",
    },
    {
      id: 7,
      icon: <Reddit />,
      href: "https://www.reddit.com/user/LinkiTeam/",
    },
    {
      id: 8,
      icon: <YouTube />,
      href: "https://www.youtube.com/channel/UCQZRYz1tpxaXwjErRMKWGMw",
    },
  ],
]

const iconsBlack = [
  {
    id: 1,
    icon: "/assets/soc/facebook-black.svg",
    href: "https://www.facebook.com/Linki-104963288970603/",
  },
  {
    id: 2,
    icon: "/assets/soc/instagram-black.svg",
    href: "https://www.instagram.com/linkiteamofficial/",
  },
  {
    id: 3,
    icon: "/assets/soc/twitter-black.svg",
    href: "https://twitter.com/linki_team",
  },
  {
    id: 4,
    icon: "/assets/soc/linkedIn-black.svg",
    href: "https://www.linkedin.com/company/linki-team/",
  },
  {
    id: 5,
    icon: "/assets/soc/telegram-black.svg",
    href: "https://t.me/linkiteam",
  },
  {
    id: 6,
    icon: "/assets/soc/medium-black.svg",
    href: "https://medium.com/@LinkiTeam",
  },
  {
    id: 7,
    icon: "/assets/soc/reddit-black.svg",
    href: "https://www.reddit.com/user/LinkiTeam/",
  },
  {
    id: 8,
    icon: "/assets/soc/youtube-black.svg",
    href: "https://www.youtube.com/channel/UCQZRYz1tpxaXwjErRMKWGMw",
  },
]

interface Props {
  sectionData?: {
    title?: string
    subtitle?: string
    footerSentence?: string
  }
}

const FooterLarge: React.FC<Props> = ({ sectionData }) => {
  return (
    <footer className={`${styles["footer"]} ${sectionData ? styles["footer_newtxt"] : ""}`} id="contact">
      <img className={styles["footer__bg"]} src="/img/newmain/hypnosis.svg" />
      <div className={styles["footer__social"]}>
        {/* Вставка нового текста */}
        {sectionData?.title ? (
          <h2 className={styles["footer__social-title"]}>{sectionData.title}</h2>
        ) : (
          <h2 className={styles["footer__social-title"]}>
            Social <br />
            networks
          </h2>
        )}
        {/* Вставка нового текста */}
        {sectionData?.subtitle ? (
          <p className={styles["footer__social-subtitle"]} dangerouslySetInnerHTML={{ __html: sectionData.subtitle }} />
        ) : (
          <p className={styles["footer__social-subtitle"]}>
            Join the best teams, participate in exciting projects, grow, earn
            <br /> more, and never pay a large commission
          </p>
        )}

        <div className={styles["footer__society"]}>
          {icons.map((icons, i) => {
            return (
              <div className={styles["footer__society-el"]} key={i}>
                {icons.map((el) => (
                  <a
                    key={el.id}
                    href={`${el.href}`}
                    target={"_blank"}
                    rel="noreferrer"
                    className={`${styles["footer__society-link"]}`}
                  >
                    {el.icon}
                  </a>
                ))}
              </div>
            )
          })}
        </div>
      </div>

      <div className={styles["footer__bottom-wp"]}>
        <div className={styles["footer__bottom"]}>
          <div className={styles["footer__bottom-title"]}>
            <img className={styles["footer__logo"]} src="/img/header/logo-small.svg" alt="linki logo" />
            <p>
              {sectionData?.footerSentence
                ? sectionData?.footerSentence
                : "Bringing a fresh approach to workflow management"}
            </p>
          </div>

          <div className={styles["footer__contacts"]}>
            <div className={styles["footer__contacts-text"]}>
              <p>Contact us — info@linki.team</p>
              <a href="https://www.craft.do/s/xn75VwZHhPM9Az" target="_blank" rel="noreferrer">
                Terms of Service
              </a>
              <a href="https://www.craft.do/s/vgyz5JXmLj77Ky" target="_blank" rel="noreferrer">
                Privacy Policy
              </a>
              <p>2022. All rights reserved</p>
            </div>
            <div className={styles["footer__contacts-soc"]}>
              {icons.map((icons, i) => {
                return (
                  <div className={styles["footer__contacts-element"]} key={i}>
                    {icons.map((el) => (
                      <a
                        key={el.id}
                        href={`${el.href}`}
                        target={"_blank"}
                        rel="noreferrer"
                        className={`${styles["footer__soc-el"]}`}
                      >
                        {el.icon}
                      </a>
                    ))}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default FooterLarge
