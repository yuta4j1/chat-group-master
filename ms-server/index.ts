import { createServer } from 'http'
import { Server } from 'socket.io'
import path from 'path'
import { PrismaClient, Prisma } from '@prisma/client'
import { cursorIdGen } from './random'

interface ChatMessage {
  text: string
  roomId: string
  userId: string
}

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: `file:${path.resolve(process.cwd(), '..', 'prisma/dev.db')}`,
    },
  },
})

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
    const msgs = await prisma.message.findMany({
      where: {
        roomId: roomId,
      },
    })
    roomsNamespace.to(socket.id).emit('init_messages', msgs)
  })
  socket.on('message', async (data: ChatMessage) => {
    console.log('message data:', data)
    try {
      await prisma.message.create({
        data: {
          text: data.text,
          roomId: data.roomId,
          userId: data.userId,
          createdAt: new Date(),
          cursor: cursorIdGen(),
        } as Prisma.MessageCreateInput,
      })
    } catch (err) {
      console.error(err)
      const s = roomsNamespace.sockets.get(socket.id)
      if (s) {
        // メッセージ登録処理に失敗した通知
        // s.send()
      }
      return
    }
    const msg = data as ChatMessage
    roomsNamespace.to(msg.roomId).emit('get_message', JSON.stringify(msg))
  })

  socket.on('disconnecting', () => {
    console.log(socket.rooms) // the Set contains at least the socket ID
  })

  socket.on('disconnect', () => {
    console.log('接続が切られました')
  })
})

httpServer.listen(PORT)
