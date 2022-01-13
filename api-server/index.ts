import Fastify from 'fastify'
import cors from 'fastify-cors'
import { PrismaClient } from '@prisma/client'
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

fastify.get('/channels', async (request, reply) => {
  const channelList = await prisma.channel.findMany()
  return { channelList: channelList }
})

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

fastify.get('/channels/:channel_id/conversations', async (request, reply) => {
  const chId = (request.params as { channel_id: string }).channel_id
  const msgs = await prisma.message.findMany({
    where: {
      roomId: chId,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 20,
  })
  return { messages: msgs, cursor: '' }
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
