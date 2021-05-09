import Container from '../components/Container'
import Scroller from '../components/Scroller'
import AddForm from '../components/AddForm'
import Footer from '../components/Footer'
import { useRouter } from 'next/router'
import Card from '../components/Card'
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(r => r.json())
export default function musicadd () {
  const router = useRouter()
  const { data, error } = useSWR('/api/status', fetcher)

  if (!data) return <Container><Card>로딩중...</Card></Container>
  if (error) return <Container><span className="text-red">에러: {error}</span></Container>

  const { redirect } = data
  if (redirect) {
    router.push(redirect)
    return <Container><Card>로딩중...</Card></Container>
  }

  if (data.upload) window.location.href = '/'

  return (
    <Container>
      <Scroller>
        <AddForm />
      </Scroller>
      <Footer />
    </Container>
  )
}
