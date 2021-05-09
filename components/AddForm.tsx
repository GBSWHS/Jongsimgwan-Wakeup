import { useRouter } from 'next/router'
import { useState } from 'react'
import Link from 'next/link'
import Card from './Card'

export default function AddForm () {
  const [image, setImage] = useState('/images/searchdef.jpg')
  const [text, setText] = useState('검색 안함')
  const [search, setSearch] = useState('')
  const [data, setData] = useState('')
  const router = useRouter()

  async function onSearch () {
    if (!search) return alert('노래 제목을 입력해주세요.')
    setText('검색중')
    const res = await fetch('/api/music/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: search })
    }).then((res) => res.json())

    if (!res.search) {
      setImage('/images/searchdef.jpg')
      setText('검색결과 없음')
      return
    }
    setImage(`https://img.youtube.com/vi/${res.search.videoId}/mqdefault.jpg`)
    setText(`${res.search.artists[0] ? res.search.artists[0].name : null} : ${res.search.title}`)
    setData(res.search)
  }

  async function onSubmit (event) {
    event.preventDefault()
    if (!data) return alert('노래를 검색해주세요.')
    const res = await fetch('/api/music/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data })
    }).then((res) => res.json())

    if (!res.success) return alert(res.msg)
    alert('성공적으로 노래를 추가 했습니다.')
    router.push('/')
  }

  return (
    <div>
      <Card>
        <span className="block">기상송 노래 등록</span>
        <small className="mb-5">욕설, 비방, 조롱, 혐오 등의 표현이 나올경우<br/>무통보 삭제될 수 있습니다</small>
        <div className="shadow bg-red-400 pb-2 text-white text-center rounded-lg">
          <img src={image} className="rounded-lg w-full shadow-lg" />
          <h3 className="pt-2">검색 결과</h3>
          <h3>{text}</h3>
        </div>
        <div className="border-2 grid-flow-col border-gray-100 mt-2 p-1 rounded-md shadow-sm auto-cols-max">
          <input onChange={(event) => setSearch(event.target.value)} className="w-11/12" type="text" placeholder="IU Celebrity"/>
        </div>
        <button type="button" onClick={onSearch} className="inline w-full max-w-sm align-top mt-1 bg-green-400 text-white rounded-md shadow p-2">노래 검색</button>
      </Card>
      <form onSubmit={onSubmit} className="mb-5">
        <div className="inline-block px-10 mt-2 w-full">
          <button type="submit" className="inline w-full max-w-sm align-top bg-green-500 text-white rounded-md shadow p-2">노래 등록</button>
        </div>
        <div className="inline-block px-10 my-2 w-full">
          <Link href="/"><button className="inline w-full max-w-sm align-top bg-gray-500 text-white rounded-md shadow p-2">돌아가기</button></Link>
        </div>
      </form>
    </div>
  )
}
