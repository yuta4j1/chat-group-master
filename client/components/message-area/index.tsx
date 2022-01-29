import React, { useEffect, useMemo } from 'react'
import Input from './input'
import styles from './MessageArea.module.css'
import MessageItemList from './message-item-list'
import {
  Channel,
  SendMessage,
  User,
  ChannelMessageResponse,
} from '../../interfaces'
import { cursorIdGen } from '../../lib/random'
import { useIsomorphicEffect } from '../../hooks/use-isomorphic-effect'
import { useChannelConversationsHisotryFetch } from '../../hooks/use-custom-fetch'
import { postRequest } from '../../fetcher'
import { io, Socket } from 'socket.io-client'
import { useSWRConfig } from 'swr'

let socket: Socket | null = null

const MessageArea: React.VFC<{
  channel: Channel | null
  member: User[] | null
}> = ({ channel, member }) => {
  const {
    data: msgRes,
    keyedMutate,
    isError,
    isLoading,
    nextFetch,
  } = useChannelConversationsHisotryFetch<ChannelMessageResponse>(channel?.id)
  // const [messageList, setMessageList] = useState<ChannelMessage[]>([])

  const { cache, mutate } = useSWRConfig()

  console.log({ cache })

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
    if (!socket || !channel) return
    socket.on('receive_message', (msg) => {
      const _msg = JSON.parse(msg)

      if (msgRes && msgRes.length > 0) {
        const _tmp = [...msgRes]
        _tmp[0].messages = [_msg, ..._tmp[0].messages]
        // ローカルキャッシュを更新する
        mutate(
          `/channels/${channel.id}/conversations`,
          (data: ChannelMessageResponse) => {
            const _tmp = [_msg, ...data.messages]
            return {
              ...data,
              messages: _tmp,
            }
          },
          false
        )
        keyedMutate(msgRes)
      }
    })

    return () => {
      socket?.off('receive_message')
    }
  }, [socket, channel, msgRes])

  const messages = useMemo(() => {
    return msgRes?.flatMap((v) => v.messages)
  }, [msgRes])

  console.log('-- messages', messages)

  return (
    <div className={styles.container}>
      <div className={styles.mainNav}>
        <div>{channel?.name ?? ''}</div>
      </div>
      <MessageItemList
        messages={
          member && messages
            ? messages.map((v) => {
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
        nextHistoryFetch={nextFetch}
      />
      <div>
        <Input
          sendMessage={async (msgText: string) => {
            if (!channel) return
            // TODO: ログインユーザのuserIdを渡す
            const msg: SendMessage = {
              text: msgText,
              roomId: channel.id,
              userId: 'uiodsa',
              createdAt: new Date(),
              cursor: cursorIdGen(),
            }
            try {
              const res = await postRequest<SendMessage, any>(
                `/channels/${channel.id}/conversations`,
                msg
              )
              if (res) {
                socket?.emit('broadcast_message', res.result)
              }
            } catch (err) {
              console.error(err)
            }
          }}
        />
      </div>
    </div>
  )
}

export default MessageArea
