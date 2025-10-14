export function ProductAccordions({selectedCollection}) {
    // Guard: no collection → nothing to render
    const raw = selectedCollection?.metafields ?? [];
    // Some APIs return [null,null,...] – sanitize:
    const metafields = raw.filter(Boolean);
  
    if (!metafields.length) return null;
  
    // Safe find
    const free = metafields.find(m => m.key === 'free_shipping_text');
    const exchange = metafields.find(m => m.key === 'exchange_return_text');
  
    // If neither exists, bail
    if (!free && !exchange) return null;
  
    return (
      <section className="product-accordions">
        {free && (
          <details className="product-accordion" open>
            <summary>
              Free Shipping
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </summary>
            <div className="product-accordion-content">{free.value}</div>
          </details>
        )}
  
        {exchange && (
          <details className="product-accordion">
            <summary>
              7 Days Returns & Exchange
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </summary>
            <div className="product-accordion-content">{exchange.value}</div>
          </details>
        )}
      </section>
    );
  }