import Pagination from "@mui/material/Pagination"
import { PAGE_SIZE } from "@/common/constants"
import styles from "./TasksPagination.module.css"
import Typography from "@mui/material/Typography"
import { ChangeEvent } from "react"

type Props = {
  totalCount: number
  page: number
  setPage: (page: number) => void
}

export const TasksPagination = ({ totalCount, page, setPage }: Props) => {

  const changePage = (_: ChangeEvent<unknown>, page: number) => {
    setPage(page)
  }
  const count = Math.ceil(totalCount / PAGE_SIZE)
  if (count > 1) {
    return (
      <>
        <Pagination
          count={count}
          page={page}
          onChange={changePage}
          shape={"rounded"}
          color={"primary"}
          className={styles.pagination}
        />
        <div className={styles.totalCount}>
          <Typography variant={"caption"}> Total: {totalCount}</Typography>
        </div>
      </>
    )
  } else {
    return (<></>)
  }

}