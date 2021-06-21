import { NextApiRequest, NextApiResponse } from 'next'
import { parse } from 'cookieparser'
import { verify } from 'jsonwebtoken'
import { getChart } from '../../utils'
import knex from 'knex'

const db = knex({ client: 'mysql', connection: { host: 'localhost', port: 3306, database: 'wakeup', user: 'wakeup' } })

export default async function statusApi (req: NextApiRequest, res: NextApiResponse) {
  if (!req.headers.cookie) return res.json({ redirect: '/login' })

  const { token } = parse(req.headers.cookie)
  if (!token) return res.json({ redirect: '/login' })

  try {
    const decode = verify(token, process.env.JWT_TOKEN) as { id: string }
    const [user] = await db.select('*').where({ id: decode.id }).from('user')
    if (!user) return res.json({ redirect: '/login' })

    const chart = await getChart()
    const { id, grade, class: classid, nickname, num } = user
    const [exist] = await db.select('*').where({ uploadby: decode.id }).from('musicid')
    const [existvote] = await db.select('*').where({ id: decode.id }).from('voted')
    return res.json({ user: { id, grade, class: classid, nickname, num }, chart, upload: !!exist, voted: existvote })
  } catch (err) { console.log(err); return res.json({ redirect: '/login' }) }
}
