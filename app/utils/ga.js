/**
 * Send a Google Analytics 4 event
 */
export function gaEvent(name, params = {}) {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', name, params);
    }
  }
  
  /**
   * Transform a Shopify product + variant into a GA4 "item" object
   * https://developers.google.com/analytics/devguides/collection/ga4/reference/events
   */
  export function toGAItem(product, variant, quantity = 1) {
    if (!product) return null;
  
    return {
      item_id: product.id || variant?.id || '',          // unique ID (Shopify GID)
      item_name: product.title || variant?.title || '',  // readable name
      item_brand: product.vendor || 'SAADAA',            // brand
      item_category: product.productType || 'Apparel',   // category/type
      item_variant: variant?.title || '',                // variant title
      price: Number(
        variant?.price?.amount ??
        product.priceRange?.minVariantPrice?.amount ??
        0
      ),
      currency: (
        variant?.price?.currencyCode ??
        product.priceRange?.minVariantPrice?.currencyCode ??
        'INR'
      ),
      quantity,
    };
  }