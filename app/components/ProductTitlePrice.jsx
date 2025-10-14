
import {useMemo} from 'react';
import {Money} from '@shopify/hydrogen';

export function ProductTitlePrice({product, variant}) {
  const {price, compareAt, saveRupees} = useMemo(() => {
    const tags = new Set(product?.tags || []);
    // Liquid-equivalent overrides
    const override =
      (tags.has('SMLFS') && {price: 199900, compare: 249900}) ||
      (tags.has('SDLNS') && {price: 169900, compare: 219900}) ||
      (tags.has('SDLS') && {price: 199900, compare: 249900}) ||
      (tags.has('SMLSS') && {price: 169900, compare: 219900}) ||
      null;

    const basePrice = override
      ? {amount: (override.price / 100).toFixed(2), currencyCode: variant?.price?.currencyCode || 'INR'}
      : variant?.price;

    const baseCompare = override
      ? {amount: (override.compare / 100).toFixed(2), currencyCode: variant?.price?.currencyCode || 'INR'}
      : variant?.compareAtPrice;

    const p = Number(basePrice?.amount || 0);
    const c = Number(baseCompare?.amount || 0);
    const diff = c > p ? Math.round(c - p) : 0;

    return {price: basePrice, compareAt: baseCompare, saveRupees: diff};
  }, [product?.tags, variant?.price, variant?.compareAtPrice]);

  const discountPercentage = saveRupees > 0 
  ? Math.round((saveRupees / parseFloat(compareAt.amount)) * 100) 
  : 0;

  

  return (
    <div>
      <h1 className="product-title">{product.title}</h1>

      <div className="product-price-wrap">
      <span className="product-price">
           <Money data={price} withoutTrailingZeros  />
        </span>
        {saveRupees > 0 && (
          <span id="compare-at-price" className="product-compare-price">
            <p>MRP</p>
          
            <Money data={compareAt} withoutTrailingZeros />
          </span>
        )}
        {saveRupees > 0 && (
      <div className="product-save">
       {discountPercentage}% OFF
      </div>
    )}
      </div>

      
    </div>
  );
}