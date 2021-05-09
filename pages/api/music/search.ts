import { NextApiRequest, NextApiResponse } from 'next'
import { exec } from 'child_process'
import path from 'path'

export default function search (req: NextApiRequest, res: NextApiResponse) {
  const { title } = req.body
  if (!title) return res.json({ success: false, msg: '제목을 입력해주세요.' })
  console.log(title)
  exec(`${process.env.PYTHONEX} ${path.resolve()}/pages/api/music/index.py ${title}`, (err, out) => {
    if (err || !JSON.parse(out)[0]) return res.send({ success: false, msg: '검색 결과가 없거나 오류가 발생했습니다.', err })
    return res.send({ success: true, search: JSON.parse(out)[0] })
  })
}
