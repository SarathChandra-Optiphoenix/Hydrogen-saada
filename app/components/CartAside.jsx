import {Suspense, useEffect, useMemo, useRef} from 'react';
import {Await} from 'react-router';
import {Aside, useAside} from '~/components/Aside';
import {CartMain} from '~/components/CartMain';
import {gaEvent, toGAItemsFromCartLines} from '~/utils/ga';

export function CartAside({cart}) {
  const {type: activeType} = useAside();
  const expanded = activeType === 'cart';

  return (
    <Aside type="cart" heading={<CartHeading cart={cart} />} openFrom="right">
      <Suspense fallback={<CartLoader />}>
        <Await resolve={cart}>
          {(resolvedCart) => (
            <>
              <CartGAEffect expanded={expanded} cart={resolvedCart} />
              <CartMain cart={resolvedCart} layout="aside" />
            </>
          )}
        </Await>
      </Suspense>
    </Aside>
  );
}

function CartGAEffect({expanded, cart}) {
  const firedRef = useRef(false);

  const items = useMemo(
    () => toGAItemsFromCartLines(cart?.lines?.nodes || []),
    [cart],
  );
  const value = useMemo(
    () =>
      items.reduce(
        (sum, i) => sum + Number(i.price || 0) * Number(i.quantity || 1),
        0,
      ),
    [items],
  );

  useEffect(() => {
    const hasItems = items.length > 0;
    if (!expanded || !hasItems) {
      firedRef.current = false;
      return;
    }
    if (!firedRef.current) {
      gaEvent('view_cart', {
        currency:
          items[0]?.currency ||
          cart?.cost?.subtotalAmount?.currencyCode ||
          'INR',
        value,
        items,
      });
      firedRef.current = true;
    }
  }, [expanded, items, value, cart]);

  return null;
}

function CartLoader() {
  return (
    <div className="cart-loader-overlay">
      <div className="cart-loader-spinner">
        <svg
          className="spinner-icon"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" opacity="0.25" />
          <path d="M12 2a10 10 0 0 1 10 10" />
        </svg>
      </div>
    </div>
  );
}

function CartHeading({cart}) {
  const {close} = useAside();
  const handleCloseClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    close();
  };

  return (
    <Suspense fallback={<span>Your Cart</span>}>
      <Await resolve={cart}>
        {(resolvedCart) => {
          const count = resolvedCart?.totalQuantity ?? 0;
          return (
            <>
              <span className="cart-heading">
                Your Cart{' '}
                <span className="cart-heading__count">
                  ({count} {count === 1 ? 'item' : 'items'})
                </span>
              </span>
              <button
                type="button"
                className="close reset"
                onClick={handleCloseClick}
                aria-label="Close cart"
                style={{
                  marginLeft: 'auto',
                  cursor: 'pointer',
                  zIndex: 100,
                  position: 'relative',
                }}
              >
                <svg
                  aria-hidden="true"
                  focusable="false"
                  fill="none"
                  width="18"
                  height="18"
                  className="icon icon-close"
                  viewBox="0 0 18 18"
                >
                  <path
                    d="M2 2 L16 16 M2 16 L16 2"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </>
          );
        }}
      </Await>
    </Suspense>
  );
}
