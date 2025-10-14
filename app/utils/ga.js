// simple GA helpers

export function gaEvent(name, params = {}) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', name, params);
  }
}

export function toGAItem(product, variant, quantity = 1) {
  if (!product && !variant) return null;

  const price =
    Number(
      variant?.price?.amount ??
      product?.priceRange?.minVariantPrice?.amount ??
      0,
    ) || 0;

  const currency =
    variant?.price?.currencyCode ??
    product?.priceRange?.minVariantPrice?.currencyCode ??
    'INR';

  return {
    item_id: variant?.id || product?.id || '',
    item_name: variant?.title || product?.title || '',
    item_brand: product?.vendor || 'SAADAA',
    item_category: product?.productType || 'Apparel',
    item_variant: variant?.title || '',
    price,
    currency,
    quantity: Number(quantity) || 1,
  };
}

export function toGAItemsFromCartLines(lines = []) {
  return lines
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
}