import { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { Channel, ChannelListResponse } from '../interfaces'
import { useCustomFetch } from '../hooks/use-custom-fetch'
import Header from '../components/header'
import SideBar from '../components/side-bar'
import MessageArea from '../components/message-area'
import styles from '../styles/Index.module.css'

const IndexPage: NextPage = () => {
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null)
  const {
    data: channels,
    isError,
    isLoading,
  } = useCustomFetch<ChannelListResponse>('/channels')

  useEffect(() => {
    const chs = channels?.channelList
    if (chs && chs.length > 0) {
      setSelectedChannel(chs[0])
    }
  }, [channels])

  return (
    <div className={styles.containerWrapper}>
      <Header roomName={selectedChannel ? selectedChannel.name : ''} />
      <div
        className={styles.bodyWrapper}
        style={{
          height: 'calc(100% - 64px)',
        }}
      >
        {isLoading && <p>Loading...</p>}
        {isError && <p>チャンネル情報の取得に失敗しました。</p>}
        {channels && (
          <SideBar
            channels={channels.channelList}
            cbSelectRoom={(roomId: string) => {
              const r = channels.channelList.find((v) => v.id === roomId)
              if (r) {
                setSelectedChannel(r)
              } else {
                setSelectedChannel(null)
              }
            }}
          />
        )}
        {selectedChannel && <MessageArea channel={selectedChannel} />}
      </div>
    </div>
  )
}

export default IndexPage
