import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';
import {getProductBadges} from '~/utils';

/**
 * @param {{
 *   product:
 *     | CollectionItemFragment
 *     | ProductItemFragment
 *     | RecommendedProductFragment;
 *   loading?: 'eager' | 'lazy';
 * }}
 */
export function ProductItem({product, loading}) {
  const variantUrl = useVariantUrl(product.handle);
  const image = product.featuredImage;
  const badges = getProductBadges(product);
  return (
    <Link
      className="product-item"
      key={product.id}
      prefetch="intent"
      to={variantUrl}
    >
      {image && (
        <Image
          alt={image.altText || product.title}
          aspectRatio="1/1"
          data={image}
          loading={loading}
          sizes="(max-width: 699px) calc(100vw / 2), (max-width: 999px) calc(100vw / 0 - 64px), calc((100vw - 96px) / 3 - (24px / 3 * 2))"
        />
      )}
      <h4>{product.title}</h4>
      <small>
        <Money data={product.priceRange.minVariantPrice} />
      </small>
      <div className="product-item-badges">
                    {badges.map((b) => (
                      <span
                        key={`badge-${b.text}`}
                        className="product-item-badge"
                        style={{backgroundColor: b.background, color: b.textColor}}
                      >
                        {b.text}
                      </span>
                    ))}
                  </div>
                  <button className="card-product-wishlist-button" data-product-id={product.handle}>
                    <div className="wishlist-icon-svg">
                      <svg id="wishlist-icon" className="wishlist-icon-svg" width="24" height="24" viewBox="0 0 24 24" fill="transparent" xmlns="http://www.w3.org/2000/svg" strokeWidth="1" stroke="#000">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.73 2 12.27 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.77-3.4 7.23-8.55 11.53L12 21.35z"></path>
                      </svg>
                    </div>
                  </button>
    </Link>
  );
}

/** @typedef {import('storefrontapi.generated').ProductItemFragment} ProductItemFragment */
/** @typedef {import('storefrontapi.generated').CollectionItemFragment} CollectionItemFragment */
/** @typedef {import('storefrontapi.generated').RecommendedProductFragment} RecommendedProductFragment */
