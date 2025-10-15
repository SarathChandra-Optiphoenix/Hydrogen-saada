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
  const hostname = new URL(request.url).hostname;
  const isDev = hostname === 'localhost';

  // We still use Hydrogen’s nonce + provider, but we’ll build our own CSP string.
  let nonce, NonceProvider = ({children}) => <>{children}</>;
  if (!isDev) {
    const {nonce: n, NonceProvider: NP} = createContentSecurityPolicy({
      shop: {
        checkoutDomain: context.env.PUBLIC_CHECKOUT_DOMAIN,
        storeDomain: context.env.PUBLIC_STORE_DOMAIN,
      },
    });
    nonce = n;
    NonceProvider = NP;
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

  // Build ONE clean CSP for preview/prod (Incognito-friendly). No duplicates.
  if (!isDev) {
    const cspDirectives = [
      // Safe defaults
      `default-src 'self' https://cdn.shopify.com https://shopify.com`,
      `object-src 'none'`,
      `base-uri 'self'`,
      `frame-ancestors 'self'`,

      // Scripts: allow nonce’d inline + GA + Shopify CDN
      `script-src 'self' 'nonce-${nonce}' https://www.googletagmanager.com https://www.google-analytics.com https://cdn.shopify.com`,

      // Some browsers still consult script-src-elem separately
      `script-src-elem 'self' 'nonce-${nonce}' https://www.googletagmanager.com https://www.google-analytics.com https://cdn.shopify.com`,

      // Styles: external + inline (Incognito tends to require this)
      `style-src 'self' 'unsafe-inline' https://cdn.shopify.com`,

      // Fonts
      `font-src 'self' data: https://cdn.shopify.com`,

      // Images (Shopify CDN, CloudFront, Loox, data URLs, blobs)
      `img-src 'self' data: blob: https://cdn.shopify.com https://*.cloudfront.net https://d1pv5xkwefoylp.cloudfront.net https://images.loox.io`,

      // XHR/beacons for Shopify + GA (include analytics.google.com + region1)
      `connect-src 'self' https://cdn.shopify.com https://monorail-edge.shopifysvc.com https://www.google-analytics.com https://analytics.google.com https://region1.google-analytics.com`,
    ];
    responseHeaders.set('Content-Security-Policy', cspDirectives.join('; '));
  }

  return new Response(body, {headers: responseHeaders, status: statusCode});
}