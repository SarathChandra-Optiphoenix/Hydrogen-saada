import {useEffect, useMemo, useState, useRef, useCallback} from 'react';
import {Image, Money} from '@shopify/hydrogen';
import {Link, useLocation, useNavigate, useFetcher} from 'react-router';
import {
  getProductBadges,
  useCategoryThumbs,
  normalizeCat,                // <-- added
} from '~/utils';

export default function CollectionMain({collection}) {
  const navigate = useNavigate();
  const {search} = useLocation();
  const url = new URLSearchParams(search);
  const fetcher = useFetcher();

  /* ---------- observer for infinite scroll ---------- */
  const observerTarget = useRef(null);

  /* ---------- grid mode ---------- */
  const [viewMode, setViewMode] = useState('grid-3');
  useEffect(() => {
    const isMobile =
      typeof window !== 'undefined' &&
      window.matchMedia('(max-width:768px)').matches;
    setViewMode(isMobile ? 'grid-2' : 'grid-3');
  }, []);

  /* ---------- drawers ---------- */
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [mobileSortOpen, setMobileSortOpen] = useState(false);
  const [desktopSortOpen, setDesktopSortOpen] = useState(false);

  /* ---------- data ---------- */
  const [allProducts, setAllProducts] = useState(
    collection?.products?.nodes ?? [],
  );
  const [pageInfo, setPageInfo] = useState(collection?.products?.pageInfo);
  const filters = collection?.products?.filters ?? [];

  // Stable snapshot so the category row keeps its images when you filter.
  const initialProductsRef = useRef(collection?.products?.nodes ?? []);

  // Update when collection changes (sort/filter server response)
  useEffect(() => {
    const incoming = collection?.products?.nodes ?? [];
    setAllProducts(incoming);
    setPageInfo(collection?.products?.pageInfo);

    const seen = new Set(initialProductsRef.current.map((p) => p.id));
    incoming.forEach((p) => {
      if (!seen.has(p.id)) initialProductsRef.current.push(p);
    });
  }, [collection]);

  // Build thumbs from the *stable* pool
  const categoryThumbs = useCategoryThumbs(initialProductsRef.current);

  /* ---------- infinite scroll ---------- */
  useEffect(() => {
    if (fetcher.data?.collection?.products) {
      const newNodes = fetcher.data.collection.products.nodes;
      setAllProducts((prev) => [...prev, ...newNodes]);
      setPageInfo(fetcher.data.collection.products.pageInfo);

      const seen = new Set(initialProductsRef.current.map((p) => p.id));
      newNodes.forEach((p) => {
        if (!seen.has(p.id)) initialProductsRef.current.push(p);
      });
    }
  }, [fetcher.data]);

  const loadMore = useCallback(() => {
    if (!pageInfo?.hasNextPage || fetcher.state === 'loading') return;
    const nextUrl = new URL(window.location.href);
    nextUrl.searchParams.set('cursor', pageInfo.endCursor);
    nextUrl.searchParams.set('direction', 'forward');
    fetcher.load(nextUrl.pathname + nextUrl.search);
  }, [pageInfo, fetcher]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && pageInfo?.hasNextPage) {
          loadMore();
        }
      },
      {threshold: 0.1},
    );
    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => observer.disconnect();
  }, [loadMore, pageInfo]);

  /* ---------- banner + features ---------- */
  const findMeta = (key) => collection?.metafields?.find((m) => m?.key === key);
  const getTextMeta = (key) => findMeta(key)?.value ?? null;
  const getFileUrl = (key) => {
    const mf = findMeta(key);
    if (!mf) return null;
    if (mf?.reference?.image?.url) return mf.reference.image.url;
    if (mf?.reference?.url) return mf.reference.url;
    if (mf?.value && /^https?:\/\//.test(mf.value)) return mf.value;
    return null;
  };
  const desktopBanner = getFileUrl('collection_banner');
  const mobileBanner = getFileUrl('collection_banner_mobile');
  const features = useMemo(
    () =>
      [1, 2, 3]
        .map((i) => {
          const text = getTextMeta(`feature_${i}_text`);
          const icon = getFileUrl(`feature_${i}_icon`);
          return text ? {text, icon} : null;
        })
        .filter(Boolean),
    [collection?.metafields],
  );

  /* ---------- URL helpers ---------- */
  const fParams = useMemo(() => url.getAll('f'), [search]); // single read

  const ensureEncoded = (s) =>
    s && s.trim().startsWith('%7B') ? s : encodeURIComponent(s);

  const hasFilterInput = (inputObj) => {
    const needle = encodeURIComponent(JSON.stringify(inputObj));
    return fParams.includes(needle);
  };

  const selectedCategoryLabel = useMemo(() => {
    for (const fp of fParams) {
      try {
        const obj = JSON.parse(decodeURIComponent(fp));
        if (
          obj?.productMetafield?.namespace === 'custom' &&
          obj?.productMetafield?.key === 'category_filter_name'
        ) {
          return obj?.productMetafield?.value || null;
        }
      } catch {
        /* ignore */
      }
    }
    return null;
  }, [fParams]);

  // Single-select for the Category filter
  const toggleCategorySingle = (categoryInputJSON) => {
    const encodedIncoming = ensureEncoded(categoryInputJSON);
    const incomingObj = JSON.parse(decodeURIComponent(encodedIncoming));
    const incomingLabel = incomingObj?.productMetafield?.value;

    if (selectedCategoryLabel && selectedCategoryLabel === incomingLabel) {
      const next = fParams.filter((fp) => {
        try {
          const obj = JSON.parse(decodeURIComponent(fp));
          return !(
            obj?.productMetafield?.namespace === 'custom' &&
            obj?.productMetafield?.key === 'category_filter_name'
          );
        } catch {
          return true;
        }
      });
      apply({f: next});
      return;
    }

    const kept = fParams.filter((fp) => {
      try {
        const obj = JSON.parse(decodeURIComponent(fp));
        return !(
          obj?.productMetafield?.namespace === 'custom' &&
          obj?.productMetafield?.key === 'category_filter_name'
        );
      } catch {
        return true;
      }
    });
    apply({f: [...kept, encodedIncoming]});
  };

  // Multi-toggle for all other filters
  const toggleFilter = (inputJSON) => {
    const encoded = ensureEncoded(inputJSON);
    const all = fParams;
    const next = all.includes(encoded)
      ? all.filter((x) => x !== encoded)
      : [...all, encoded];
    apply({f: next});
  };

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
    params.delete('cursor');
    params.delete('direction');
    navigate({search: `?${params.toString()}`}, {replace: false});
  };

  const currentSort = url.get('sort_by') || 'manual';

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

  return (
    <div className="collection">
      {/* ===== Banner ===== */}
      <div className="collection-banner">
        {(desktopBanner || mobileBanner) && (
          <div className="collection-banner-image">
            <picture>
              {mobileBanner && (
                <source media="(max-width:768px)" srcSet={mobileBanner} />
              )}
              <img
                src={desktopBanner || mobileBanner}
                alt={collection?.title || 'Collection'}
              />
            </picture>
          </div>
        )}

        {!(mobileBanner || desktopBanner) && (
          <CategoryCircles
            filters={filters}
            selectedCategoryLabel={selectedCategoryLabel}
            categoryThumbs={categoryThumbs}
            onSelect={(inputJSON) => toggleCategorySingle(inputJSON)}
          />
        )}

        {features?.length > 0 && (
          <div className="collection-features">
            {features.map((f) => (
              <div className="feature-item" key={f.text}>
                <div className="feature-icon">
                  {f.icon ? <img src={f.icon} alt="" /> : <span>✓</span>}
                </div>
                <span>{f.text}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ===== DESKTOP: toolbar ===== */}
      <div className="collection-toolbar desktop-toolbar">
        <div className="toolbar-left">
          <div className="view-mode-selector">
            <button
              type="button"
              className={viewMode === 'grid-3' ? 'active' : ''}
              onClick={() => setViewMode('grid-3')}
              aria-label="Grid 3"
              title="Grid 3"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <rect width="8" height="8" fill="currentColor" />
                <rect y="10" width="8" height="8" fill="currentColor" />
                <rect x="10" width="8" height="8" fill="currentColor" />
                <rect x="10" y="10" width="8" height="8" fill="currentColor" />
              </svg>
            </button>
            <button
              type="button"
              className={viewMode === 'grid-4' ? 'active' : ''}
              onClick={() => setViewMode('grid-4')}
              aria-label="Grid 4"
              title="Grid 4"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <rect width="5" height="5" fill="currentColor" />
                <rect x="6.5" width="5" height="5" fill="currentColor" />
                <rect x="13" width="5" height="5" fill="currentColor" />
                <rect y="6.5" width="5" height="5" fill="currentColor" />
                <rect x="6.5" y="6.5" width="5" height="5" fill="currentColor" />
                <rect x="13" y="6.5" width="5" height="5" fill="currentColor" />
                <rect y="13" width="5" height="5" fill="currentColor" />
                <rect x="6.5" y="13" width="5" height="5" fill="currentColor" />
                <rect x="13" y="13" width="5" height="5" fill="currentColor" />
              </svg>
            </button>
            <button
              type="button"
              className={viewMode === 'grid-6' ? 'active' : ''}
              onClick={() => setViewMode('grid-6')}
              aria-label="List view"
              title="List view"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <rect width="18" height="2" fill="currentColor" />
                <rect y="4" width="18" height="2" fill="currentColor" />
                <rect y="8" width="18" height="2" fill="currentColor" />
                <rect y="12" width="18" height="2" fill="currentColor" />
                <rect y="16" width="18" height="2" fill="currentColor" />
              </svg>
            </button>
          </div>
        </div>

        <div className="toolbar-center">
          <span className="product-count">{allProducts.length} products</span>
        </div>

        <div className="toolbar-right">
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
      </div>

      {/* ===== DESKTOP: filters + products ===== */}
      <div className="collection-content-desktop">
        <div className="collection-filters-inline">
          {filters.map((group) => (
            <FilterSection key={group.id} label={group.label} initialOpen={false}>
              {group.type === 'PRICE_RANGE' ? (
                <PriceBlock onApply={(min, max) => setPrice(min, max)} url={url} />
              ) : group.id === 'filter.v.availability' ? (
                <label className={`checkbox-row ${url.get('in_stock') === '1' ? 'checked' : ''}`}>
                  <input
                    type="checkbox"
                    checked={url.get('in_stock') === '1'}
                    onChange={(e) => setInStock(e.target.checked)}
                  />
                  <span>In stock only</span>
                </label>
              ) : (
                group.values.map((v) => {
                  const decoded = JSON.parse(v.input);
                  const isCategory =
                    decoded?.productMetafield?.namespace === 'custom' &&
                    decoded?.productMetafield?.key === 'category_filter_name';
                  const checked = hasFilterInput(decoded);

                  return (
                    <button
                      key={v.id}
                      className={`checkbox-row ${checked ? 'checked' : ''}`}
                      onClick={(e) => {
                        if (isCategory) {
                          toggleCategorySingle(v.input);
                          e.preventDefault();
                        }
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => {
                          if (isCategory) toggleCategorySingle(v.input);
                          else toggleFilter(v.input);
                        }}
                      />
                      <span>{v.label}</span>
                    </button>
                  );
                })
              )}
            </FilterSection>
          ))}
        </div>

        <div className="collection-products-area">
          <div className={`products-grid ${viewMode}`}>
            {allProducts.map((product, i) => {
              const badges = getProductBadges(product);
              return (
                <Link key={product.id} to={`/products/${product.handle}`} className="product-item">
                  {product.featuredImage ? (
                    <Image
                      data={product.featuredImage}
                      alt={product.title}
                      loading={i < 8 ? 'eager' : 'lazy'}
                      sizes="(max-width: 699px) calc(100vw / 2), (max-width: 999px) calc(100vw / 0 - 64px), calc((100vw - 96px) / 3 - (24px / 3 * 2))"
                    />
                  ) : (
                    <div className="placeholder" />
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
            })}
          </div>

          {pageInfo?.hasNextPage && (
            <div ref={observerTarget} className="load-more-trigger" style={{height: '20px', margin: '20px 0'}}>
              {fetcher.state === 'loading' && <div className="loading-spinner">Loading more products...</div>}
            </div>
          )}
        </div>
      </div>

      {/* ===== MOBILE: products only ===== */}
      <div className="collection-content-mobile">
        <div className={`products-grid ${viewMode}`}>
          {allProducts.map((product, i) => {
            const badges = getProductBadges(product);
            return (
              <Link key={product.id} to={`/products/${product.handle}`} className="product-item">
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
                <div className="product-item-badges">
                  {badges.map((b) => (
                    <span key={`badge-${b.text}`} className="product-item-badge" style={{backgroundColor: b.background, color: b.textColor}}>
                      {b.text}
                    </span>
                  ))}
                </div>
              </Link>
            );
          })}
        </div>

        {pageInfo?.hasNextPage && (
          <div ref={observerTarget} className="load-more-trigger" style={{height: '20px', margin: '20px 0'}}>
            {fetcher.state === 'loading' && <div className="loading-spinner">Loading more products...</div>}
          </div>
        )}
      </div>

      {/* ===== MOBILE: Filter Drawer ===== */}
      {mobileFilterOpen && (
        <div className="drawer-overlay">
          <aside className="drawer drawer-right">
            <header className="drawer-header">
              <strong>Filters</strong>
              <button className="drawer-close" onClick={() => setMobileFilterOpen(false)} aria-label="Close" aria-expanded="false">
                <svg aria-hidden="true" focusable="false" fill="none" width="14" className="icon icon-close" viewBox="0 0 16 16">
                  <path d="m1 1 14 14M1 15 15 1" stroke="currentColor" strokeWidth="1.5"></path>
                </svg>
              </button>
            </header>
            <main className="drawer-content">
              {filters.map((group) => (
                <FilterSection key={group.id} label={group.label} initialOpen={false}>
                  {group.type === 'PRICE_RANGE' ? (
                    <PriceBlock onApply={(min, max) => setPrice(min, max)} url={url} />
                  ) : group.id === 'filter.v.availability' ? (
                    <label className={`checkbox-row ${url.get('in_stock') === '1' ? 'checked' : ''}`}>
                      <input type="checkbox" checked={url.get('in_stock') === '1'} onChange={(e) => setInStock(e.target.checked)} />
                      <span>In stock only</span>
                    </label>
                  ) : (
                    group.values.map((v) => {
                      const decoded = JSON.parse(v.input);
                      const isCategory =
                        decoded?.productMetafield?.namespace === 'custom' &&
                        decoded?.productMetafield?.key === 'category_filter_name';
                      const checked = hasFilterInput(decoded);

                      return (
                        <button
                          key={v.id}
                          className={`checkbox-row ${checked ? 'checked' : ''}`}
                          onClick={(e) => {
                            if (isCategory) {
                              toggleCategorySingle(v.input);
                              e.preventDefault();
                            }
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => {
                              if (isCategory) toggleCategorySingle(v.input);
                              else toggleFilter(v.input);
                            }}
                          />
                          <span>{v.label}</span>
                        </button>
                      );
                    })
                  )}
                </FilterSection>
              ))}
            </main>
          </aside>
        </div>
      )}

      {/* ===== MOBILE: Sort Drawer ===== */}
      {mobileSortOpen && (
        <div className="drawer-overlay">
          <aside className="drawer drawer-bottom">
            <header className="drawer-header">
              <strong>Sort by</strong>
              <button className="drawer-close" onClick={() => setMobileSortOpen(false)} aria-label="Close">
                <svg aria-hidden="true" focusable="false" fill="none" width="14" className="icon icon-close" viewBox="0 0 16 16">
                  <path d="m1 1 14 14M1 15 15 1" stroke="currentColor" strokeWidth="1.5"></path>
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
                    <button className={currentSort === val ? 'active' : ''} onClick={() => setSort(val)}>
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

/* ===== Filter Section ===== */
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
          <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && <div className="filter-content">{children}</div>}
    </div>
  );
}

/* ===== Price Block ===== */
function PriceBlock({onApply, url}) {
  const [min, setMin] = useState(url.get('price_min') || '');
  const [max, setMax] = useState(url.get('price_max') || '');
  return (
    <div className="price-block">
      <div className="price-row">
        <label htmlFor="price-min">₹</label>
        <input type="number" placeholder="Min" value={min} onChange={(e) => setMin(e.target.value)} inputMode="numeric" />
        <span>to</span>
        <label htmlFor="price-max">₹</label>
        <input type="number" placeholder="Max" value={max} onChange={(e) => setMax(e.target.value)} inputMode="numeric" />
      </div>
      <button className="apply-btn" onClick={() => onApply(min || null, max || null)}>
        Apply
      </button>
    </div>
  );
}

/* ===== Category Circles (row) ===== */
function CategoryCircles({
  filters,
  selectedCategoryLabel,
  categoryThumbs,   // Map<string,string> or plain object
  onSelect,
}) {
  // 1) Build a normalized thumbs map (hooks FIRST, no early return yet)
  const safeThumbs = useMemo(() => {
    const out = new Map();
    if (categoryThumbs instanceof Map) {
      for (const [k, url] of categoryThumbs.entries()) {
        out.set(normalizeCat(String(k)), url);
      }
    } else {
      Object.entries(categoryThumbs || {}).forEach(([k, url]) => {
        out.set(normalizeCat(String(k)), url);
      });
    }
    return out;
  }, [categoryThumbs]);

  const getThumb = useCallback(
    (label) => safeThumbs.get(normalizeCat(label)) ?? null,
    [safeThumbs]
  );

  // 2) Find the “Category” filter group
  const categoryGroup = useMemo(
    () =>
      filters?.find(
        (g) =>
          g.label?.toLowerCase() === 'category' ||
          g.id?.includes('custom.category_filter_name')
      ),
    [filters]
  );

  // 3) Now it’s safe to early-return (all hooks already executed above)
  if (!categoryGroup || !categoryGroup.values?.length) return null;

  return (
    <div className="category-circles-wrap">
      <div className="category-circles">
        {categoryGroup.values.map((v) => {
          const {label} = v;
          const img = getThumb(label);
          const selected = selectedCategoryLabel === label;

          return (
            <button
              key={v.id}
              className={`category-chip ${selected ? 'selected' : ''}`}
              onClick={() => onSelect(v.input)}
              aria-pressed={selected ? 'true' : 'false'}
              title={label}
            >
              <span className="chip-avatar">
                {img ? <img src={img} alt={label} /> : <span className="chip-fallback" aria-hidden="true" />}
                {selected && (
                  <span className="chip-check" aria-hidden="true">
                    <svg className="category-check" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                )}
              </span>
              <span className="chip-label">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}