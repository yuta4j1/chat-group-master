import { PrismaClient, Prisma } from '@prisma/client'
const prisma = new PrismaClient()

// Userテーブルのシード
const userDatas: Prisma.UserCreateInput[] = [
  {
    id: 'uiodsa',
    name: 'yamauchi',
    email: 'yamauchi.kamaitachi@yoshimoto.co.jp',
    avatarUrl: 'test',
  },
  {
    id: 'vcgxhjz',
    name: 'hamaie',
    email: 'hamaie.kamaitachi@yoshimoto.co.jp',
    avatarUrl: 'test',
  },
]

// Channelテーブルのシード
const channelDatas: Prisma.ChannelCreateInput[] = [
  {
    id: 'DSJKAKLC',
    name: 'FRONTEND DEVELOPERS',
    description: 'フロントエンド開発の情報共有部屋。',
  },
  {
    id: 'CXHUKDLB',
    name: 'RAMDOM',
    description: 'ランダム',
  },
  {
    id: 'VGYDCWCP',
    name: 'BACKEND',
    description: 'バックエンドエンジニアの雑談場所',
  },
  {
    id: 'NMHOJGUC',
    name: 'CATS AND DOGS',
    description: '犬と猫を愛でる',
  },
]

// Channelテーブルのシード
const channelMembers: Prisma.ChannelMemberCreateInput[] = [
  {
    Channel: {
      connect: {
        id: 'DSJKAKLC',
      },
    },
    User: {
      connect: {
        id: 'uiodsa',
      },
    },
  },
  {
    Channel: {
      connect: {
        id: 'DSJKAKLC',
      },
    },
    User: {
      connect: {
        id: 'vcgxhjz',
      },
    },
  },
]

async function main() {
  for (const userData of userDatas) {
    await prisma.user.create({
      data: userData,
    })
  }

  for (const c of channelDatas) {
    await prisma.channel.create({
      data: c,
    })
  }

  for (const cm of channelMembers) {
    await prisma.channelMember.create({
      data: cm,
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
