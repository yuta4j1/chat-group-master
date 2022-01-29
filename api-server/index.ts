import Fastify from 'fastify'
import cors from 'fastify-cors'
import { PrismaClient, Prisma } from '@prisma/client'
import path from 'path'
import { channelIdGen } from './random'

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: `file:${path.resolve(process.cwd(), '..', 'prisma/dev.db')}`,
    },
  },
})

const fastify = Fastify({
  logger: true,
})

fastify.register(cors)

// チャンネル情報の取得
fastify.get('/channels', async (request, reply) => {
  const channelList = await prisma.channel.findMany()
  return { channelList: channelList }
})

// チャンネルの追加登録
fastify.post('/channels', async (request, reply) => {
  const reqBody = request.body as { name: string; description: string }
  const newChId = channelIdGen()
  try {
    await prisma.channel.create({
      data: {
        id: newChId,
        name: reqBody.name,
        description: reqBody.description,
      },
    })
    return { result: 'success' }
  } catch (err) {
    console.error(err)
    return { result: 'error' }
  }
})

// チャンネル所属のメンバー取得
fastify.get('/channels/:channel_id/members', async (request, reply) => {
  const chMembers = await prisma.channelMember.findMany({
    where: {
      channelId: (request.params as { channel_id: string }).channel_id,
    },
    include: {
      User: true,
    },
  })
  return { members: chMembers.map((v) => v.User) }
})

fastify.get('/account/:id', async (request, reply) => {
  const user = await prisma.user.findUnique({
    where: {
      id: 'uiodsa',
    },
  })
  return { user: user }
})

const PER_PAGE_NUM = 20

// メッセージ履歴の取得
fastify.get('/channels/:channel_id/conversations', async (request, reply) => {
  let cursorId = null
  const qParam = JSON.parse(JSON.stringify(request.query))
  if (qParam) {
    cursorId = (qParam as { cursor: string }).cursor
  }
  const chId = (request.params as { channel_id: string }).channel_id
  let conds: Prisma.MessageFindManyArgs = {
    where: {
      roomId: chId,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: PER_PAGE_NUM,
  }
  if (cursorId) {
    conds = {
      ...conds,
      cursor: {
        cursor: cursorId,
      },
      skip: 1,
    }
  }

  console.log('*** conds', conds)

  const msgs = await prisma.message.findMany(conds)
  let res = null
  if (msgs.length < PER_PAGE_NUM) {
    // 最終ページの場合、cursorは空文字で返す
    res = { messages: msgs, cursor: '' }
  } else {
    res = { messages: msgs, cursor: msgs[msgs.length - 1].cursor }
  }
  return res
})

interface SendMessage {
  text: string
  roomId: string
  userId: string
  createdAt: Date
  cursor: string
}

// メッセージの送信
fastify.post('/channels/:channel_id/conversations', async (request, reply) => {
  const reqBody = request.body as SendMessage
  try {
    const res = await prisma.message.create({
      data: reqBody,
    })
    return { result: res }
  } catch (err) {
    console.error(err)
    return { err }
  }
})

const start = async () => {
  try {
    await fastify.listen(1234)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
