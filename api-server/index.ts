import Fastify from 'fastify'
import cors from 'fastify-cors'
import { PrismaClient } from '@prisma/client'
import path from 'path'

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

fastify.get('/account/:id', async (request, reply) => {
  console.log('req', request)
  const user = await prisma.user.findUnique({
    where: {
      id: 'uiodsa',
    },
  })
  return { user: user }
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
