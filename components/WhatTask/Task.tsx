import React from "react"
import styles from "./WhatTask.module.scss"

const Task = ({ text }) => {
  return (
    <>
      <div className={styles["task"]}>
        <p>{text}</p>
      </div>
    </>
  )
}

export default Task
