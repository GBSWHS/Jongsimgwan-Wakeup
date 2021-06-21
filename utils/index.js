const yt = require('youtube-search-api')
const moment = require('moment')
const knex = require('knex')

const db = knex({
  client: 'mysql',
  connection: {
    host: 'localhost',
    port: 3306,
    database: 'wakeup',
    user: 'wakeup'
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

export async function ytSearch (query) {
  return new Promise((resolve) => {
    yt.GetListByKeyword(`${query} "topic"`, false).then((result) => {
      resolve(result.items.filter((v) => v.thumbnail.thumbnails[0].width === 360 && v.thumbnail.thumbnails[0].height === 202))
    })
  })
}
