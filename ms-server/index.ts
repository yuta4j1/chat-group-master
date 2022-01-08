import { createServer } from 'http'
import { Server } from 'socket.io'

interface ChatMessage {
  message: string
  roomId: string
  userName: string
}

const httpServer = createServer()
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
})

const roomsNamespace = io.of('rooms')

const PORT = 8081
roomsNamespace.on('connection', (socket) => {
  socket.on('join', (roomId) => {
    console.log(`Joined at ${roomId}`)
    socket.join(roomId)
  })
  socket.on('message', (data) => {
    console.log('message data:', data)
    const msg = data as ChatMessage
    roomsNamespace.to(msg.roomId).emit('get_message', JSON.stringify(msg))
  })
})

httpServer.listen(PORT)
