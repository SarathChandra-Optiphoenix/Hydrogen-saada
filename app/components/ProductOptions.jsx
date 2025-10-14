// components/ProductOptions.jsx (unchanged, just imports the new component)
import {useState, useEffect} from 'react';
import {Link, useSearchParams} from 'react-router';
import {ProductSizeChartModal} from './ProductSizeChartModal';
import {ProductColorSwatches} from './ProductColorSwatches';

export function ProductOptions({
  productOptions = [],
  selectedVariant,
  product,
  sizeChartTitle = 'SIZE CHART',
}) {
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const options = Array.isArray(productOptions) ? productOptions : [];

  useEffect(() => {
    const hasSize = searchParams.has('Size');
    if (hasSize) {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('Size');
      setSearchParams(newParams, {replace: true});
    }
  }, []);

  const colorVariants = getColorVariantsFromCollection(product);
  const currentColor = extractColorFromTitle(product.title);

  if (!options.length && !colorVariants.length) return null;

  return (
    <div className="product-options">
      <ProductColorSwatches
        product={product}
        colorVariants={colorVariants}
        currentColor={currentColor}
      />

      {options.map((option) => {
        if (!option?.optionValues?.length) return null;

        const isSizeOption = /size|waist|bust/i.test(option.name);
        const selectedSizeFromUrl = searchParams.get(option.name);

        return (
          <div key={option.name} className="product-option-group">
            <div className="product-option-row">
              <div className="product-option-label-size">
                {option.name.toUpperCase()}
              </div>
              {isSizeOption && (
                <button
                  type="button"
                  className="product-sizechart-link"
                  onClick={() => setShowSizeChart(true)}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                  {sizeChartTitle}
                </button>
              )}
            </div>
            <div className="product-option-values">
              {option.optionValues.map((optionValue) => {
                const soldOut = !optionValue?.available;
                const isSelected = selectedSizeFromUrl === optionValue.name;
                const measurement = getMeasurementForSize(
                  optionValue.name,
                  option.name,
                );

                return (
                  <Link
                    key={optionValue.name}
                    to={`?${optionValue.variantUriQuery}`}
                    preventScrollReset
                    replace
                    className={`product-option-chip ${
                      isSelected ? 'product-option-chip--active' : ''
                    } ${soldOut ? 'product-option-chip--soldout' : ''}`}
                    aria-disabled={soldOut}
                    onClick={(e) => soldOut && e.preventDefault()}
                  >
                    <span className="product-chip-size">{optionValue.name}</span>
                    {measurement && (
                      <span className="product-chip-measurement">
                        {measurement}
                      </span>
                    )}
                    {soldOut && <span className="product-chip-strikethrough" />}
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
      <ProductSizeChartModal
        open={showSizeChart}
        onClose={() => setShowSizeChart(false)}
        title={product?.title}
        productOptions={productOptions}
        selectedVariant={selectedVariant}
      />
    </div>
  );
}

function getMeasurementForSize(sizeName, optionName) {
  const waistMeasurements = {
    XS: '28" - 30"',
    S: '31" - 32"',
    M: '33" - 34"',
    L: '35" - 36"',
    XL: '37" - 38"',
    '2XL': '39" - 41"',
    '3XL': '42" - 44"',
    '4XL': '45" - 47"',
  };

  if (/waist|pant|jean|top|bust/i.test(optionName)) {
    return waistMeasurements[sizeName] || null;
  }

  return waistMeasurements[sizeName] || null;
}

function extractColorFromTitle(title) {
  const colorMatch = title.match(
    /Women\s+([\w\s]+?)\s+(?:Pure\s+Linen|Airy\s+Linen|100%|Short|Long)/i,
  );
  return colorMatch ? colorMatch[1].trim() : '';
}

function getColorVariantsFromCollection(product) {
  const collection = product.collections?.nodes?.[0];
  if (!collection?.products?.nodes) return [];

  const baseName = product.title
    .replace(/Women\s+([\w\s]+?)\s+(?=Pure|Airy|100%|Short|Long)/, 'Women ')
    .trim();

  return collection.products.nodes.filter((p) => {
    const pBaseName = p.title
      .replace(/Women\s+([\w\s]+?)\s+(?=Pure|Airy|100%|Short|Long)/, 'Women ')
      .trim();
    return pBaseName === baseName;
  });
}