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
  let nonce,
    NonceProvider = ({children}) => <>{children}</>;
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
      <ServerRouter
        context={reactRouterContext}
        url={request.url}
        nonce={nonce}
      />
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
    
      // Scripts: GA + Shopify + Convert CDN
      `script-src 'self' 'nonce-${nonce}' https://www.googletagmanager.com https://www.google-analytics.com https://cdn.shopify.com https://cdn-4.convertexperiments.com`,
    
      // Some browsers still split this
      `script-src-elem 'self' 'nonce-${nonce}' https://www.googletagmanager.com https://www.google-analytics.com https://cdn.shopify.com https://cdn-4.convertexperiments.com`,
    
      // Styles
      `style-src 'self' 'unsafe-inline' https://cdn.shopify.com`,
    
      // Fonts
      `font-src 'self' data: https://cdn.shopify.com`,
    
      // Images (Shopify/CF/Loox + GA/Ads pixels)
      `img-src 'self' data: blob: https://cdn.shopify.com https://*.cloudfront.net https://d1pv5xkwefoylp.cloudfront.net https://images.loox.io https://www.google.com https://www.googleadservices.com https://stats.g.doubleclick.net`,
    
      // 🚀 THIS IS THE FIX — allow all Convert network calls
      `connect-src 'self'
        https://cdn.shopify.com
        https://monorail-edge.shopifysvc.com
        https://www.google-analytics.com
        https://analytics.google.com
        https://region1.google-analytics.com
        https://stats.g.doubleclick.net
        https://cdn-4.convertexperiments.com
        https://api-v1.convertexperiments.com
        https://metrics.convertexperiments.com
        https://signals.convertexperiments.com
        https://logs.convertexperiments.com`,
    
      // Optional: Convert visual editor/iframes
      `frame-src 'self' https://*.convertexperiments.com`,
    ];
    
    responseHeaders.set('Content-Security-Policy', cspDirectives.join('; '));
  }

  return new Response(body, {headers: responseHeaders, status: statusCode});
}
