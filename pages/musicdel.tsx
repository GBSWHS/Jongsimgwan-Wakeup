import Container from '../components/Container'
import Footer from '../components/Footer'
import { useRouter } from 'next/router'
import Card from '../components/Card'
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(r => r.json())
export default function musicdel () {
  const router = useRouter()

  const { data, error } = useSWR('/api/status', fetcher)

  if (!data) return <Container><Card>로딩중...</Card></Container>
  if (error) return <Container><span className="text-red">에러: {error}</span></Container>

  const { redirect } = data
  if (redirect) {
    router.push(redirect)
    return <Container><Card>로딩중...</Card></Container>
  }

  main()

  async function main () {
    const res = await fetch('/api/music/del', {
      method: 'POST'
    }).then((res) => res.json())

    if (!await res.success) return router.push('/')
    alert('성공적으로 노래를 삭제 했습니다.')
    router.replace('/')
  }

  return <Container><Footer /></Container>
}
