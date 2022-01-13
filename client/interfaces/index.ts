export interface ChannelMessage {
  text: string
  roomId: string
  userId: string
  createdAt: string
}

export interface ChannelMessageResponse {
  messages: {
    id: string
    text: string
    userId: string
    roomId: string
    cursor: string
    createdAt: string
  }[]
  cursor: string
}

export interface ChatRoom {
  roomId: string
  roomName: string
  imagePic: string
}

export interface MessageItemProps {
  text: string
  userId: string
  userName: string
  createdAt: string
  avatarUrl: string
}

export type User = {
  id: string
  email: string
  name: string
  avatarUrl: string
}

export type Channel = {
  id: string
  name: string
  description: string
}

export type ChannelListResponse = {
  channelList: Channel[]
}
