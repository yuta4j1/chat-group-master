import React from 'react'
import MessageItem from '../MessageItem'
import styles from './MessageItemList.module.css'
import { ChatMessage, MessageItemProps } from '../../../interfaces'

const MessageItemList: React.VFC<{ messages: ChatMessage[] }> = ({
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
      {messages.map((v, i) => (
        <MessageItem
          key={i}
          data={
            {
              msg: v.message,
              userName: v.userName,
              userPhotoUrl: 'test',
            } as MessageItemProps
          }
        />
      ))}
    </div>
  )
}

export default MessageItemList
