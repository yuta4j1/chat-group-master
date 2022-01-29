import { createServer } from 'http'
import { Server } from 'socket.io'
// import path from 'path'
// import { PrismaClient } from '@prisma/client'

interface ChatMessage {
  text: string
  roomId: string
  userId: string
}

interface SendMessage {
  text: string
  roomId: string
  userId: string
  createdAt: Date
  cursor: string
}

// const prisma = new PrismaClient({
//   datasources: {
//     db: {
//       url: `file:${path.resolve(process.cwd(), '..', 'prisma/dev.db')}`,
//     },
//   },
// })

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
  socket.on('join', async (roomId) => {
    console.log(`Joined at ${roomId}`)
    socket.join(roomId)
  })

  socket.on('broadcast_message', async (data: SendMessage) => {
    roomsNamespace.to(data.roomId).emit('receive_message', JSON.stringify(data))
  })

  socket.on('disconnecting', () => {
    console.log(socket.rooms) // the Set contains at least the socket ID
  })

  socket.on('disconnect', () => {
    console.log('接続が切られました')
  })
})

httpServer.listen(PORT)
