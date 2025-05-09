import { useEffect } from 'react';
import Head from 'next/head';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/basic.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faShoppingCart, faUser, faClipboardList, faSearch, faPlus, faMinus, faTrash } from '@fortawesome/free-solid-svg-icons';

// Add FontAwesome icons to library
library.add(faShoppingCart, faUser, faClipboardList, faSearch, faPlus, faMinus, faTrash);

function MyApp({ Component, pageProps }) {
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
