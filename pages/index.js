import Head from 'next/head'
import styles from '../styles/Home.module.css'
// import styles from '@/styles/Home.module.css'
import Homepage from './homepage'
import Layout from '../components/Layout'


export default function Home() {
  return (
    <>
      <Head>
        <title>Online Coding Web App</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
        <Homepage />
    </>
  )
}
