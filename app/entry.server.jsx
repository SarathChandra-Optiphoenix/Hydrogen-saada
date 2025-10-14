import {ServerRouter} from 'react-router';
import {isbot} from 'isbot';
import {renderToReadableStream} from 'react-dom/server';
import {createContentSecurityPolicy} from '@shopify/hydrogen';

export default async function handleRequest(
  request,
  statusCode,
  responseHeaders,
  reactRouterContext,
  context,
) {
  const isDev = new URL(request.url).hostname === 'localhost';

  let nonce, header, NonceProvider = ({children}) => <>{children}</>;

  if (!isDev) {
    const csp = createContentSecurityPolicy({
      shop: {
        checkoutDomain: context.env.PUBLIC_CHECKOUT_DOMAIN,
        storeDomain: context.env.PUBLIC_STORE_DOMAIN,
      },
      // add GA + Shopify script and GA collect endpoints (see §2)
      connectSrc: [
        'https://www.google-analytics.com',
        'https://analytics.google.com',
        'https://region1.google-analytics.com',
        'https://cdn.shopify.com',
      ],
      scriptSrcElem: [
        'https://www.googletagmanager.com',
        'https://www.google-analytics.com',
        'https://cdn.shopify.com',
      ],
      imgSrc: [
        'data:',
        'https://cdn.shopify.com',
        'https://images.loox.io',
        'https://d1pv5xkwefoylp.cloudfront.net',
      ],
    });
    nonce = csp.nonce;
    header = csp.header;
    NonceProvider = csp.NonceProvider;
  }

  const body = await renderToReadableStream(
    <NonceProvider>
      <ServerRouter context={reactRouterContext} url={request.url} nonce={nonce} />
    </NonceProvider>,
    {
      nonce,
      signal: request.signal,
      onError(err) {
        console.error(err);
        statusCode = 500;
      },
    },
  );

  if (isbot(request.headers.get('user-agent'))) {
    await body.allReady;
  }

  responseHeaders.set('Content-Type', 'text/html');
  if (header) responseHeaders.set('Content-Security-Policy', header); // prod only

  return new Response(body, {headers: responseHeaders, status: statusCode});
}
