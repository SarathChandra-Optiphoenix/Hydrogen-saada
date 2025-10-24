// app/root.jsx
import {Analytics, getShopAnalytics, useNonce, Script} from '@shopify/hydrogen';
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

// styles
import resetStyles from '~/styles/reset.css?url';
import appStyles from '~/styles/app.css?url';
import homeStyles from '~/styles/Home.css?url';
import productStyles from '~/styles/product.css?url';
import tailwindCss from './styles/tailwind.css?url';

// layout
import {PageLayout} from './components/PageLayout';

// ---- GA CONFIG ----
const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-ZJ75SWX3K7';
// IMPORTANT: compute once, same on SSR/CSR (no window checks)
const GA_ENABLED = Boolean(GA_ID);

// ---- Remix/Hydrogen hooks ----
export const shouldRevalidate = ({formMethod, currentUrl, nextUrl}) => {
  if (formMethod && formMethod !== 'GET') return true;
  if (currentUrl.toString() === nextUrl.toString()) return true;
  return false;
};

export function links() {
  return [
    {rel: 'preconnect', href: 'https://cdn.shopify.com'},
    {rel: 'preconnect', href: 'https://shop.app'},
    {
      rel: 'preconnect',
      href: 'https://cdn-4.convertexperiments.com',
      crossOrigin: 'anonymous',
    },
    {rel: 'dns-prefetch', href: 'https://cdn-4.convertexperiments.com'},
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
      checkoutDomain: env.PUBLIC_CHECKOUT_DOMAIN, // set to checkout.shopify.com in Oxygen
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
  const nonce = useNonce(); // Hydrogen provides this (works in dev & prod)

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />

        {/* styles */}
        <link rel="stylesheet" href={tailwindCss} />
        <link rel="stylesheet" href={resetStyles} />
        <link rel="stylesheet" href={appStyles} />
        <link rel="stylesheet" href={homeStyles} />
        <link rel="stylesheet" href={productStyles} />

        <Meta />
        <Links />

        {/* ---------- GA (SSR/CSR identical) ---------- */}
        {GA_ENABLED && (
          <>
            <Script
              id="ga-src"
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            />
            <Script
              id="ga-init"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GA_ID}', {
                    send_page_view: false,
                    linker: { domains: ['saadaa.in','saadaa.myshopify.com'] }
                  });
                `,
              }}
            />
          </>
        )}

        {/* ---------- Convert (SSR/CSR identical) ---------- */}
        <Script
          id="convert-vars"
          // if SSR ever emits trimmed whitespace, this silences hydration nitpicks
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `
              var _conv_page_type = "";
              var _conv_category_id = "";
              var _conv_category_name = "";
              var _conv_product_sku = "";
              var _conv_product_name = "";
              var _conv_product_price = "";
              var _conv_customer_id = "";
              var _conv_custom_v1 = "";
              var _conv_custom_v2 = "";
              var _conv_custom_v3 = "";
              var _conv_custom_v4 = "";
            `,
          }}
        />
        <Script
          id="convert-src"
          defer
          src="https://cdn-4.convertexperiments.com/v1/js/1002628-10025677.js?environment=production"
        />
      </head>

      <body>
        {children}
        {/* keep nonce pass-through; harmless in dev, required in prod */}
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}

export default function App() {
  const data = useRouteLoaderData('root');
  const location = useLocation();

  // Defer GA page_view to idle; runs both in dev & prod identically
  useEffect(() => {
    if (typeof window === 'undefined' || !window.gtag || !GA_ID) return;
    const fire = () => {
      window.gtag('event', 'page_view', {
        page_location: window.location.href,
        page_path: location.pathname + location.search,
        page_title: document.title,
      });
    };
    if ('requestIdleCallback' in window) {
      requestIdleCallback(fire, {timeout: 1000});
    } else {
      setTimeout(fire, 0);
    }
  }, [location]);

  if (!data) return <Outlet />;

  return (
    <Analytics.Provider cart={data.cart} shop={data.shop} consent={data.consent}>
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