import { NextApiRequest, NextApiResponse } from 'next'
import { verify } from 'jsonwebtoken'
import { parse } from 'cookieparser'
import knex from 'knex'

const db = knex({ client: 'mysql', connection: { host: 'localhost', port: 3306, database: 'wakeup', user: 'wakeup' } })

export default async function del (req: NextApiRequest, res: NextApiResponse) {
  if (!req.headers.cookie) return res.json({ redirect: '/login' })
  const { token } = parse(req.headers.cookie)
  if (!token) return res.json({ redirect: '/login' })

  try {
    const decode = verify(token, process.env.JWT_TOKEN) as { id: string }
    const [user] = await db.select('*').where({ id: decode.id }).from('user')
    if (!user) return res.json({ redirect: '/login' })

    const [exist] = await db.select('*').where({ uploadby: decode.id }).from('musicid')
    if (!exist) return res.json({ redirect: '/', success: false, msg: '노래를 등록하지 않은 사용자.' })
    await db.where({ musicid: exist.id }).from('voted').select('*').del()
    await db.where({ uploadby: decode.id }).from('musicid').select('*').del()
    return res.send({ success: true })
  } catch (err) { return res.json({ success: false, err }) }
}
