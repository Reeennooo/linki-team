import React from "react"
import styles from "./WhatTask.module.scss"
import Task from "./Task"

interface Props {
  title: string
}

const WhatTask: React.FC<Props> = ({ title }) => {
  const tasks = [
    {
      id: 1,
      text: "Дизайн лендингов",
    },
    {
      id: 2,
      text: "Дизайн сайта",
    },
    {
      id: 3,
      text: "Дизайн рекламных материалов",
    },
    {
      id: 4,
      text: "Создание видео",
    },
    {
      id: 5,
      text: "Разработка финансовой модели",
    },
    {
      id: 6,
      text: "Продвижение проекта",
    },
    {
      id: 7,
      text: "SMM стратегия",
    },
    {
      id: 8,
      text: "Разработка приложения IOS и Android",
    },
    {
      id: 9,
      text: "Продвижение приложений",
    },
    {
      id: 10,
      text: "Продвижение в Google и YouTube",
    },
    {
      id: 11,
      text: "Разработка сайта",
    },
  ]
  return (
    <>
      <div className={`container container--small ${styles["task-wrapper"]}`}>
        <h3 className={`${styles["title"]} section-title`}>{title}</h3>
        <div className={`${styles["task-container"]}`}>
          {tasks.map((task) => (
            <Task text={task.text} key={task.id} />
          ))}
        </div>
      </div>
    </>
  )
}

export default WhatTask
