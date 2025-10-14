// components/ProductColorSwatches.jsx
import {Link} from 'react-router';
import {getSwatchStyle, isLightColor} from '../utils/ColorSwatchConfig';

export function ProductColorSwatches({product, colorVariants, currentColor}) {
  if (!colorVariants || colorVariants.length === 0) {
    return null;
  }

  return (
    <div className="product-option-group">
      <div className="product-option-row">
        <div className="product-option-label">COLOR:
          
        <span>{currentColor}</span> </div>
      </div>
      <div className="product-color-swatches">
        {colorVariants.map((colorProduct) => {
          const isSelected = colorProduct.handle === product.handle;
          const productColor = extractColorFromTitle(colorProduct.title);
          const hasNewTag = colorProduct.tags?.includes('new_color');
          const needsBorder = isLightColor(productColor);
          const swatchStyle = getSwatchStyle(productColor);

          return (
            <div key={colorProduct.id} className="product-color-swatch-wrapper">
              <Link
                to={`/products/${colorProduct.handle}`}
                prefetch="intent"
                className={`product-color-swatch ${
                  isSelected ? 'product-color-swatch--selected' : ''
                } ${needsBorder ? 'product-color-swatch--light-border' : ''}`}
                title={productColor}
              >
                <span className="product-color-swatch-circle" style={swatchStyle} />
              </Link>
              {hasNewTag && <span className="product-color-new-badge">New</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function extractColorFromTitle(title) {
  const colorMatch = title.match(
    /Women\s+([\w\s]+?)\s+(?:Pure\s+Linen|Airy\s+Linen|100%|Short|Long)/i,
  );
  return colorMatch ? colorMatch[1].trim() : '';
}