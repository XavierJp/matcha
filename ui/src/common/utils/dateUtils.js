import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { NBR_EXPIRATION_J7 } from '../contants'

export const willExpire = (date_expiration) => {
  dayjs.extend(relativeTime)

  const expire = dayjs(date_expiration)
  const result = expire.diff(Date(), 'days') > NBR_EXPIRATION_J7 ? false : true

  return result
}
