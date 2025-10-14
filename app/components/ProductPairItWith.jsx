import {Image} from '@shopify/hydrogen';
import {Link} from 'react-router';
import {getProductBadges} from '../utils';

export function ProductPairItWith({product}) {
  // Early return if no metafields
  if (!product?.metafields) {
    return null;
  }

  // Filter out null values and find the metafield
  const mf = product.metafields
    .filter(Boolean)
    .find((m) => m?.key === 'style_with_product');
  
  // Early return if metafield not found
  if (!mf) {
    return null;
  }
  
  const items = mf?.references?.nodes || [];
  
  // Early return if no items
  if (!items.length) {
    return null;
  }

  const badges = getProductBadges(product);

  return (
    <section className="product-pair" id="style_with">
      <h2>Pair it With</h2>
      <div className="product-pair-grid">
        {items.map((p, i) => {
          const img = p?.images?.nodes?.[0];
          return (
            <Link
              key={p.id}
              to={`/products/${p.handle}`}
              className="product-item"
            >
              {img ? (
                <Image
                  className="product-card__image product-card__image--secondary"
                  data={img}
                  alt={p.title}
                  loading={i < 8 ? 'eager' : 'lazy'}
                  sizes="(max-width: 699px) 74vw, (max-width: 999px) 38vw, calc((100vw - 96px) / 3 - (24px / 3 * 2))"
                />
              ) : (
                <div className="placeholder" />
              )}
              <h4>{p.title}</h4>
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
              <button
                className="card-product-wishlist-button"
                data-product-id={product.handle}
              >
                <div className="wishlist-icon-svg">
                  <svg
                    id="wishlist-icon"
                    className="wishlist-icon-svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="transparent"
                    xmlns="http://www.w3.org/2000/svg"
                    strokeWidth="1"
                    stroke="#000"
                  >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.73 2 12.27 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.77-3.4 7.23-8.55 11.53L12 21.35z"></path>
                  </svg>
                </div>
              </button>
            </Link>
          );
        })}
      </div>
    </section>
  );
}