import { Suspense } from 'react';
import { NavLink, useAsyncValue, Await } from 'react-router';
import { useOptimisticCart } from '@shopify/hydrogen';
import { useAside } from '~/components/Aside';

/**
 * @param {HeaderProps}
 */
export function Header({ header, cart }) {
  const { shop } = header;
  
  return (
    <header className="header">
      <div className="header-left">
        <HeaderMenuMobileToggle />
        <SearchToggle />
      </div>

      <div className="header-center">
        <NavLink to="/" prefetch="intent" end className="site-logo-link">
          <img
            src="https://cdn.shopify.com/s/files/1/0701/8181/4426/files/SAADAA_LOGO_96_x_17.png?v=1758179007"
            alt={shop.name}
            className="site-logo"
          />
        </NavLink>
      </div>

      <nav className="header-ctas" role="navigation">
        <CartToggle cart={cart} />
      </nav>
    </header>
  );
}

/**
 * Mobile Menu Toggle Button
 */
function HeaderMenuMobileToggle() {
  const { open } = useAside();
  
  return (
    <button
      className="header-menu-mobile-toggle reset"
      onClick={() => open('mobile')}
      aria-label="Open menu"
    >
      <svg aria-hidden="true" fill="none" focusable="false" width="22" height="22" viewBox="0 0 22 22">
        <path d="M1 19h20M1 12h20M1 5h20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
      </svg>
    </button>
  );
}

/**
 * Search Toggle Button
 */
function SearchToggle() {
  const { open } = useAside();
  
  return (
    <button 
      className="reset search-toggle" 
      onClick={() => open('search')}
      aria-label="Open search"
    >
      <svg aria-hidden="true" fill="none" focusable="false" width="22" height="22" viewBox="0 0 22 22">
        <path d="M10.364 3a7.364 7.364 0 1 0 0 14.727 7.364 7.364 0 0 0 0-14.727Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" />
        <path d="M15.857 15.858 21 21.001" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" />
      </svg>
    </button>
  );
}

/**
 * Cart Badge Component
 * @param {{count: number | null}}
 */
function CartBadge({ count }) {
  const { open } = useAside();

  return (
    <button
      className="reset cart-toggle"
      onClick={() => open('cart')}
      aria-label={`Open cart with ${count || 0} items`}
    >
      <svg aria-hidden="true" fill="none" focusable="false" width="22" height="22" viewBox="0 0 22 22" className="icon icon-cart">
        <path d="M4.75 8.25A.75.75 0 0 0 4 9L3 19.125c0 1.418 1.207 2.625 2.625 2.625h12.75c1.418 0 2.625-1.149 2.625-2.566L20 9a.75.75 0 0 0-.75-.75H4.75Zm2.75 0v-1.5a4.5 4.5 0 0 1 4.5-4.5v0a4.5 4.5 0 0 1 4.5 4.5v1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {count !== null && (
        <span className="cart-badge">{count}</span>
      )}
    </button>
  );
}

/**
 * Cart Toggle with Suspense
 * @param {Pick<HeaderProps, 'cart'>}
 */
function CartToggle({ cart }) {
  return (
    <Suspense fallback={<CartBadge count={null} />}>
      <Await resolve={cart}>
        <CartBanner />
      </Await>
    </Suspense>
  );
}

/**
 * Cart Banner with Optimistic Updates
 */
function CartBanner() {
  const originalCart = useAsyncValue();
  const cart = useOptimisticCart(originalCart);
  return <CartBadge count={cart?.totalQuantity ?? 0} />;
}

/**
 * @typedef {Object} HeaderProps
 * @property {HeaderQuery} header
 * @property {Promise<CartApiQueryFragment|null>} cart
 * @property {Promise<boolean>} isLoggedIn
 * @property {string} publicStoreDomain
 */

/** @typedef {import('storefrontapi.generated').HeaderQuery} HeaderQuery */
/** @typedef {import('storefrontapi.generated').CartApiQueryFragment} CartApiQueryFragment */