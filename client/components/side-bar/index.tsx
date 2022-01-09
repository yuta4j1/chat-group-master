import React, { useState } from 'react'
import styles from './SideBar.module.css'
import { AiOutlineSearch } from 'react-icons/ai'
import { Channel } from '../../interfaces'

const SideBar: React.VFC<{
  channels: Channel[]
  cbSelectRoom: (roomId: string) => void
}> = ({ channels, cbSelectRoom }) => {
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
          {channels.map((v, i) => (
            <li
              key={i}
              onClick={() => {
                cbSelectRoom(v.id)
              }}
            >
              {v.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default SideBar
