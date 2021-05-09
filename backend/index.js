const { schedule } = require('node-cron')
const Melon = require('melon-chart-api')
const superagent = require('superagent')
const path = require('path').resolve()
const moment = require('moment')
const knex = require('knex')
require('dotenv').config({ path: path + '/../.env' })

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

if (process.argv[2]) return ResetData()

async function ResetData () {
  await db.from('musicid').select('*').del()
  await db.from('voted').select('*').del()
  Melon(moment().format('MM/DD/YYYY'), { cutLine: 10 }).daily().then(chartData => {
    const chart = chartData.data[0]
    superagent.post(`http://localhost:${process.env.PORT}/api/music/search`).send({ title: chart.artist + ' ' + chart.title }).then(async (data) => {
      if (!data || !data.body.success) return console.log(data.body)
      const { title, duration, album, videoId, artists } = data.body.search
      await db.insert({ title, duration, album: JSON.stringify(album), artist: JSON.stringify(artists), id: videoId, uploadby: '0000' }).from('musicid').select('*')
      console.log(`제목 : ${title}, 아티스트 : ${artists[0].name}, 길이 : ${duration}`)
    })
  })
}

schedule('0 8 * * 1-6', () => ResetData())
schedule('30 8 * * 0', () => ResetData())
