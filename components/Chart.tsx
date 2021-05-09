import Link from 'next/link'
import Card from './Card'
import sf from 'sf'

export default function Chart ({ chart }: any) {
  const imgurl = 'https://img.youtube.com/vi/' + chart[0].info.id + '/mqdefault.jpg'
  const yturl = 'https://youtu.be/' + chart[0].info.id
  const info = chart[0].info
  const voted = chart[0].voted

  return (
    <Card>
      <span className="block">현재 정심관 인기곡</span>
      <div className="shadow bg-red-400 pb-2 text-white text-center rounded-lg">
        <Link href={yturl}><img src={imgurl} className="rounded-lg w-full shadow-lg" /></Link>
        <h3 className="pt-2">{JSON.parse(chart[0].info.artist)[0] ? JSON.parse(chart[0].info.artist)[0].name : '아티스트'} : {info.title}</h3>
        <h3>{ info.uploadby === '0000' ? '어드민' : sf('{0}학년 {1}반 {2}번', info.uploadby.slice(0, 1), info.uploadby.slice(1, 2), info.uploadby.slice(2, 4))}이 등록함</h3>
        <h3>{voted[0] ? `${voted[0].id}번 외 ${voted.length - 1}명이 투표함` : '아무도 투표하지 않음'}</h3>
      </div>
    </Card>
  )
}
