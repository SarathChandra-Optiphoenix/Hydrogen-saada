import {AddToCartButton} from './AddToCartButton';
import {useAside} from './Aside';
import {useRef} from 'react';
import {gaEvent, toGAItem} from '../utils/ga';

export function ProductButtons({
  variant,
  quantity = 1,
  sellingPlanId = undefined,
  onAddToCartTracked, // optional callback from PDP route
}) {
  const {open, type} = useAside();
  const lastAddTimeRef = useRef(0);

  const variantId = variant?.id || '';
  const available = Boolean(variant?.availableForSale);
  const canAdd = Boolean(variantId) && available && quantity > 0;

  const handleAddSuccess = () => {
    // fire GA either via parent handler or local
    try {
      if (typeof onAddToCartTracked === 'function') {
        onAddToCartTracked(variant, quantity);
      } else {
        const item = toGAItem(variant?.product || {}, variant, quantity);
        if (item) {
          gaEvent('add_to_cart', {
            currency: item.currency || 'INR',
            value: item.price * item.quantity,
            items: [item],
          });
        }
      }
    } catch (e) {
      console.warn('GA add_to_cart failed', e);
    }

    const now = Date.now();
    if (type !== 'cart' && now - lastAddTimeRef.current > 500) {
      lastAddTimeRef.current = now;
      setTimeout(() => open('cart'), 150);
    }
  };

  return (
    <div className="product-buttons">
      <AddToCartButton
        disabled={!canAdd}
        lines={[
          {
            merchandiseId: variantId,
            quantity: Number(quantity) || 1,
            ...(sellingPlanId ? {sellingPlanId} : {}),
          },
        ]}
        onSuccess={handleAddSuccess}
        className="btn btn-primary product-atc-btn"
      >
        <span className="bag-icon">
          <svg
            width="22"
            height="22"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
          >
            <path d="M4.75 8.25A.75.75 0 0 0 4 9L3 19.125c0 1.418 1.207 2.625 2.625 2.625h12.75c1.418 0 2.625-1.149 2.625-2.566L20 9a.75.75 0 0 0-.75-.75H4.75Zm2.75 0v-1.5a4.5 4.5 0 0 1 4.5-4.5v0a4.5 4.5 0 0 1 4.5 4.5v1.5"></path>
          </svg>
        </span>
        {canAdd ? 'ADD TO BAG' : available ? 'Select an option' : 'Sold Out'}
      </AddToCartButton>
    </div>
  );
}
