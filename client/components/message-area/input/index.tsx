import React, { useState } from 'react'
import { AiOutlineSend } from 'react-icons/ai'
import styles from './Input.module.css'

const Input: React.VFC<{ sendMessage: (msgText: string) => void }> = ({
  sendMessage,
}) => {
  const [text, setText] = useState('')
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <input
          type="text"
          className={styles.inputArea}
          value={text}
          onChange={(e) => setText(e.currentTarget.value)}
          placeholder={'Type a message here'}
        />
        <button
          className={styles.sendButton}
          onClick={() => {
            sendMessage(text)
            setText('')
          }}
        >
          <AiOutlineSend size={20} />
        </button>
      </div>
    </div>
  )
}

export default Input
