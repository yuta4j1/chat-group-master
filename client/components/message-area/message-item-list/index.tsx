import React, { useEffect, useMemo, useRef } from 'react'
import MessageItem from '../message-item'
import styles from './MessageItemList.module.css'
import { MessageItemProps } from '../../../interfaces'

let isFetchingHistoryData = false

const MessageItemList: React.VFC<{
  messages: MessageItemProps[] | null
  nextHistoryFetch: () => Promise<any>
}> = ({ messages, nextHistoryFetch }) => {
  const el = useRef<HTMLDivElement>(null)
  const prevScrollCapture = useRef<{
    scrollHeight: number
    scrollTop: number
  } | null>(null)

  const msgs = useMemo(() => {
    if (!messages) return []
    return [...messages.reverse()]
  }, [messages])

  useEffect(() => {
    const currScrollH = el.current?.scrollHeight
    if (currScrollH) {
      if (prevScrollCapture.current) {
        const scrollHeight = prevScrollCapture.current.scrollHeight
        const scrollTop = prevScrollCapture.current.scrollTop
        el.current.scrollTo(0, currScrollH - scrollHeight + scrollTop)
      } else {
        el.current.scrollTo(0, currScrollH)
      }
    }

    return () => {}
  }, [messages])

  return (
    <>
      <div
        className={styles.container}
        style={{
          height: 'calc(100vh - 56px - 64px)',
          overflow: 'scroll',
        }}
        ref={el}
        onScroll={(e) => {
          if (isFetchingHistoryData) {
            return
          }
          const fromTop = el.current?.scrollTop
          if (!fromTop) return
          if (fromTop < 100) {
            // 更新前のスクロール状態を保存する
            prevScrollCapture.current = {
              scrollHeight: el.current?.scrollHeight,
              scrollTop: el.current?.scrollTop,
            }
            isFetchingHistoryData = true
            // 次のメッセージを取得する
            nextHistoryFetch().then(() => {
              // データ取得に成功した場合、フラグをoffにする
              isFetchingHistoryData = false
            })
          }
        }}
      >
        {msgs.reverse().map((v, i) => (
          <MessageItem key={i} data={v} />
        ))}
      </div>
    </>
  )
}

export default MessageItemList
