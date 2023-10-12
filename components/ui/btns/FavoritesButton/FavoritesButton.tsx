import { useAuth } from "hooks/useAuth"
import { useEffect, useState } from "react"
import {
  useAddFavoriteMutation,
  useDeleteFavoriteMutation,
  useGetFavoritesQuery,
  useLazyGetFavoritesQuery,
} from "redux/api/user"
import IconBtn from "../IconBtn/IconBtn"

interface Props {
  id: number
  addClass?: string
}

const FavoritesButton: React.FC<Props> = ({ id, addClass }) => {
  const { data: favoritesList } = useGetFavoritesQuery()
  const [getFavList] = useLazyGetFavoritesQuery()
  const [addtoFavRequest] = useAddFavoriteMutation()
  const [dellFromFavRequest] = useDeleteFavoriteMutation()

  const [isInfav, setIsInFav] = useState(null)

  const addandDellFavorites = () => {
    if (favoritesList?.length > 0) {
      if (isInfav) {
        try {
          dellFromFavRequest(id)
            .unwrap()
            .then((res) => {
              if (res.success)
                getFavList()
                  .unwrap()
                  .then((res) => setIsInFav(null))
            })
        } catch (err) {
          console.log("ERROR DELL FAV", err)
        }
      } else {
        try {
          addtoFavRequest(id)
            .unwrap()
            .then((res) => {
              if (res.success)
                getFavList()
                  .unwrap()
                  .then((res) => res?.length && setIsInFav(res[0].id))
            })
        } catch (err) {
          console.log("ERROR ADD FAV", err)
        }
      }
    } else {
      try {
        addtoFavRequest(id)
          .unwrap()
          .then((res) => {
            if (res.success)
              getFavList()
                .unwrap()
                .then((res) => res?.length && setIsInFav(res[0].id))
          })
      } catch (err) {
        console.log("ERROR ADD FAV", err)
      }
    }
  }

  useEffect(() => {
    if (favoritesList?.length > 0 && id) {
      if (favoritesList.filter((fav) => fav.id === id)[0]) {
        setIsInFav(favoritesList.filter((fav) => fav.id === id)[0].id)
      } else {
        setIsInFav(null)
      }
    }
  }, [favoritesList, id])

  return (
    <div className={`${addClass ? addClass : ""}`}>
      <IconBtn
        onClick={addandDellFavorites}
        icon={"heart"}
        isActive={isInfav > 0}
        size={"md"}
        mod={"fill-stroke"}
        dataFor={"global-tooltip"}
        dataTip={isInfav > 0 ? "Remove from favorite" : "Add to favorite"}
      />
    </div>
  )
}

export default FavoritesButton
