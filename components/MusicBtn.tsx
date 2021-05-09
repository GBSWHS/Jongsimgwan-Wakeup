import Link from 'next/link'

export default function MusicBtn ({ added }: any) {
  const addbtns = added.upload
    ? <Link href="/musicdel"><button className="inline w-full max-w-sm align-top bg-green-400 text-white rounded-md shadow p-2">음악 삭제</button></Link>
    : <Link href="/musicadd"><button className="inline w-full max-w-sm align-top bg-green-400 text-white rounded-md shadow p-2">음악 추가</button></Link>

  return (
    <div className="inline-block px-10 my-2 w-full">
      { addbtns }<br/>
      <Link href="/musicvote">
        <button className="inline w-full max-w-sm align-top bg-green-400 mt-1 text-white rounded-md shadow p-2">음악 투표</button>
      </Link>
    </div>
  )
}
