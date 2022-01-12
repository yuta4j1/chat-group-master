import React from 'react'
import { MessageItemProps } from '../../../interfaces'
import styles from './MessageItem.module.css'

const MessageItem: React.VFC<{ data: MessageItemProps }> = ({ data }) => {
  return (
    <div className={styles.container}>
      <div className={styles.messageHeader}>
        <div className={styles.userName}>{data.userName}</div>
        <div>{data.createdAt}</div>
      </div>
      <div>{data.text}</div>
    </div>
  )
}

export default MessageItem
