import { NextApiRequest, NextApiResponse } from 'next'
import { ytSearch } from '../../../utils'

export default function search (req: NextApiRequest, res: NextApiResponse) {
  const { title } = req.query
  if (!title) return res.json({ success: false, msg: '제목을 입력해주세요.' })
  ytSearch(title).then((r) => { res.send({ success: true, msg: r }) })
}
