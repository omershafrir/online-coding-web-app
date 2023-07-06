import Layout from '../components/Layout'
import { StrictMode } from 'react';

export default function App({ Component, pageProps }) {
  return(

    <Layout>
      <Component {...pageProps} />
    </Layout>

  )
}
