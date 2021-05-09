import Container from '../components/Container'
import LogoutBtn from '../components/LogoutBtn'
import LoginInfo from '../components/LoginInfo'
import MusicBtn from '../components/MusicBtn'
import Scroller from '../components/Scroller'
import Footer from '../components/Footer'
import Chart from '../components/Chart'
import { useRouter } from 'next/router'
import Card from '../components/Card'
import Link from 'next/link'
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(r => r.json())
export default function Home () {
  const router = useRouter()
  const { data, error } = useSWR('/api/status', fetcher)

  if (!data) return <Container><Card><span className="text-xl">로딩중...</span><span className="block">인터넷 연결 상태를 확인하세요</span></Card></Container>
  if (error) return <Container><span className="text-red">에러: {error}</span></Container>

  const { redirect, chart, user } = data
  if (redirect) {
    router.push(redirect)
    return <Container><Card>로딩중...</Card></Container>
  }

  return (
    <Container>
      <Scroller>
        <Chart chart={chart} />
        <LoginInfo user={user} />
        <MusicBtn added={data} />

        <LogoutBtn />
        <div className="inline-block px-10 w-full mb-20">
          <Link href="/passwd">
            <button className="inline w-full max-w-sm align-top bg-gray-500 text-white rounded-md shadow p-2">비밀번호 변경</button>
          </Link>
        </div>
      </Scroller>

      <Footer />
    </Container>
  )
}
