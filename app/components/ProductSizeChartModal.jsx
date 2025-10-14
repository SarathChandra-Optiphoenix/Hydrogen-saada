import {useEffect, useRef, useState} from 'react';
import {useNavigate} from 'react-router';

export function ProductSizeChartModal({
  open,
  onClose,
  title,
  productOptions = [],
  selectedVariant,
}) {
  const backdropRef = useRef(null);
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState(null);

  // Get size option
  const sizeOption = productOptions.find(opt => /size|waist/i.test(opt.name));
  
  useEffect(() => {
    if (open && selectedVariant) {
      // Pre-select current variant
      const currentSize = sizeOption?.optionValues.find(v => v.selected);
      if (currentSize) setSelectedSize(currentSize);
    }
  }, [open, selectedVariant, sizeOption]);

  // Close on ESC
  useEffect(() => {
    if (!open) return;
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    window.addEventListener('keydown', onKey);
    
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  // Click outside to close
  const onBackdropClick = (e) => {
    if (e.target === backdropRef.current) {
      onClose?.();
    }
  };

  const handleAddToCart = () => {
    if (selectedSize && selectedSize.variantUriQuery) {
      navigate(`?${selectedSize.variantUriQuery}`);
      onClose();
    }
  };

  // Don't render if not open
  if (!open) return null;

  return (
    <div
      ref={backdropRef}
      className="product-modal-backdrop product-modal-backdrop--open"
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-sizechart-title"
      onClick={onBackdropClick}
    >
      <div className="product-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="product-modal-header">
          <div className="product-modal-title-wrap">
            <h2 id="product-sizechart-title" className="product-modal-title">
              {title}
            </h2>
            <p className="product-modal-subtitle">Size Charts</p>
          </div>
          <button
            className="product-modal-close"
            aria-label="Close"
            onClick={onClose}
            type="button"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="product-modal-body">
          {/* Size Chart Table */}
          {sizeOption && sizeOption.optionValues.length > 0 ? (
            <>
              <div className="size-chart-table-wrap">
                <table className="size-chart-table">
                  <thead>
                    <tr>
                      <th></th>
                      <th>SIZE</th>
                      <th>WAIST</th>
                      <th>HIP</th>
                      <th>LENGTH</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sizeOption.optionValues.map((optionValue) => {
                      const measurements = getSizeMeasurements(optionValue.name);
                      const isSelected = selectedSize?.name === optionValue.name;
                      
                      return (
                        <tr 
                          key={optionValue.name}
                          className={isSelected ? 'size-chart-row-selected' : ''}
                        >
                          <td>
                            <input
                              type="radio"
                              name="size-chart-size"
                              checked={isSelected}
                              onChange={() => setSelectedSize(optionValue)}
                              disabled={!optionValue.available}
                            />
                          </td>
                          <td className="size-chart-size">{optionValue.name}</td>
                          <td>{measurements.waist}</td>
                          <td>{measurements.hip}</td>
                          <td>{measurements.length}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Note */}
              <p className="size-chart-note">
                <strong>Note:</strong> This size chart is based on body measurements, and the model is wearing a size S in the photo.
              </p>

              {/* Add to Cart Button */}
              <button
                type="button"
                className="size-chart-cta"
                onClick={handleAddToCart}
                disabled={!selectedSize || !selectedSize.available}
              >
                ADD TO CART
              </button>
            </>
          ) : (
            <p>No size information available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper to get full measurements for table
function getSizeMeasurements(sizeName) {
  const measurements = {
    'XS': { waist: '28" - 30"', hip: '36" - 37"', length: '37.5"' },
    'S': { waist: '31" - 32"', hip: '38" - 39"', length: '38"' },
    'M': { waist: '33" - 34"', hip: '40" - 41"', length: '38.5"' },
    'L': { waist: '35" - 36"', hip: '42" - 43"', length: '39"' },
    'XL': { waist: '37" - 38"', hip: '44" - 45"', length: '39.5"' },
    '2XL': { waist: '39" - 41"', hip: '46" - 47"', length: '40"' },
    '3XL': { waist: '42" - 44"', hip: '48" - 49"', length: '40.5"' },
    '4XL': { waist: '45" - 47"', hip: '50" - 51"', length: '41"' },
  };

  return measurements[sizeName] || { waist: '-', hip: '-', length: '-' };
}