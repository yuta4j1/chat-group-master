
import React, { useState, useEffect } from 'react'
import Input from './input'
import styles from './MessageArea.module.css'
import MessageItemList from './message-item-list'
import { ChatRoom, ChatMessage } from '../../interfaces'
import { useIsomorphicEffect } from '../../hooks/use-isomorphic-effect'
import { io } from 'socket.io-client'

const socket = io('ws://localhost:8081/rooms')

const MessageArea: React.VFC<{ room: ChatRoom }> = ({ room }) => {
  const [messageList, setMessageList] = useState<ChatMessage[]>([])

  console.log('messageList', messageList)

  useIsomorphicEffect(() => {
    socket.on('connect', () => {
      console.log('Socket ID:', socket.id)
      socket.emit('join', room.roomId)
    })

    socket.on('disconnect', () => {
      console.log('接続が切れました')
    })
  }, [])

  useEffect(() => {
    socket.on('get_message', (msg) => {
      const _msg = JSON.parse(msg)
      setMessageList([...messageList, _msg])
    })

    return () => {
      socket.off('get_message')
    }
  }, [messageList])

  return (
    <div className={styles.container}>
      <MessageItemList messages={messageList} />
      <div>
        <Input
          sendMessage={(msgText: string) => {
            const msg: ChatMessage = {
              message: msgText,
              roomId: room.roomId,
              userName: 'test-user',
            }
            socket.emit('message', msg)
          }}
        />
      </div>
    </div>
  )
}

export default MessageArea