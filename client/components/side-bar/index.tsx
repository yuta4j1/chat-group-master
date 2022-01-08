import React, { useState } from 'react'
import styles from './SideBar.module.css'
import { AiOutlineSearch } from 'react-icons/ai'
import { ChatRoom } from '../../interfaces'

const SideBar: React.VFC<{
  rooms: ChatRoom[]
  cbSelectRoom: (roomId: string) => void
}> = ({ rooms, cbSelectRoom }) => {
  const [filterText, setFilterText] = useState('')
  return (
    <div className={styles.contentWrapper}>
      <div className={styles.searchTextArea}>
        <AiOutlineSearch size={16} />
        <input
          type="text"
          className={styles.inputText}
          value={filterText}
          placeholder="Search"
          onChange={(e) => setFilterText(e.currentTarget.value)}
        />
      </div>
      <div className={styles.roomListArea}>
        <ul>
          {rooms.map((v, i) => (
            <li
              key={i}
              onClick={() => {
                cbSelectRoom(v.roomId)
              }}
            >
              {v.roomName}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default SideBar
