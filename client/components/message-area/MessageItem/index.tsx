import React from 'react'
import { MessageItemProps } from '../../../interfaces'
import styles from './MessageItem.module.css'

const MessageItem: React.VFC<{ data: MessageItemProps }> = ({ data }) => {
  return (
    <div className={styles.container}>
      <div>{data.msg}</div>
    </div>
  )
}

export default MessageItem
