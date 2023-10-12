import getUrls from "get-urls"
import { LinkWithOGParams } from "types/content"

/**
 * @param str - строка, может содержать 1 и более ссылки в тексте, так и не иметь ссылок
 * @returns массив объектов { url: string, site_name?: string, title?: string, description?: string, image_url?: string }. Если ссылок в тексте нет - пустой массив
 */

async function getLinksWithOG(str: string): Promise<LinkWithOGParams[]> {
  if (typeof str !== "string") {
    throw new Error(`Expected argument "str" to be a string, instead got a value of ${typeof str} type.`)
  }

  const url = [...getUrls(str)]

  if (!url.length) return []

  return await fetch(`/api/og?url=${url}`)
    .then((res) => res.json())
    .catch((err) => {
      console.log(err)
    })
}

export { getLinksWithOG }
