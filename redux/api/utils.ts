export const objectToFormData = (data) => {
  const formFata = new FormData()
  for (const key in data) {
    if (
      key === "name" ||
      key === "image" ||
      key === "surname" ||
      key === "description" ||
      key === "timezone_id" ||
      key === "avatar" ||
      key === "telegram_link"
    ) {
      if (data[key]) {
        formFata.append(key, data[key])
      }
    }

    if (key === "telegram_link") {
      if (data[key] || data[key] === "") {
        formFata.append(key, data[key])
      }
    }
    if (key === "project_categories") {
      data[key].length > 0 &&
        data[key].forEach((el) => {
          formFata.append(`${key}[]`, String(el))
        })
    }
    if (key === "links") {
      data[key].length > 0 &&
        data[key].forEach((el, i) => {
          el.url && formFata.append(`${key}[${i}][url]`, el.url)
          el.site_name && formFata.append(`${key}[${i}][site_name]`, el.site_name)
          el.title && formFata.append(`${key}[${i}][title]`, el.title)
          el.description && formFata.append(`${key}[${i}][description]`, el.description)
          el.image_url && formFata.append(`${key}[${i}][image_url]`, el.image_url)
        })
    }
    if (key === "company") {
      data[key]?.name && formFata.append(`company[name]`, data[key].name)
      data[key].links?.length &&
        data[key].links.forEach((el, i) => {
          el.url && formFata.append(`${key}[links][${i}][url]`, el.url)
        })
    }
    if (key === "skills" || key === "languages") {
      data[key].length > 0 &&
        data[key].forEach((el) => {
          formFata.append(`${key}[]`, String(el))
        })
    }
    if (key === "job_roles") {
      data[key].length > 0 &&
        data[key].forEach((el, i) => {
          formFata.append(`${key}[${i}][id]`, String(el.id))
          if (typeof el.hourly_pay === "string" && el.hourly_pay) {
            formFata.append(`${key}[${i}][hourly_pay]`, el.hourly_pay.replace("$", ""))
          }
          if (typeof el.hourly_pay === "number" && el.hourly_pay > 0) {
            formFata.append(`${key}[${i}][hourly_pay]`, String(el.hourly_pay))
          }
        })
    }
  }

  return formFata
}
