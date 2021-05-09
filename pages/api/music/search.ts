import { NextApiRequest, NextApiResponse } from 'next'
import { post } from 'superagent'

export default function search (req: NextApiRequest, res: NextApiResponse) {
  const { title } = req.body
  if (!title) return res.json({ success: false, msg: '제목을 입력해주세요.' })
  post(`http://localhost:${process.env.PORT}/search`)
    .set('content-type', 'application/json')
    .send({ title })
    .then((_res) => {
      if (!_res.body) return res.json({ success: false, msg: '검색 결과가 없거나 오류가 발생하였습니다.' })
      res.send({ success: true, msg: _res.body })
    })
}
