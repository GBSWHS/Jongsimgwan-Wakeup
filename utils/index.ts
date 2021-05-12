import moment from 'moment'
import knex from 'knex'

const db = knex({
  client: 'mysql',
  connection: {
    host: process.env.MYSQLURL,
    port: 3306,
    database: process.env.DB,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPW
  }
})

export function getChart () {
  return new Promise(resolve => {
    const chart = []
    db.select('*').from('musicid').then(async (data) => {
      await data.forEach(async (v) => {
        const voted = await db.where({ musicid: v.id }).from('voted').select('*')
        chart.push({ voted, info: v, created_at: moment(v.created_at).format('YYYYMMDDhhmmss') })
        if (chart.length === data.length) {
          chart.sort((a, b) => a.created_at - b.created_at)
          chart.sort((a, b) => b.voted.length - a.voted.length)
          resolve(chart)
        }
      })
    })
  })
}
