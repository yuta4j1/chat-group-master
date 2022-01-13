import React, { useState, useEffect } from 'react'
import Input from './input'
import styles from './MessageArea.module.css'
import MessageItemList from './message-item-list'
import {
  Channel,
  ChannelMessage,
  User,
  ChannelMessageResponse,
} from '../../interfaces'
import { useIsomorphicEffect } from '../../hooks/use-isomorphic-effect'
import { useConditionalFetch } from '../../hooks/use-custom-fetch'
import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null

const MessageArea: React.VFC<{
  channel: Channel | null
  member: User[] | null
}> = ({ channel, member }) => {
  const { data: msgRes } = useConditionalFetch<ChannelMessageResponse>(
    `/channels/${channel?.id}/conversations`,
    () => !!channel
  )
  const [messageList, setMessageList] = useState<ChannelMessage[]>([])

  useIsomorphicEffect(() => {
    if (!channel) return
    // チャンネルが切り替わる毎に、WebSocketの接続を行う。
    socket = io('ws://localhost:8081/rooms')
    socket.on('connect', () => {
      if (!socket) return
      console.log('[Connected] socketID:', socket.id)
      socket.emit('join', channel.id)
    })

    socket.on('disconnect', () => {
      console.log('socket disconnected')
    })

    return () => {
      // チャンネルが切り替わる際、コネクションを破棄する
      socket?.disconnect()
    }
  }, [channel])

  useEffect(() => {
    if (!socket) return
    socket.on('get_message', (msg) => {
      const _msg = JSON.parse(msg)
      setMessageList([...messageList, _msg])
    })

    socket.on('init_messages', (msgs) => {
      setMessageList(msgs)
    })

    return () => {
      socket?.off('get_message')
      socket?.off('init_messages')
    }
  }, [messageList, socket, channel])

  return (
    <div className={styles.container}>
      <div className={styles.mainNav}>
        <div>{channel?.name ?? ''}</div>
      </div>
      <MessageItemList
        messages={
          member && msgRes?.messages
            ? msgRes.messages.map((v) => {
                const u = member.find((vv) => vv.id === v.userId)
                return {
                  userId: v.userId,
                  text: v.text,
                  userName: u?.name ?? 'UNKNOWN',
                  avatarUrl: u?.avatarUrl ?? '',
                  createdAt: v.createdAt,
                }
              })
            : null
        }
      />
      <div>
        <Input
          sendMessage={(msgText: string) => {
            if (!channel) return
            // TODO: ログインユーザのuserIdを渡す
            const msg: { text: string; roomId: string; userId: string } = {
              text: msgText,
              roomId: channel.id,
              userId: 'uiodsa',
            }
            socket?.emit('message', msg)
          }}
        />
      </div>
    </div>
  )
}

export default MessageArea
