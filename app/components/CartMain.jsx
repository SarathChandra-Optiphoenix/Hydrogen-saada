import {useOptimisticCart, Money} from '@shopify/hydrogen';
import {Link} from 'react-router';
import {CartLineItem} from '~/components/CartLineItem';
import {CartSummary} from './CartSummary';
import {useAside} from '~/components/Aside';
import {gaEvent, toGAItem} from '~/utils/ga';

export function CartMain({layout, cart: originalCart}) {
  const cart = useOptimisticCart(originalCart);
  const {close} = useAside();

  const cartHasItems = Boolean(cart?.totalQuantity && cart.totalQuantity > 0);
  const subtotal = cart?.cost?.subtotalAmount;

  function handleBeginCheckout() {
    if (!cart?.checkoutUrl) return;

    const items = (cart?.lines?.nodes || [])
      .map((l) =>
        toGAItem(
          l?.merchandise?.product,
          {
            ...l?.merchandise,
            price: l?.merchandise?.price,
            title: l?.merchandise?.title,
          },
          l?.quantity || 1,
        ),
      )
      .filter(Boolean);

    const value = items.reduce(
      (sum, i) => sum + Number(i.price || 0) * Number(i.quantity || 1),
      0,
    );
    const currency =
      items[0]?.currency ||
      cart?.cost?.subtotalAmount?.currencyCode ||
      'INR';

    gaEvent('begin_checkout', {currency, value, items});

    try {
      close?.();
    } catch (e){console.warn(e)}

    setTimeout(() => {
      window.location.assign(cart.checkoutUrl);
    }, 0);
  }

  return (
    <div className="cart-shell">
      <div className="cart-announcement">
        <span>5,00,000+ Happy Customers❤️</span>
      </div>

      {!cartHasItems ? (
        <EmptyState onClick={() => close()} />
      ) : (
        <>
          <div className="cart-lines-wrap" aria-labelledby="cart-lines">
            <ul className="cart-lines">
              {(cart?.lines?.nodes ?? []).map((line) => (
                <CartLineItem key={line.id} line={line} layout={layout} />
              ))}
            </ul>
          </div>

          <p className="cart-promo-copy">Apply Promo at Checkout!!</p>

          <CompleteYourLook />

          <div className="sr-only">
            <CartSummary cart={cart} layout={layout} />
          </div>

          <StickyCheckoutBar
            checkoutUrl={cart?.checkoutUrl}
            subtotal={subtotal}
            onCheckout={handleBeginCheckout}
          />
        </>
      )}
    </div>
  );
}

function EmptyState({onClick}) {
  return (
    <div className="cart-empty">
      <h4 className="cart-empty-title">You Cart is empty!</h4>
      <Link
        to="/collections/best-sellers"
        prefetch="viewport"
        className="btn-primary-xl"
        onClick={onClick}
      >
        Continue Shopping
      </Link>
    </div>
  );
}

function CompleteYourLook() {
  const items = [
    {
      id: 'upsell-1',
      title: 'Women White Cotton Pant',
      price: '₹799.00',
      image:
        'https://cdn.shopify.com/s/files/1/0450/3476/6485/files/white-pant.jpg?v=1',
    },
    {
      id: 'upsell-2',
      title: 'Women Beige Cotton Pant',
      price: '₹799.00',
      image:
        'https://cdn.shopify.com/s/files/1/0450/3476/6485/files/beige-pant.jpg?v=1',
    },
  ];

  return (
    <section className="upsell">
      <h5 className="upsell-title">Complete Your Look</h5>
      <div className="upsell-row">
        {items.map((it) => (
          <article className="upsell-card" key={it.id}>
            <img src={it.image} alt={it.title} loading="lazy" />
            <div className="upsell-meta">
              <p className="upsell-name">{it.title}</p>
              <p className="upsell-price">{it.price}</p>
              <button className="upsell-add" type="button">
                + Add
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function StickyCheckoutBar({checkoutUrl, subtotal, onCheckout}) {
  if (!checkoutUrl) return null;
  return (
    <div className="sticky-cta" role="region" aria-label="Cart totals and checkout">
      <div className="sticky-cta__left">
        <span className="sticky-cta__label">Estimated Total</span>
        <strong className="sticky-cta__amount">
          {subtotal?.amount ? <Money data={subtotal} /> : '—'}
        </strong>
      </div>

      <a
        href={checkoutUrl}
        className="sticky-cta__btn"
        target="_self"
        rel="nofollow"
        onClick={(e) => {
          e.preventDefault();
          onCheckout?.();
        }}
      >
        <button type="button">Place Order</button>
        <small className="sticky-cta__sub">Get Extra discount on UPI orders</small>
      </a>

      <div className="sticky-cta__payments" aria-hidden="true">
        <span className="pay-icon" title="UPI" />
        <span className="pay-icon" title="Cards" />
        <span className="pay-icon" title="Wallets" />
      </div>
    </div>
  );
}