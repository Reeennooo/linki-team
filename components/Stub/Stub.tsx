import Link from "next/link"

const Stub = () => {
  return (
    <>
      <div className="stub">
        <div className="stub__inner">
          <h1 className="stub__title">
            Something special <br />
            is on the way!
          </h1>
          <p className="stub__text">
            This section is under development, we will be sure to notify you when it launches. You can also check out
            our roadmap for launching new features.
          </p>
          <div className="stub__image-container">
            <picture>
              <source srcSet="assets/in-dev-mobile.png" media="(max-width: 991px)" />
              <img className="stub__image" src="assets/in-dev-desktop.png" alt="in developing" />
            </picture>
          </div>
          <a href={"https://linki.canny.io/"} target={"_blank"} rel="noreferrer" className="default-btn">
            Feature requests
          </a>
        </div>
      </div>
    </>
  )
}

export default Stub
