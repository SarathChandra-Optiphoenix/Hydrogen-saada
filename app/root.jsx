import {Analytics, getShopAnalytics, useNonce} from '@shopify/hydrogen';
import {useEffect} from 'react';
import {useLocation} from 'react-router';
import {
  Outlet,
  useRouteError,
  isRouteErrorResponse,
  Links,
  Meta,
  Scripts,
  ScrollRestoration,
  useRouteLoaderData,
} from 'react-router';
import favicon from '~/assets/saadafavicon.ico';
import {FOOTER_QUERY, HEADER_QUERY} from '~/lib/fragments';
import resetStyles from '~/styles/reset.css?url';
import appStyles from '~/styles/app.css?url';
import homeStyles from '~/styles/Home.css?url';
import productStyles from '~/styles/product.css?url';
import tailwindCss from './styles/tailwind.css?url';
import {PageLayout} from './components/PageLayout';

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-ZJ75SWX3K7';

export const shouldRevalidate = ({formMethod, currentUrl, nextUrl}) => {
  if (formMethod && formMethod !== 'GET') return true;
  if (currentUrl.toString() === nextUrl.toString()) return true;
  return false;
};

export function links() {
  return [
    {rel: 'preconnect', href: 'https://cdn.shopify.com'},
    {rel: 'preconnect', href: 'https://shop.app'},
    {rel: 'icon', type: 'image/x-icon', href: favicon},
  ];
}

export async function loader(args) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  const {storefront, env} = args.context;

  return {
    ...deferredData,
    ...criticalData,
    publicStoreDomain: env.PUBLIC_STORE_DOMAIN,
    shop: getShopAnalytics({
      storefront,
      publicStorefrontId: env.PUBLIC_STOREFRONT_ID,
    }),
    consent: {
      checkoutDomain: env.PUBLIC_CHECKOUT_DOMAIN,
      storefrontAccessToken: env.PUBLIC_STOREFRONT_API_TOKEN,
      withPrivacyBanner: false,
      country: args.context.storefront.i18n.country,
      language: args.context.storefront.i18n.language,
    },
  };
}

async function loadCriticalData({context}) {
  const {storefront} = context;
  const [header] = await Promise.all([
    storefront.query(HEADER_QUERY, {
      cache: storefront.CacheLong(),
      variables: {headerMenuHandle: 'main-menu'},
    }),
  ]);
  return {header};
}

function loadDeferredData({context}) {
  const {storefront, customerAccount, cart} = context;
  const footer = storefront
    .query(FOOTER_QUERY, {
      cache: storefront.CacheLong(),
      variables: {footerMenuHandle: 'footer'},
    })
    .catch((e) => {
      console.error(e);
      return null;
    });
  return {cart: cart.get(), isLoggedIn: customerAccount.isLoggedIn(), footer};
}

export function Layout({children}) {
  const nonce = useNonce();

  // only inject GA on non-local
  const isLocal =
    typeof window !== 'undefined' && window.location.hostname === 'localhost';
  const GA_ENABLED = !!GA_ID && !isLocal;

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="stylesheet" href={tailwindCss} />
        <link rel="stylesheet" href={resetStyles} />
        <link rel="stylesheet" href={appStyles} />
        <link rel="stylesheet" href={homeStyles} />
        <link rel="stylesheet" href={productStyles} />
        <Meta />
        <Links />
        {GA_ID ? (
          <>
            <script
              async
              nonce={nonce}
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            />
            <script
              nonce={nonce}
              dangerouslySetInnerHTML={{
                __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', {
            send_page_view: false,
            linker: { domains: ['saadaa.in','saadaa.myshopify.com','your-oxygen-domain.shop'] }
          });
        `,
              }}
            />
          </>
        ) : null}
      </head>
      <body>
        {children}
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}

export default function App() {
  const data = useRouteLoaderData('root');
  const location = useLocation();

  useEffect(() => {
    if (typeof window === 'undefined' || !window.gtag || !GA_ID) return;
    const fire = () => {
      window.gtag('event', 'page_view', {
        page_location: window.location.href,
        page_path: location.pathname + location.search,
        page_title: document.title,
      });
    };
    if ('requestIdleCallback' in window)
      requestIdleCallback(fire, {timeout: 1000});
    else setTimeout(fire, 0);
  }, [location]);

  if (!data) return <Outlet />;

  return (
    <Analytics.Provider
      cart={data.cart}
      shop={data.shop}
      consent={data.consent}
    >
      <PageLayout {...data}>
        <Outlet />
      </PageLayout>
    </Analytics.Provider>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  let message = 'Unknown error';
  let status = 500;
  if (isRouteErrorResponse(error)) {
    message = error?.data?.message ?? error.data;
    status = error.status;
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <div className="route-error">
      <h1>Oops</h1>
      <h2>{status}</h2>
      {message && (
        <fieldset>
          <pre>{message}</pre>
        </fieldset>
      )}
    </div>
  );
}
