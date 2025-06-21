import styles from "./Captcha.module.css"
import { ChangeEvent, useState } from "react"

type Props = {
  captchaUrl: string
  answerCallBack: (answer: string) => void
}

export const Captcha = ({ captchaUrl, answerCallBack }: Props) => {
  const [answer, setAnswer] = useState('')

  const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setAnswer(event.currentTarget.value)
  }

  const sendAnswerHandler = () => {
// запуск callback, який маємо отримати в пропсах
    answerCallBack(answer)
  }

  return (
    <div className={styles.captcha}>
      <div className={styles.image}>
        <img src={captchaUrl} alt="captcha-image" />
        ---captcha-image
      </div>
      <div className={styles.answer}>
        <input type="text" onChange={(e)=>onChangeHandler(e)}/>
        <button onClick={sendAnswerHandler}>send answer</button>
      </div>
    </div>
  )
}