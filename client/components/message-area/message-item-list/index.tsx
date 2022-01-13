import React, { useMemo } from 'react'
import MessageItem from '../message-item'
import styles from './MessageItemList.module.css'
import { MessageItemProps } from '../../../interfaces'

const MessageItemList: React.VFC<{ messages: MessageItemProps[] | null }> = ({
  messages,
}) => {
  const msgs = useMemo(() => {
    if (!messages) return []
    return [...messages.reverse()]
  }, [messages])
  return (
    <div
      className={styles.container}
      style={{
        height: 'calc(100vh - 56px - 64px)',
        overflow: 'scroll',
      }}
    >
      {msgs.reverse().map((v, i) => (
        <MessageItem key={i} data={v} />
      ))}
    </div>
  )
}

export default MessageItemList
