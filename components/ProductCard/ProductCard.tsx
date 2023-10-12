import styles from "./ProductCard.module.scss"
import { IProduct } from "components/ProductsSection/ProductsSection"
import Link from "next/link"

interface Props {
  productData: IProduct
}

const ProductCard: React.FC<Props> = ({ productData }) => {
  const { banner, logo, name, type, desc } = productData

  return (
    <Link href="/signup">
      <div className={styles["card"]}>
        <div className={styles["card__banner"]}>
          <img src={banner} alt="linki product" />
        </div>
        <div className={styles["card__product-info"]}>
          {logo}
          <div className={styles["card__info-text"]}>
            <span className={styles["card__info-name"]}>{name}</span>
            <span className={styles["card__type"]}>{type}</span>
          </div>
        </div>
        <p className={styles["card__description"]}>{desc}</p>
      </div>
    </Link>
  )
}

export default ProductCard
