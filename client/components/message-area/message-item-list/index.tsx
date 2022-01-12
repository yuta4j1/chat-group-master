import React from 'react'
import MessageItem from '../message-item'
import styles from './MessageItemList.module.css'
import { MessageItemProps } from '../../../interfaces'

const MessageItemList: React.VFC<{ messages: MessageItemProps[] | null }> = ({
  messages,
}) => {
  return (
    <div
      className={styles.container}
      style={{
        height: 'calc(100vh - 56px - 64px)',
        overflow: 'scroll',
      }}
    >
      {messages?.map((v, i) => (
        <MessageItem key={i} data={v} />
      ))}
    </div>
  )
}

export default MessageItemList
