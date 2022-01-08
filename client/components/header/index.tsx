import React from 'react'
import styles from './Header.module.css'
import { BsPlus } from 'react-icons/bs'

const Header: React.VFC<{ roomName: string }> = ({ roomName }) => {
  return (
    <nav className={styles.container}>
      <div className={styles.sideNav}>
        <div>Channels</div>
        <button className={styles.channelAddButton}>
          <BsPlus size={21} />
        </button>
      </div>
      <div className={styles.mainNav}>
        <div>{roomName}</div>
      </div>
    </nav>
  )
}

export default Header
