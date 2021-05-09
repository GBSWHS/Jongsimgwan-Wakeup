import { NextApiRequest, NextApiResponse } from 'next'
import { getChart } from '../../../utils/index'

export default async function chart (req: NextApiRequest, res: NextApiResponse) {
  getChart().then(data => res.json(data))
}
