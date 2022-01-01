import type { NextPage } from 'next'
import Link from 'next/link'
import { useState, useEffect, useCallback } from 'react'
import { useIsomorphicEffect } from '../hooks/use-isomorphic-effect'
import { io } from 'socket.io-client'
import { ChatMessage } from '../interfaces'

const socket = io("ws://localhost:8081/rooms")

const ChatPage: NextPage = () => {
    const [text, setText] = useState("")
    const [messageList, setMessageList] = useState<ChatMessage[]>([])

    console.log("messageList", messageList)

    useIsomorphicEffect(() => {
        socket.on("connect", () => {
            console.debug("Socket ID:", socket.id)
            socket.emit("join", "room1")
        })

        socket.on("disconnect", () => {
            console.log("接続が切れました")
        })
    }, [])

    useEffect(() => {

        socket.on("get_message", (msg) => {
            const _msg = JSON.parse(msg)
            setMessageList([...messageList, _msg])
        })

        return () => {
            socket.off('get_message')
        }

    }, [messageList])

    return (
        <div>
            <input type="text" value={text} onChange={e => setText(e.currentTarget.value)} />
            <button onClick={() => {
                const msg: ChatMessage = {
                    message: text,
                    roomId: "room1",
                    userName: "test-user"
                }
                socket.emit("message", msg)
                setText('')
            }}>送信</button>
            <Link href="/">Home画面へ</Link>
            <div>
                <ul>
                    {messageList.map((v, i) => <li key={i}>{v.message}</li>)}
                </ul>
            </div>
        </div>
    )
}

export default ChatPage