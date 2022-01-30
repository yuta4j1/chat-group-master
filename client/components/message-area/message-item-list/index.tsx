import React, { useEffect, useMemo, useRef } from 'react'
import MessageItem from '../message-item'
import styles from './MessageItemList.module.css'
import { MessageItemProps } from '../../../interfaces'

const MessageItemList: React.VFC<{
  messages: MessageItemProps[] | null
  isCursorEnd: boolean
  nextHistoryFetch: () => Promise<any>
}> = ({ messages, isCursorEnd, nextHistoryFetch }) => {
  const isFetchingHistoryData = useRef(false)
  const el = useRef<HTMLDivElement>(null)
  const prevScrollCapture = useRef<{
    scrollHeight: number
    scrollTop: number
  } | null>(null)

  const msgs = useMemo(() => {
    if (!messages) return []
    return [...messages.reverse()]
  }, [messages])

  // useEffect(() => {
  //   const currScrollH = el.current?.scrollHeight
  //   if (currScrollH) {
  //     if (prevScrollCapture.current) {
  //       const scrollHeight = prevScrollCapture.current.scrollHeight
  //       const scrollTop = prevScrollCapture.current.scrollTop
  //       el.current.scrollTo(0, currScrollH - scrollHeight + scrollTop)
  //     } else {
  //       el.current.scrollTo(0, currScrollH)
  //     }
  //   }

  // }, [messages])

  const scrollToBottom = () => {
    const currScrollH = el.current?.scrollHeight
    if (currScrollH) {
      el.current.scrollTo(0, currScrollH)
    }
  }

  // チャット画面に見えている位置が、メッセージが追加された前後で変化しないよう
  // スクロールをコントロールするヘルパ関数
  const unflinchingScroll = () => {
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
  }

  useEffect(() => {
    if (isFetchingHistoryData.current) {
      unflinchingScroll()
      isFetchingHistoryData.current = false
    } else {
      // メッセージ追加時、画面下部までスクロールする
      scrollToBottom()
    }
  }, [messages])

  useEffect(() => {
    return () => {
      // コンポーネントがアンマウントされる際、prevScrollCapture の値をクリーンアップする
      prevScrollCapture.current = null
    }
  }, [])

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
          if (isFetchingHistoryData.current || isCursorEnd) {
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
            isFetchingHistoryData.current = true
            // 次のメッセージを取得する
            nextHistoryFetch().then(() => {
              // データ取得に成功した場合、フラグをoffにする
              // チャット画面に見えている位置が、メッセージが追加された前後で変化しないよう
              // スクロールをコントロールする
              unflinchingScroll()
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
