export interface ChatMessage {
  message: string
  roomId: string
  userName: string
}

export interface ChatRoom {
  roomId: string
  roomName: string
  imagePic: string
}

export interface MessageItemProps {
  msg: string
  userName: string
  userPhotoUrl: string
}
