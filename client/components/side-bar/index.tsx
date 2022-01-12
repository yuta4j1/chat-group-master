import React, { useState, useMemo } from 'react'
import styles from './SideBar.module.css'
import { AiOutlineSearch } from 'react-icons/ai'
import { BsPlus } from 'react-icons/bs'
import { MdArrowBackIos } from 'react-icons/md'
import { Channel, User } from '../../interfaces'

const SideBar: React.VFC<{
  channels: Channel[]
  cbSelectRoom: (roomId: string) => void
  channelMemberMap: { [key: string]: User[] }
}> = ({ channels, cbSelectRoom, channelMemberMap }) => {
  const [filterText, setFilterText] = useState('')
  const [detailedChannel, setDetailedChannel] = useState<Channel | null>(null)

  const isChannelDetailMode = !!detailedChannel

  const detailedChannelMembers = useMemo(() => {
    if (!detailedChannel) return null
    const members = channelMemberMap[detailedChannel.id]
    return members ?? null
  }, [detailedChannel, channelMemberMap])

  return (
    <div className={styles.contentWrapper}>
      {isChannelDetailMode ? (
        <div className={styles.sideNavBack}>
          <button
            className={styles.backChannelListButton}
            onClick={() => setDetailedChannel(null)}
          >
            <MdArrowBackIos size={21} />
          </button>
          <div>All Channels</div>
        </div>
      ) : (
        <div className={styles.sideNavChannelAdd}>
          <div>Channels</div>
          <button className={styles.channelAddButton}>
            <BsPlus size={21} />
          </button>
        </div>
      )}
      {isChannelDetailMode ? (
        <div>
          <section className={styles.channelDescriptionArea}>
            <h2>{detailedChannel.name}</h2>
            <p>{detailedChannel.description}</p>
          </section>
          <section className={styles.memberListArea}>
            <h2>MEMBER</h2>
            <ul>
              {detailedChannelMembers?.map((v, i) => (
                <li key={i}>{v.name}</li>
              ))}
            </ul>
          </section>
        </div>
      ) : (
        <>
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
                    setDetailedChannel(v)
                  }}
                >
                  {v.name}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  )
}

export default SideBar
