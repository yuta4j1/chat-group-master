const SEED = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

export const cursorIdGen = (): string => {
  return Array.from(Array(8))
    .map(() => SEED[Math.floor(Math.random() * SEED.length)])
    .join('')
}
