import {
  Analytics,
  getProductOptions,
  useOptimisticVariant,
  getAdjacentAndFirstAvailableVariants,
} from '@shopify/hydrogen';
import {ProductBreadcrumbs} from './ProductBreadcrumbs';
import {ProductGallery} from './ProductGallery';
import {ProductTitlePrice} from './ProductTitlePrice';
import {ProductOptions} from './ProductOptions';
import {ProductButtons} from './ProductButtons';
import {ProductTrustBadges} from './ProductTrustBadges';
import {ProductHighlights} from './ProductHighlights';
import {ProductAccordions} from './ProductAccordions';
import {ProductWhyLove} from './ProductWhyLove';
import {ProductPairItWith} from './ProductPairItWith';

export function ProductMain({product, onAddToCartTracked}) {
  const selectedCollection = product?.collections?.nodes?.[0] ?? null;

  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  return (
    <div className="product-page">
      <div className="product-container">
        <div className="product-layout">
          <div>
            <ProductGallery
              images={product?.images}
              fallbackImage={selectedVariant?.image}
            />
          </div>
          <div>
            <ProductBreadcrumbs
              selectedCollection={selectedCollection}
              product={product}
            />
            <ProductTitlePrice product={product} variant={selectedVariant} />
            <div style={{marginTop: '6px', fontSize: '19px', color: '#4b5563'}}>
              Inclusive of all taxes
            </div>
            <ProductOptions
              product={product}
              productOptions={productOptions}
              variant={selectedVariant}
              sizeChartTitle="Size Chart"
            />
            <ProductButtons
              variant={selectedVariant}
              onAddToCartTracked={onAddToCartTracked}
            />
            <ProductTrustBadges />
            <ProductHighlights product={product} />
            <ProductWhyLove selectedCollection={product} />
            <ProductAccordions selectedCollection={selectedCollection} />
          </div>
        </div>
        <ProductPairItWith product={product} />
      </div>

      <Analytics.ProductView
        data={{
          products: [
            {
              id: product.id,
              title: product.title,
              price: selectedVariant?.price?.amount || '0',
              vendor: product.vendor,
              variantId: selectedVariant?.id || '',
              variantTitle: selectedVariant?.title || '',
              quantity: 1,
            },
          ],
        }}
      />
    </div>
  );
}
