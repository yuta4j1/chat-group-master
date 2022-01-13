const SEED = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

export const channelIdGen = (): string => {
  return Array.from(Array(8))
    .map(() => SEED[Math.floor(Math.random() * SEED.length)])
    .join('')
}