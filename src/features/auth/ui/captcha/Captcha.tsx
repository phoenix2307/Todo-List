import styles from "./Captcha.module.css"
import { ChangeEvent, useState } from "react"

type Props = {
  captchaUrl: string | null
  answerCallBack: (answer: string) => void
}

export const Captcha = ({ captchaUrl, answerCallBack }: Props) => {
  const [answer, setAnswer] = useState('https://www.sistrix.com/wp-content/uploads/2021/03/image-3.png')

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
        {captchaUrl
          ? <img src={captchaUrl} alt="captcha-image" />
          : <img src={'https://www.sistrix.com/wp-content/uploads/2021/03/image-3.png'} alt="captcha-image" />
        }


      </div>
      <div className={styles.answer}>
        <input type="text" onChange={(e)=>onChangeHandler(e)}/>
        <button onClick={sendAnswerHandler}>send answer</button>
      </div>
    </div>
  )
}