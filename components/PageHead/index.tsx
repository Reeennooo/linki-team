import Head from "next/head"
import React from "react"
import { BACKEND_HOST } from "utils/constants"

interface Props {
  title?: string
  description?: string
  noReferer?: boolean
  noIndex?: boolean
}

const defaultMeta = {
  title: "Linki platform is ultimate place for freelancers and contractors within the projects",
  description:
    "Linki - your partner for delivering any product, idea or feature at any development stage. We link you with experienced PMs who guide self-organized teams that best match your requirements.",
}

const PageHead: React.FC<Props> = ({ title, description, noReferer = false, noIndex = false }) => {
  return (
    <Head>
      <title>{title || defaultMeta.title}</title>

      {noReferer ? <meta name="referer" content="origin"></meta> : null}
      {noIndex ? <meta name="robots" content="noindex, nofollow"></meta> : null}
      <meta key="description" name="description" content={description ? description : defaultMeta.description} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title ? title : defaultMeta.title} />
      <meta property="og:description" content={description ? description : defaultMeta.description} />
      <meta property="og:image" content={`${BACKEND_HOST}/assets/og-image.png`} />
      <meta property="og:image:width" content="720" />
      <meta property="og:image:height" content="400" />
    </Head>
  )
}

export default PageHead
