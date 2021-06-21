const { schedule } = require('node-cron')
const yt = require('youtube-search-api')
const Melon = require('melon-chart-api')
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

ResetData()
async function ResetData () {
  await db.from('musicid').select('*').del()
  await db.from('voted').select('*').del()
  Melon(moment().format('MM/DD/YYYY'), { cutLine: 10 }).daily().then(chart => {
    yt.GetListByKeyword(`${chart.data[0].title} "topic"`, false).then(async (result) => {
      const data = result.items.filter((v) => v.thumbnail.thumbnails[0].width === 360 && v.thumbnail.thumbnails[0].height === 202)
      if (!data) return console.log(data)
      const { id, title, length } = data[0]
      const duration = length.simpleText
      await db.insert({ title, duration, id, uploadby: '0000' }).from('musicid').select('*')
      console.info(`──────────────────────────────────────────────────────────────────────────\n${moment().format('YYYY년 MM월 DD일 hh시 mm분 ss초')} 갱신\n노래 제목: ${title}\n노래 길이: ${duration}\n──────────────────────────────────────────────────────────────────────────`)
    })
  })
}

schedule('0 8 * * 1-6', ResetData)
schedule('30 8 * * 0', ResetData)
