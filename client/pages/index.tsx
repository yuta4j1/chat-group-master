import { NextPage } from 'next'
import { useEffect, useState, useMemo, useCallback, useRef } from 'react'
import { useSWRConfig } from 'swr'
import { Channel, ChannelListResponse, User } from '../interfaces'
import { useCustomFetch } from '../hooks/use-custom-fetch'
import { getRequest } from '../fetcher'
import SideBar from '../components/side-bar'
import MessageArea from '../components/message-area'
import styles from '../styles/Index.module.css'

const IndexPage: NextPage = () => {
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null)
  const [channelMemberMap, setChannelMemberMap] = useState<{
    [key: string]: User[]
  }>({})
  // 最新のchannelMemberMapを保持しておく
  const latestChannelMemberMap = useRef(channelMemberMap)
  const {
    data: channels,
    isError,
    isLoading,
  } = useCustomFetch<ChannelListResponse>('/channels')

  const { mutate } = useSWRConfig()

  useEffect(() => {
    const chs = channels?.channelList
    if (chs && chs.length > 0) {
      setSelectedChannel(chs[0])
    }
  }, [channels])

  useEffect(() => {
    ;(async () => {
      if (!selectedChannel) return
      try {
        const channelId = selectedChannel.id
        const res = await mutate(
          `/channels/${channelId}/members`,
          getRequest(`/channels/${selectedChannel.id}/members`)
        )
        setChannelMemberMap({
          ...latestChannelMemberMap.current,
          [channelId]: res.members,
        })
        // updateChMemberMap(channelId, res.members)
      } catch (err) {
        console.error(err)
      }
    })()
  }, [selectedChannel])

  // チャンネルに所属しているユーザ情報
  const channelMember = useMemo(() => {
    if (!selectedChannel) return null
    const mems = channelMemberMap[selectedChannel.id]
    return mems ?? null
  }, [selectedChannel, channelMemberMap])

  return (
    <div className={styles.containerWrapper}>
      <div className={styles.bodyWrapper}>
        {isLoading && <p>Loading...</p>}
        {isError && <p>チャンネル情報の取得に失敗しました。</p>}
        {channels && (
          <SideBar
            channelMemberMap={channelMemberMap}
            channels={channels.channelList}
            cbSelectRoom={async (roomId: string) => {
              const r = channels.channelList.find((v) => v.id === roomId)
              if (r) {
                setSelectedChannel(r)
              } else {
                setSelectedChannel(null)
              }
            }}
          />
        )}
        <MessageArea channel={selectedChannel} member={channelMember} />
      </div>
    </div>
  )
}

export default IndexPage
