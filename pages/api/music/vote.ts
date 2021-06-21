import { NextApiRequest, NextApiResponse } from 'next'
import { verify } from 'jsonwebtoken'
import { parse } from 'cookieparser'
import knex from 'knex'

const db = knex({ client: 'mysql', connection: { host: 'localhost', port: 3306, database: 'wakeup', user: 'wakeup' } })

export default async function vote (req: NextApiRequest, res: NextApiResponse) {
  if (!req.headers.cookie) return res.json({ redirect: '/login' })
  const { token } = parse(req.headers.cookie)
  const { id } = req.body
  if (!token) return res.json({ redirect: '/login' })

  try {
    const decode = verify(token, process.env.JWT_TOKEN) as { id: string }
    const [user] = await db.select('*').where({ id: decode.id }).from('user')
    if (!user) return res.json({ redirect: '/login' })

    if (!id) return res.json({ success: false, msg: '투표할 음악의 정보를 입력해주세요.' })
    const [exist] = await db.select('*').where({ id: decode.id }).from('voted')
    if (exist) await db.select('*').where({ id: decode.id }).from('voted').del()
    await db.insert({ id: decode.id, musicid: id }).select('*').from('voted')
    return res.json({ success: true })
  } catch (err) { return res.json({ success: false, err }) }
}
