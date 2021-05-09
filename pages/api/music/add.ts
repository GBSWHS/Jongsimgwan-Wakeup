import { NextApiRequest, NextApiResponse } from 'next'
import { verify } from 'jsonwebtoken'
import { parse } from 'cookieparser'
import knex from 'knex'

const db = knex({ client: 'mysql', connection: { host: process.env.MYSQLURL, port: 3306, database: process.env.DB, user: process.env.MYSQLUSER, password: process.env.MYSQLPW } })

export default async function add (req: NextApiRequest, res: NextApiResponse) {
  if (!req.headers.cookie) return res.json({ redirect: '/login' })
  const { token } = parse(req.headers.cookie)
  const { data } = req.body
  if (!token) return res.json({ redirect: '/login' })

  try {
    const decode = verify(token, process.env.JWT_TOKEN) as { id: string }
    const [user] = await db.select('*').where({ id: decode.id }).from('user')
    if (!user) return res.json({ redirect: '/login' })

    if (!data) return res.json({ success: false, msg: '등록할 음악의 정보를 입력해주세요.' })
    if (Number(data.duration.split(':')[0]) > 5) return res.send({ success: false, msg: '6분이상 곡은 신청할 수 없습니다.' })
    const { title, duration, album, videoId, artists } = data
    const [exist] = await db.select('*').where({ id: videoId }).from('musicid')
    if (exist) return res.json({ success: false, msg: '이미 등록된 곡입니다.' })
    await db.insert({ title, duration, album: JSON.stringify(album), artist: JSON.stringify(artists), id: videoId, uploadby: decode.id }).from('musicid').select('*')
    return res.send({ success: true })
  } catch (err) { return res.json({ success: false, err }) }
}
