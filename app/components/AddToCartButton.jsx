// components/AddToCartButton.jsx
import {CartForm} from '@shopify/hydrogen';
import {useEffect, useRef} from 'react';

export function AddToCartButton({
  lines,
  children,
  className,
  disabled = false,
  onSuccess,
  goToCheckout,
}) {
  const safeLines = Array.isArray(lines) ? lines.filter(Boolean) : [];
  const isInvalid = !safeLines.length || safeLines.some(l => !l?.merchandiseId);

  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesAdd}
      inputs={{lines: safeLines}}
    >
      {(fetcher) => (
        <AddToCartWatcher
          fetcher={fetcher}
          disabled={disabled || isInvalid}
          className={className}
          onSuccess={onSuccess}
          goToCheckout={goToCheckout}
        >
          {children}
        </AddToCartWatcher>
      )}
    </CartForm>
  );
}

function AddToCartWatcher({
  fetcher,
  children,
  className,
  disabled,
  onSuccess,
  goToCheckout,
}) {
  const isSubmitting = fetcher.state !== 'idle';
  const prevStateRef = useRef('idle');
  const hasCalledSuccessRef = useRef(false);

  useEffect(() => {
    const currentState = fetcher.state;
    const data = fetcher.data;
    
    // Only trigger success callback once per submission
    // When state transitions from 'submitting' or 'loading' to 'idle'
    if (
      prevStateRef.current !== 'idle' && 
      currentState === 'idle' && 
      data && 
      !hasCalledSuccessRef.current
    ) {
      const hasCart = data?.cart || data?.cartId;
      
      if (hasCart) {
        hasCalledSuccessRef.current = true;
        
        if (goToCheckout && data?.cart?.checkoutUrl) {
          window.location.assign(data.cart.checkoutUrl);
        } else if (onSuccess) {
          onSuccess();
        }
        
        // Reset after animation time
        setTimeout(() => {
          hasCalledSuccessRef.current = false;
        }, 1000);
      }
    }
    
    prevStateRef.current = currentState;
  }, [fetcher.state, fetcher.data, goToCheckout, onSuccess]);

  return (
    <button
      type="submit"
      className={className}
      disabled={disabled || isSubmitting}
      aria-busy={isSubmitting || undefined}
    >
      {children}
    </button>
  );
}