import Document, { Html, Head, Main, NextScript } from "next/document"
import { metrikBody, metrikHead } from "utils/metrikHelper"
import { IS_DEV } from "utils/constants"
import { FB_PIXEL_ID } from "utils/fpixel"

export default class MyDocument extends Document {
  render(): JSX.Element {
    return (
      <Html lang="en">
        {/* <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
          />
        </noscript> */}
        {/* <script src="//code.jivo.ru/widget/jl5nCT2TIn" async></script> */}
        <Head>
          <link rel="icon" href="/favicon/favicon.ico" />
          <link rel="manifest" href="/manifest.json" />
          <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
          <link rel="manifest" href="/favicon/site.webmanifest" />
          <link rel="mask-icon" href="/favicon/safari-pinned-tab.svg" color="#5bbad5" />
          <meta name="msapplication-TileColor" content="#da532c" />
          <meta name="theme-color" content="#ffffff" />
          {!IS_DEV && metrikHead()}
        </Head>
        <body>
          {!IS_DEV && metrikBody()}
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
