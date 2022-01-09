import React, { useState, useEffect } from 'react'
import Input from './input'
import styles from './MessageArea.module.css'
import MessageItemList from './message-item-list'
import { Channel, ChatMessage } from '../../interfaces'
import { useIsomorphicEffect } from '../../hooks/use-isomorphic-effect'
import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null

const MessageArea: React.VFC<{ channel: Channel }> = ({ channel }) => {
  const [messageList, setMessageList] = useState<ChatMessage[]>([])

  console.log('messageList', messageList)

  useIsomorphicEffect(() => {
    // チャンネルが切り替わる毎に、WebSocketの接続を行う。
    socket = io('ws://localhost:8081/rooms')
    socket.on('connect', () => {
      console.log('[Connected] socketID:', socket.id)
      socket.emit('join', channel.id)
    })

    socket.on('disconnect', () => {
      console.log('socket disconnected')
    })

    return () => {
      // チャンネルが切り替わる際、コネクションを破棄する
      socket.disconnect()
    }
  }, [channel])

  useEffect(() => {
    if (!socket) return
    socket.on('get_message', (msg) => {
      const _msg = JSON.parse(msg)
      setMessageList([...messageList, _msg])
    })

    return () => {
      socket.off('get_message')
    }
  }, [messageList, socket, channel])

  return (
    <div className={styles.container}>
      <MessageItemList messages={messageList} />
      <div>
        <Input
          sendMessage={(msgText: string) => {
            const msg: ChatMessage = {
              message: msgText,
              roomId: channel.id,
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
