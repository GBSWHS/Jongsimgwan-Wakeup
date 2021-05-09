import Container from '../components/Container'
import VoteForm from '../components/VoteForm'
import Scroller from '../components/Scroller'
import Footer from '../components/Footer'
import { useRouter } from 'next/router'
import Card from '../components/Card'
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(r => r.json())
export default function musicvote () {
  const router = useRouter()
  const { data, error } = useSWR('/api/status', fetcher)

  if (!data) return <Container><Card>로딩중...</Card></Container>
  if (error) return <Container><span className="text-red">에러: {error}</span></Container>

  const { redirect, chart, voted } = data
  if (redirect) {
    router.push(redirect)
    return <Container><Card>로딩중...</Card></Container>
  }

  return (
    <Container>
      <Scroller>
        <VoteForm chart={chart} voted={voted} />
      </Scroller>

      <Footer />
    </Container>
  )
}
