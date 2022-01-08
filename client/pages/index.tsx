import { NextPage } from 'next'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ChatMessage, ChatRoom } from '../interfaces'
import Header from '../components/header'
import SideBar from '../components/side-bar'
import MessageArea from '../components/message-area'
import styles from '../styles/Index.module.css'

const roomList: ChatRoom[] = [
  {
    roomId: 'ascklcl',
    roomName: 'FRONTEND DEVELOPERS',
    imagePic: '',
  },
  {
    roomId: 'fhdask',
    roomName: 'RAMDOM',
    imagePic: '',
  },
  {
    roomId: 'cjdkfg',
    roomName: 'BACKEND',
    imagePic: '',
  },
  {
    roomId: '189fdsa',
    roomName: 'CATS AND DOGS',
    imagePic: '',
  },
  {
    roomId: 'oafidsof',
    roomName: 'WELCOME',
    imagePic: '',
  },
]

const fetchRooms = () => {
  return roomList
}

const IndexPage: NextPage = () => {
  const [rooms, setRooms] = useState<ChatRoom[]>([])
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null)

  useEffect(() => {
    setRooms(fetchRooms())
  }, [])

  useEffect(() => {
    if (rooms && rooms.length > 0) {
      setSelectedRoom(rooms[0])
    }
  }, [rooms])

  return (
    <div className={styles.containerWrapper}>
      <Header roomName={selectedRoom ? selectedRoom.roomName : ''} />
      <div
        className={styles.bodyWrapper}
        style={{
          height: 'calc(100% - 64px)',
        }}
      >
        <SideBar
          rooms={rooms}
          cbSelectRoom={(roomId: string) => {
            const r = rooms.find((v) => v.roomId === roomId)
            if (r) {
              setSelectedRoom(r)
            } else {
              setSelectedRoom(null)
            }
          }}
        />
        {selectedRoom && <MessageArea room={selectedRoom} />}
      </div>
    </div>
  )
}

export default IndexPage