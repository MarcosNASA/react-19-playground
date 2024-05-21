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

const upsert = asyncify((tronchxToUpsert: Tronchx) => {
  const {
    data: { tronchxs },
  } = db
  const tronchxIndex = tronchxs.findIndex(
    (tronchx) => tronchx.id === tronchxToUpsert.id,
  )
  if (tronchxIndex === -1) {
    db.data.tronchxs.push(tronchxToUpsert)
  }
  db.data.tronchxs[tronchxIndex] = tronchxToUpsert
})

export const TronchxsAPI = {
  get,
  upsert,
}
