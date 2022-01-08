import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

const userDatas: Prisma.UserCreateInput[] = [
  {
    id: 'fdaljkalsd',
    name: 'yamauchi',
    email: 'yamauchi.kamaita@gmail.com',
  },
  {
    id: 'clxozjk23d',
    name: 'hamaie',
    email: 'hamaie.kamaita@gmail.com',
  },
]

const chatMessageDatas: Prisma.ChatMessageCreateInput[] = [
  {
    userId: 'fdaljkalsd',
    roomId: 'ascklcl',
    message: 'テストメッセージです。',
  },
  {
    userId: 'fdaljkalsd',
    roomId: 'ascklcl',
    message: 'あああ',
  },
  {
    userId: 'fdaljkalsd',
    roomId: 'ascklcl',
    message: 'いいい',
  },
]

async function main() {
  for (const userData of userDatas) {
    await prisma.user.create({
      data: userData,
    })
  }

  for (const c of chatMessageDatas) {
    await prisma.chatMessage.create({
      data: c,
    })
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
