import Head from 'next/head'
import '../styles/globals.css'
import 'tailwindcss/tailwind.css'

function MyApp ({ Component, pageProps }: any) {
  return (
    <>
      <Head>
        <title>정심관 기상송 관리 시스템 - WakeUp</title>
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
