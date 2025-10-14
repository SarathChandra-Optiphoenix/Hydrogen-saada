// CartAside.jsx
import {Suspense, useEffect, useMemo, useRef} from 'react';
import {Await} from 'react-router';
import {Aside, useAside} from '~/components/Aside';
import {CartMain} from '~/components/CartMain';
import {gaEvent, toGAItem} from '~/utils/ga'; // 👈 add this

/**
 * Cart Aside Component (Slides from RIGHT)
 */
export function CartAside({cart}) {
  const {type: activeType} = useAside();
  const expanded = activeType === 'cart';

  return (
    <Aside type="cart" heading={<CartHeading cart={cart} />} openFrom="right">
      <Suspense fallback={<CartLoader />}>
        <Await resolve={cart}>
          {(resolvedCart) => (
            <>
              {/* GA view_cart effect lives here */}
              <CartGAEffect expanded={expanded} cart={resolvedCart} />
              <CartMain cart={resolvedCart} layout="aside" />
            </>
          )}
        </Await>
      </Suspense>
    </Aside>
  );
}

/* === GA EFFECT: fire view_cart when drawer opens with items === */
function CartGAEffect({expanded, cart}) {
  const firedRef = useRef(false);

  // build items payload once per cart snapshot
  const items = useMemo(() => {
    const lines = cart?.lines?.nodes || [];
    return lines.map((l) =>
      toGAItem(
        l?.merchandise?.product,
        {
          ...l?.merchandise,
          price: l?.merchandise?.price, // Hydrogen price object
          title: l?.merchandise?.title,
        },
        l?.quantity || 1,
      ),
    ).filter(Boolean);
  }, [cart]);

  const value = useMemo(
    () => items.reduce((sum, i) => sum + Number(i.price || 0) * Number(i.quantity || 1), 0),
    [items],
  );

  useEffect(() => {
    const hasItems = items.length > 0;
    if (!expanded || !hasItems) {
      // reset the gate when closed or empty
      firedRef.current = false;
      return;
    }
    // fire once per open state (prevents double fire on minor state churn)
    if (!firedRef.current) {
      gaEvent('view_cart', {
        currency: items[0]?.currency || cart?.cost?.subtotalAmount?.currencyCode || 'INR',
        value,
        items,
      });
      firedRef.current = true;
    }
  }, [expanded, items, value, cart]);

  return null;
}

/* Centered Loader */
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

/* Heading component rendered INSIDE the Aside <header> */
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