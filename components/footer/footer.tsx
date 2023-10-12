import Link from "next/link"
import styles from "./footer.module.scss"

interface Props {
  wide?: boolean
}

const socArr = [
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

const Footer: React.FC<Props> = (props) => {
  return (
    <>
      <footer className={`${styles.footer} `}>
        <div className={"container"}>
          <div className={`${styles["footer-inner"]}`}>
            <div className={`${styles["footer-inner__copy"]}`}>
              <Link href={"/"}>
                <a className={`${styles.footer__logo} logo`}>
                  <img src="/assets/footer/logo.svg" alt="linlilogo" width={92} />
                </a>
              </Link>
              <p className={`${styles["footer-inner__copy-txt"]}`}>
                Contact us — <a href="mailto:info@linki.team">info@linki.team</a> <br></br>2022. All rights reserved
              </p>
            </div>
            <div className={`${styles["footer-inner__circle"]}`}>
              <div className={`${styles["footer-inner__circle-logo"]}`}>
                <img src="/assets/footer/circle-logo.svg" alt="" />
              </div>
              <div className={`${styles["footer-inner__circle-txt"]}`}>
                <img src="/assets/footer/circle-txt.svg" alt="" />
              </div>
            </div>
            <div className={`${styles["footer-soc"]}`}>
              {socArr.map((el) => {
                return (
                  <a
                    key={el.id}
                    href={`${el.href}`}
                    target={"_blank"}
                    rel="noreferrer"
                    className={`${styles["footer-soc__link"]}`}
                  >
                    <img src={`${el.icon}`} alt="" />
                  </a>
                )
              })}
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}

export default Footer
