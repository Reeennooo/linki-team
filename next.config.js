/** @type {import('next').NextConfig} */

moduleExports = {
  experimental: {
    outputStandalone: true,
  },
  reactStrictMode: false,
  images: {
    domains: ["api.linki.team", "apidev.linki.team"],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            svgoConfig: {
              plugins: [
                {
                  name: "preset-default",
                  params: {
                    overrides: {
                      // disable plugins
                      removeViewBox: false,
                    },
                  },
                },
              ],
            },
          },
        },
      ],
    })

    return config
  },
  eslint: {
    dirs: ["pages", "components", "utils", "packages", "hooks", "hocs", "redux"],
  },
  sassOptions: {
    prependData: `
      @import 'styles/breakpoints.scss';
      @import 'styles/mixins.scss';
    `,
  },
}

module.exports = moduleExports
