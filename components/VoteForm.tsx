import { useRouter } from 'next/router'
import Link from 'next/link'
import Card from './Card'

export default function VoteForm ({ chart, voted }: any) {
  const router = useRouter()

  async function Vote (id) {
    const res = await fetch('/api/music/vote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    }).then((res) => res.json())

    if (!res.success) return alert(res.msg)
    alert('투표하였습니다.')
    router.reload()
  }

  return (
    <div>
      <Card>
        <span className="block mt-3">내가 투표한 노래</span>
        <div className="shadow bg-red-400 pb-2 text-white text-center rounded-lg">
          <img src={ voted ? 'https://img.youtube.com/vi/' + voted.musicid + '/mqdefault.jpg' : '/images/searchdef.jpg'} className="rounded-lg w-full shadow-lg" />
          <h3 className="pt-2">{ voted ? chart.filter(data => data.info.id === voted.musicid)[0].info.title : '투표 안함'}</h3>
        </div>
      </Card>
      <div className="mb-10">
        <div className="inline-block px-10 w-full">
          <Link href="/"><button className="inline w-full max-w-sm align-top bg-gray-500 text-white rounded-md shadow p-2">돌아가기</button></Link>
        </div>
        <Card>
          <span className="block mt-3 mb-2">기상송 노래 목록</span>
          {chart.map((data) => (
            <div key={ data.info.id } className="hover:bg-gray-200 p-1 rounded-2xl grid grid-rows-3 grid-flow-col ">
              <div className="row-span-3"><Link href={'https://youtu.be/' + data.info.id}><img className="rounded-2xl w-32 h-20" src={'https://img.youtube.com/vi/' + data.info.id + '/mqdefault.jpg'} /></Link></div>
              <div className="col-span-2">{ data.info.title }</div>
              <div className="row-span-2 col-span-2">{ voted
                ? voted.musicid === data.info.id
                  ? <button disabled className="inline w-32 align-top bg-green-500 text-white rounded-md shadow p-2 mt-2">투표함</button>
                  : <button onClick={() => Vote(data.info.id)} className="inline w-32 align-top bg-red-500 text-white rounded-md shadow p-2 mt-2">투표</button>
                : <button onClick={() => Vote(data.info.id)} className="inline w-32 align-top bg-red-500 text-white rounded-md shadow p-2 mt-2">투표</button>
              }</div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  )
}
