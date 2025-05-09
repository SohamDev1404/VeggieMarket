import { useEffect } from 'react';
import Head from 'next/head';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/basic.css';

function MyApp({ Component, pageProps }) {
  // Initialize bootstrap JS on client-side
  useEffect(() => {
    typeof document !== 'undefined' && import('bootstrap/dist/js/bootstrap');
  }, []);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{`Harvest Hub | Bulk Vegetable & Fruit Orders`}</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
