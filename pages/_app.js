import Router from "next/router";
import { useEffect , useState} from 'react';
import Layout from '../components/Layout'
import Loading from '../components/Loading';
import '../styles/Home.module.css';

export default function App({ Component, pageProps }) {
  const [loading, setLoading] = useState(false);
  
  //effect resposible for displaying the spiining js logo with every rerouting in the app
  useEffect(() => {
      const start = () => {
          setLoading(true);
      };
      const end = () => {
          setLoading(false);
      };
    Router.events.on("routeChangeStart", start);
    Router.events.on("routeChangeComplete", end);
    Router.events.on("routeChangeError", end);
    return () => {
        Router.events.off("routeChangeStart", start);
        Router.events.off("routeChangeComplete", end);
        Router.events.off("routeChangeError", end);
    };
  }, []);


  return(
      <Layout>
      {loading ? <Loading/> : <Component {...pageProps} />    }
      </Layout>
  )
}
