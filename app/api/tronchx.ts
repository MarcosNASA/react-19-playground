import { db } from '../db'
import { Tronchx } from '../features/tronchx/domain'

const asyncify =
  <Function extends (...args: any[]) => any>(
    fn: Function,
    { delay = 1000 } = {},
  ) =>
  (...args: Parameters<Function>): Promise<ReturnType<Function>> =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve(fn(...args))
      }, delay)
    })

const get = asyncify(() => {
  const {
    data: { tronchxs },
  } = db
  return tronchxs
})

const upsert = asyncify(async (tronchxToUpsert: Tronchx) => {
  const {
    data: { tronchxs },
  } = db

  await db.update(({ tronchxs }) => {
    const tronchxIndex = tronchxs.findIndex(
      (tronchx) => tronchx.id === tronchxToUpsert.id,
    )
    if (tronchxIndex === -1) {
      tronchxs.push(tronchxToUpsert)
      return tronchxs[tronchxs.length - 1]
    }
    tronchxs[tronchxIndex] = tronchxToUpsert
  })

  return tronchxs[tronchxs.length - 1]
})

export const TronchxsAPI = {
  get,
  upsert,
}
