import styles from "./ProductsSection.module.scss"
import ProductCard from "components/ProductCard/ProductCard"
import { createTitle } from "utils/createTitle"
import { useEffect, useRef, useState } from "react"
import IconStudio from "public/img/products/studioApp-logo.svg"
import IconNobile from "public/img/products/nobile-logo.svg"
import IconP from "public/img/products/p-logo.svg"
import gsap from "gsap"

export interface IProduct {
  id: number
  banner: string
  logo: any
  name: string
  type: string
  desc: string
}

const exampleProducts: IProduct[] = [
  {
    id: 3810570,
    banner: "/img/products/studioapp.png",
    logo: <IconStudio />,
    name: "StudioApp",
    type: "Web platform",
    desc: "Application for motion designers. Works with Adobe Premiere Pro & Adobe After Effects",
  },
  {
    id: 6902378,
    banner: "/img/products/knives.png",
    logo: <IconNobile />,
    name: "Noblie",
    type: "E-commerce platform",
    desc: "A platform for exclusive collectibles, such as: custom knives, art daggers",
  },
  {
    id: 9999999,
    banner: "/img/products/pokras-lampass.png",
    logo: <IconP />,
    name: "Pokras Lampas",
    type: "E-commerce platform",
    desc: "Online store of the author's brand of designer clothes. Piece Unique garments, and regular item drops",
  },
]

interface Props {
  sectionData?: {
    title?: string
  }
}

const ProductsSection: React.FC<Props> = ({ sectionData }) => {
  const [timeline, setTimeline] = useState(() => gsap.timeline())
  const sectionRef = useRef(null)

  let sectionTitle
  if (sectionData) {
    sectionTitle = createTitle(sectionData.title, styles)
  } else {
    sectionTitle = createTitle("Products created on the platform", styles)
  }

  useEffect(() => {
    const section = sectionRef.current
    const words = gsap.utils.toArray(`.${styles["word"]}`)

    gsap.fromTo(
      words,
      {
        opacity: 0,
        y: 30,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.2,
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
        },
      }
    )
  })

  return (
    <section className={styles["products"]} ref={sectionRef}>
      <div className="container container--large">
        <h2 className={styles["products__title"]} dangerouslySetInnerHTML={{ __html: `${sectionTitle}` }} />
      </div>
      <div className={`container container--large ${styles["container"]}`}>
        <div className={styles["products__wrapper"]}>
          {exampleProducts.map((product) => (
            <ProductCard productData={product} key={product.id} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProductsSection
