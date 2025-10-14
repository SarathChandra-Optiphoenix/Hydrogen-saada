import {useEffect, useMemo, useState} from 'react';
import {Image, Money} from '@shopify/hydrogen';
import {Link, useLocation, useNavigate} from 'react-router';

export default function AllProductsMain({
  products,
  filters,
  currentPage,
  totalPages,
}) {
  const navigate = useNavigate();
  const {search} = useLocation();
  const url = new URLSearchParams(search);

  /* ---------- grid mode ---------- */
  const [viewMode, setViewMode] = useState('grid-4');
  useEffect(() => {
    const isMobile =
      typeof window !== 'undefined' &&
      window.matchMedia('(max-width:768px)').matches;
    setViewMode(isMobile ? 'grid-2' : 'grid-4');
  }, []);

  /* ---------- drawers ---------- */
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [mobileSortOpen, setMobileSortOpen] = useState(false);
  const [desktopSortOpen, setDesktopSortOpen] = useState(false);

  /* ---------- URL helpers ---------- */
  const apply = (changes) => {
    const params = new URLSearchParams(search);
    Object.entries(changes).forEach(([k, v]) => {
      if (
        v === null ||
        v === undefined ||
        v === '' ||
        (Array.isArray(v) && v.length === 0)
      ) {
        params.delete(k);
      } else if (Array.isArray(v)) {
        params.delete(k);
        v.forEach((val) => params.append(k, val));
      } else {
        params.set(k, String(v));
      }
    });
    // Reset to page 1 when filters/sort change
    if (!changes.hasOwnProperty('page')) {
      params.delete('page');
    }
    navigate({search: `?${params.toString()}`}, {replace: false});
  };

  const currentSort = url.get('sort_by') || 'manual';

  /* ---------- filter encode/decode ---------- */
  const getFParams = () => url.getAll('f');
  const hasFilterInput = (inputObj) => {
    const needle = encodeURIComponent(JSON.stringify(inputObj));
    return getFParams().includes(needle);
  };
  const toggleFilter = (inputJSON) => {
    const encoded = encodeURIComponent(inputJSON);
    const all = getFParams();
    const next = all.includes(encoded)
      ? all.filter((x) => x !== encoded)
      : [...all, encoded];
    apply({f: next});
  };

  /* ---------- actions ---------- */
  const setSort = (val) => {
    apply({sort_by: val});
    setDesktopSortOpen(false);
    setMobileSortOpen(false);
  };
  const setInStock = (checked) => apply({in_stock: checked ? '1' : null});
  const setPrice = (min, max) =>
    apply({
      price_min: min !== undefined && min !== null ? String(min) : null,
      price_max: max !== undefined && max !== null ? String(max) : null,
    });

  /* ---------- pagination ---------- */
  const goToPage = (page) => {
    apply({page: String(page)});
    window.scrollTo({top: 0, behavior: 'smooth'});
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="collection">
      {/* ===== DESKTOP: Centered toolbar (count | sort) ===== */}
      <div className="collection-toolbar desktop-toolbar">
        {/* Empty left for spacing */}
        <div className="toolbar-left"></div>

        {/* CENTER: Product count and Sort */}
        <div className="toolbar-center">
          <span className="product-count">{products.length} products</span>
          
          <div className="sort-dropdown">
            <button
              type="button"
              className="sort-trigger"
              onClick={() => setDesktopSortOpen(!desktopSortOpen)}
              aria-expanded={desktopSortOpen ? 'true' : 'false'}
              aria-controls="sort-menu"
            >
              <span>Sort by</span>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M2 4L6 8L10 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* Desktop Sort Dropdown Menu */}
            {desktopSortOpen && (
              <>
                <button
                  className="sort-dropdown-overlay"
                  onClick={() => setDesktopSortOpen(false)}
                />
                <div className="sort-dropdown-menu">
                  {[
                    ['manual', 'Featured'],
                    ['best-selling', 'Best selling'],
                    ['title-ascending', 'Alphabetically, A–Z'],
                    ['title-descending', 'Alphabetically, Z–A'],
                    ['price-ascending', 'Price, low to high'],
                    ['price-descending', 'Price, high to low'],
                    ['created-descending', 'Date, new to old'],
                    ['created-ascending', 'Date, old to new'],
                  ].map(([val, label]) => (
                    <button
                      key={val}
                      className={currentSort === val ? 'active' : ''}
                      onClick={() => setSort(val)}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Empty right for spacing */}
        <div className="toolbar-right"></div>
      </div>

      {/* ===== MOBILE: toolbar (filter | sort | grid) ===== */}
      <div className="collection-toolbar mobile-toolbar">
        {/* LEFT: Filter button */}
        <button
          className="toolbar-btn filter-btn"
          onClick={() => setMobileFilterOpen(true)}
        >
          <span>Filter</span>
        </button>

        {/* CENTER: Sort by button */}
        <button
          className="toolbar-btn sort-btn"
          onClick={() => setMobileSortOpen(true)}
          aria-expanded={mobileSortOpen ? 'true' : 'false'}
        >
          <span>Sort by</span>
          <svg
            width="12"
            aria-hidden="true"
            focusable="false"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
          >
            <path
              d="M2 4L6 8L10 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* RIGHT: Grid toggle */}
        <div className="grid-toggle">
          <button
            className={viewMode === 'grid-1' ? 'active' : ''}
            onClick={() => setViewMode('grid-1')}
            aria-label="Single column"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect
                x="2"
                y="2"
                width="16"
                height="16"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
            </svg>
          </button>
          <button
            className={viewMode === 'grid-2' ? 'active' : ''}
            onClick={() => setViewMode('grid-2')}
            aria-label="Two columns"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect
                x="2"
                y="2"
                width="7"
                height="7"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
              <rect
                x="11"
                y="2"
                width="7"
                height="7"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
              <rect
                x="2"
                y="11"
                width="7"
                height="7"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
              <rect
                x="11"
                y="11"
                width="7"
                height="7"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* ===== DESKTOP: Inline Filters + Products ===== */}
      <div className="collection-content-desktop">
        {/* Left: Inline Filters */}
        <div className="collection-filters-inline">
          {filters && filters.map((group) => (
            <FilterSection
              key={group.id}
              label={group.label}
              initialOpen={false}
            >
              {group.type === 'PRICE_RANGE' ? (
                <PriceBlock
                  onApply={(min, max) => setPrice(min, max)}
                  url={url}
                />
              ) : group.id === 'filter.v.availability' ? (
                <label className="checkbox-row">
                  <input
                    type="checkbox"
                    checked={url.get('in_stock') === '1'}
                    onChange={(e) => setInStock(e.target.checked)}
                  />
                  <span>In stock only</span>
                </label>
              ) : (
                group.values.map((v) => {
                  const checked = hasFilterInput(JSON.parse(v.input));
                  return (
                    <label key={v.id} className="checkbox-row">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleFilter(v.input)}
                      />
                      <span>
                        {v.label} ({v.count})
                      </span>
                    </label>
                  );
                })
              )}
            </FilterSection>
          ))}
        </div>

        {/* Right: Products Grid */}
        <div className="collection-products-area">
          <div className={`products-grid ${viewMode}`}>
            {products.map((product, i) => (
              <Link
                key={product.id}
                to={`/products/${product.handle}`}
                className="product-item"
              >
                {product.featuredImage ? (
                  <Image
                    data={product.featuredImage}
                    alt={product.title}
                    loading={i < 8 ? 'eager' : 'lazy'}
                    sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                  />
                ) : (
                  <div className="placeholder" />
                )}
                <h4>{product.title}</h4>
                <small>
                  <Money data={product.priceRange.minVariantPrice} />
                </small>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav className="pagination" role="navigation" aria-label="Pagination navigation">
              {currentPage > 1 && (
                <button
                  className="pagination__link h6"
                  onClick={() => goToPage(currentPage - 1)}
                  aria-label={`Go to page ${currentPage - 1}`}
                >
                  <svg
                    aria-hidden="true"
                    focusable="false"
                    fill="none"
                    width="11"
                    className="icon icon-chevron-left"
                    viewBox="0 0 10 10"
                  >
                    <path
                      d="m7 9-4-4 4-4"
                      stroke="currentColor"
                      strokeLinecap="square"
                    />
                  </svg>
                </button>
              )}

              {getPageNumbers().map((pageNum, idx) => {
                if (pageNum === '...') {
                  return (
                    <span
                      key={`ellipsis-${idx}`}
                      className="pagination__link pagination__link--disabled h6"
                    >
                      ...
                    </span>
                  );
                }
                return (
                  <button
                    key={pageNum}
                    className={`pagination__link h6 ${
                      currentPage === pageNum ? 'pagination__link--active' : ''
                    }`}
                    onClick={() => goToPage(pageNum)}
                    aria-label={`Go to page ${pageNum}`}
                    aria-current={currentPage === pageNum ? 'page' : undefined}
                  >
                    {pageNum}
                  </button>
                );
              })}

              {currentPage < totalPages && (
                <button
                  className="pagination__link h6"
                  onClick={() => goToPage(currentPage + 1)}
                  rel="next"
                  aria-label={`Go to page ${currentPage + 1}`}
                >
                  <svg
                    aria-hidden="true"
                    focusable="false"
                    fill="none"
                    width="11"
                    className="icon icon-chevron-right icon--direction-aware"
                    viewBox="0 0 10 10"
                  >
                    <path
                      d="m3 9 4-4-4-4"
                      stroke="currentColor"
                      strokeLinecap="square"
                    />
                  </svg>
                </button>
              )}
            </nav>
          )}
        </div>
      </div>

      {/* ===== MOBILE: Products only (filters in drawer) ===== */}
      <div className="collection-content-mobile">
        <div className={`products-grid ${viewMode}`}>
          {products.map((product, i) => (
            <Link
              key={product.id}
              to={`/products/${product.handle}`}
              className="product-item"
            >
              {product.featuredImage ? (
                <Image
                  data={product.featuredImage}
                  alt={product.title}
                  loading={i < 8 ? 'eager' : 'lazy'}
                  sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                />
              ) : (
                <div className="placeholder" />
              )}
              <h4>{product.title}</h4>
              <small>
                <Money data={product.priceRange.minVariantPrice} />
              </small>
            </Link>
          ))}
        </div>

        {/* Pagination - Mobile */}
        {totalPages > 1 && (
          <nav className="pagination" role="navigation" aria-label="Pagination navigation">
            {currentPage > 1 && (
              <button
                className="pagination__link h6"
                onClick={() => goToPage(currentPage - 1)}
                aria-label={`Go to page ${currentPage - 1}`}
              >
                <svg
                  aria-hidden="true"
                  focusable="false"
                  fill="none"
                  width="11"
                  className="icon icon-chevron-left"
                  viewBox="0 0 10 10"
                >
                  <path
                    d="m7 9-4-4 4-4"
                    stroke="currentColor"
                    strokeLinecap="square"
                  />
                </svg>
              </button>
            )}

            {getPageNumbers().map((pageNum, idx) => {
              if (pageNum === '...') {
                return (
                  <span
                    key={`ellipsis-${idx}`}
                    className="pagination__link pagination__link--disabled h6"
                  >
                    ...
                  </span>
                );
              }
              return (
                <button
                  key={pageNum}
                  className={`pagination__link h6 ${
                    currentPage === pageNum ? 'pagination__link--active' : ''
                  }`}
                  onClick={() => goToPage(pageNum)}
                  aria-label={`Go to page ${pageNum}`}
                  aria-current={currentPage === pageNum ? 'page' : undefined}
                >
                  {pageNum}
                </button>
              );
            })}

            {currentPage < totalPages && (
              <button
                className="pagination__link h6"
                onClick={() => goToPage(currentPage + 1)}
                rel="next"
                aria-label={`Go to page ${currentPage + 1}`}
              >
                <svg
                  aria-hidden="true"
                  focusable="false"
                  fill="none"
                  width="11"
                  className="icon icon-chevron-right icon--direction-aware"
                  viewBox="0 0 10 10"
                >
                  <path
                    d="m3 9 4-4-4-4"
                    stroke="currentColor"
                    strokeLinecap="square"
                  />
                </svg>
              </button>
            )}
          </nav>
        )}
      </div>

      {/* ===== MOBILE: Filter Drawer (Right) ===== */}
      {mobileFilterOpen && (
        <div className="drawer-overlay">
          <aside className="drawer drawer-right">
            <header className="drawer-header">
              <strong>Filters</strong>
              <button
                className="drawer-close"
                onClick={() => setMobileFilterOpen(false)}
                aria-label="Close"
                aria-expanded="false"
              >
                <svg
                  aria-hidden="true"
                  focusable="false"
                  fill="none"
                  width="14"
                  className="icon icon-close"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="m1 1 14 14M1 15 15 1"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
              </button>
            </header>
            <main className="drawer-content">
              {filters && filters.map((group) => (
                <FilterSection
                  key={group.id}
                  label={group.label}
                  initialOpen={false}
                >
                  {group.type === 'PRICE_RANGE' ? (
                    <PriceBlock
                      onApply={(min, max) => setPrice(min, max)}
                      url={url}
                    />
                  ) : group.id === 'filter.v.availability' ? (
                    <label className="checkbox-row">
                      <input
                        type="checkbox"
                        checked={url.get('in_stock') === '1'}
                        onChange={(e) => setInStock(e.target.checked)}
                      />
                      <span>In stock only</span>
                    </label>
                  ) : (
                    group.values.map((v) => {
                      const checked = hasFilterInput(JSON.parse(v.input));
                      return (
                        <label key={v.id} className="checkbox-row">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleFilter(v.input)}
                          />
                          <span>
                            {v.label} ({v.count})
                          </span>
                        </label>
                      );
                    })
                  )}
                </FilterSection>
              ))}
            </main>
          </aside>
        </div>
      )}

      {/* ===== MOBILE: Sort Drawer (Bottom) ===== */}
      {mobileSortOpen && (
        <div className="drawer-overlay">
          <aside className="drawer drawer-bottom">
            <header className="drawer-header">
              <strong>Sort by</strong>
              <button
                className="drawer-close"
                onClick={() => setMobileSortOpen(false)}
                aria-label="Close"
              >
                <svg
                  aria-hidden="true"
                  focusable="false"
                  fill="none"
                  width="14"
                  className="icon icon-close"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="m1 1 14 14M1 15 15 1"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
              </button>
            </header>
            <main className="drawer-content">
              <ul className="sort-list">
                {[
                  ['manual', 'Featured'],
                  ['best-selling', 'Best selling'],
                  ['title-ascending', 'Alphabetically, A–Z'],
                  ['title-descending', 'Alphabetically, Z–A'],
                  ['price-ascending', 'Price, low to high'],
                  ['price-descending', 'Price, high to low'],
                  ['created-descending', 'Date, new to old'],
                  ['created-ascending', 'Date, old to new'],
                ].map(([val, label]) => (
                  <li key={val}>
                    <button
                      className={currentSort === val ? 'active' : ''}
                      onClick={() => setSort(val)}
                    >
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </main>
          </aside>
        </div>
      )}
    </div>
  );
}

/* ===== Filter Section Component ===== */
function FilterSection({label, children, initialOpen = false}) {
  const [open, setOpen] = useState(initialOpen);
  return (
    <div className="filter-section">
      <button
        className="filter-header"
        aria-controls="filter-menu"
        aria-expanded={open ? 'true' : 'false'}
        onClick={() => setOpen(!open)}
      >
        <span>{label}</span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path
            d="M2 4L6 8L10 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {open && <div className="filter-content">{children}</div>}
    </div>
  );
}

/* ===== Price Block Component ===== */
function PriceBlock({onApply, url}) {
  const [min, setMin] = useState(url.get('price_min') || '');
  const [max, setMax] = useState(url.get('price_max') || '');
  return (
    <div className="price-block">
      <div className="price-row">
        <label htmlFor="price-min">₹</label>
        <input
          type="number"
          placeholder="Min"
          value={min}
          onChange={(e) => setMin(e.target.value)}
          inputMode="numeric"
        />
        <span>to</span>
        <label htmlFor="price-max">₹</label>
        <input
          type="number"
          placeholder="Max"
          value={max}
          onChange={(e) => setMax(e.target.value)}
          inputMode="numeric"
        />
      </div>
      <button
        className="apply-btn"
        onClick={() => onApply(min || null, max || null)}
      >
        Apply
      </button>
    </div>
  );
}