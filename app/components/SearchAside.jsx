import { useId, useEffect, useState } from 'react';
import { Link } from 'react-router';
import { useAside } from '~/components/Aside';
import {
  SEARCH_ENDPOINT,
  SearchFormPredictive,
} from '~/components/SearchFormPredictive';
import { SearchResultsPredictive } from '~/components/SearchResultsPredictive';

/**
 * Search Dropdown Component - Production Version
 */
export function SearchAside() {
  const { type, close } = useAside();
  const queriesDatalistId = useId();
  const isOpen = type === 'search';
  const [activeTab, setActiveTab] = useState('products');

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') close();
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, close]);

  // Reset tab when search opens
  useEffect(() => {
    if (isOpen) {
      setActiveTab('products');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay backdrop */}
      <div 
        className="search-overlay active"
        onClick={close}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            close();
          }
        }}
        role="button"
        tabIndex={0}
        aria-label="Close search"
      />
      
      {/* Search panel below header */}
      <div className="search-panel active" role="dialog" aria-modal="true">
        <div className="search-panel-content">
          <SearchFormPredictive>
            {({ fetchResults, inputRef }) => (
              <>
                {/* Search Input */}
                <div className="search-input-container">
                  <div className="search-input-wrapper">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="search-icon">
                      <circle cx="10.5" cy="10.5" r="7" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M15.5 15.5L21 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    <input
                      name="q"
                      onChange={fetchResults}
                      onFocus={fetchResults}
                      placeholder="Search for..."
                      ref={inputRef}
                      type="search"
                      list={queriesDatalistId}
                      className="search-input"
                      autoComplete="off"
                    />
                    <button 
                      type="button" 
                      onClick={close} 
                      className="search-close-btn"
                      aria-label="Close search"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Search Results */}
                <SearchResultsPredictive>
                  {({ items, total, term, closeSearch }) => {
                    const { collections, pages, products, queries } = items;

                    // Only show results section if user has typed at least 1 character
                    if (!term.current || term.current.length === 0) {
                      return null;
                    }

                    // No results found
                    if (!total) {
                      return (
                        <div className="search-no-results">
                          <p>No results could be found. Please try again with a different query.</p>
                        </div>
                      );
                    }

                    // Show results layout with suggestions sidebar
                    return (
                      <div className="search-results-wrapper">
                        <div className="search-results-split">
                          {/* Left Side - Suggestions */}
                          <div className="search-suggestions">
                            <h3>Suggestions</h3>
                            {queries && queries.length > 0 ? (
                              <div className="suggestions-list">
                                {queries.slice(0, 10).map((query) => (
                                  <Link
                                    key={query.text}
                                    to={`${SEARCH_ENDPOINT}?q=${query.text}`}
                                    onClick={() => {
                                      closeSearch();
                                      close();
                                    }}
                                    className="suggestion-item"
                                  >
                                    {query.text}
                                  </Link>
                                ))}
                              </div>
                            ) : (
                              <div className="suggestions-list">
                                <p className="no-suggestions">No results found</p>
                              </div>
                            )}
                          </div>

                          {/* Right Side - Tabbed Results */}
                          <div className="search-tabs-container">
                            {/* Tabs */}
                            <div className="search-tabs">
                              <button
                                className={`search-tab ${activeTab === 'products' ? 'active' : ''}`}
                                onClick={() => setActiveTab('products')}
                              >
                                Products
                                {products && products.length > 0 && (
                                  <span className="tab-count">({products.length})</span>
                                )}
                              </button>
                              <button
                                className={`search-tab ${activeTab === 'collections' ? 'active' : ''}`}
                                onClick={() => setActiveTab('collections')}
                              >
                                Collections
                                {collections && collections.length > 0 && (
                                  <span className="tab-count">({collections.length})</span>
                                )}
                              </button>
                              <button
                                className={`search-tab ${activeTab === 'pages' ? 'active' : ''}`}
                                onClick={() => setActiveTab('pages')}
                              >
                                Pages
                                {pages && pages.length > 0 && (
                                  <span className="tab-count">({pages.length})</span>
                                )}
                              </button>
                            </div>

                            {/* Tab Content */}
                            <div className="search-tab-content">
                          {/* Products Tab */}
                          {console.log(products)}
                          {activeTab === 'products' && (
                            <div className="tab-panel">
                              {products && products.length > 0 ? (
                                <>
                                  <div className="products-grid">
                                    {products.map((product) => (
                                      <Link
                                        key={product.id}
                                        to={`/products/${product.handle}`}
                                        onClick={() => {
                                          closeSearch();
                                          close();
                                        }}
                                        className="product-card"
                                      >
                                        {product?.selectedOrFirstAvailableVariant?.image && (
                                          <div className="product-image">
                                            <img 
                                              src={product?.selectedOrFirstAvailableVariant?.image?.url} 
                                              alt={product?.selectedOrFirstAvailableVariant?.image?.altText || product.title}
                                            />
                                          </div>
                                        )}
                                        <div className="product-info">
                                          <h4 className="product-title">{product.title}</h4>
                                          {product?.selectedOrFirstAvailableVariant?.price && (
                                            <div className="product-pricing">
                                              <span className="price-discount">
                                                ₹ {Math.floor(parseFloat(product?.selectedOrFirstAvailableVariant?.price?.amount)).toLocaleString('en-IN')}
                                              </span>
                                              {/* {product.variants.nodes[0].compareAtPrice && (
                                                <span className="price-original">
                                                  ₹ {Math.floor(parseFloat(product.variants.nodes[0].compareAtPrice.amount)).toLocaleString('en-IN')}
                                                </span>
                                              )} */}
                                            </div>
                                          )}
                                          <div className="product-rating">
                                            <span className="stars">★★★★★</span>
                                            <span className="rating-text">(5.0)</span>
                                          </div>
                                        </div>
                                      </Link>
                                    ))}
                                  </div>
                                  {products.length > 0 && (
                                    <div className="view-all-container">
                                      <Link
                                        to={`${SEARCH_ENDPOINT}?q=${term.current}`}
                                        onClick={() => {
                                          closeSearch();
                                          close();
                                        }}
                                        className="view-all-button"
                                      >
                                        View all results
                                      </Link>
                                    </div>
                                  )}
                                </>
                              ) : (
                                <div className="tab-no-results">
                                  <p>No products found</p>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Collections Tab */}
                          {activeTab === 'collections' && (
                            <div className="tab-panel">
                              {collections && collections.length > 0 ? (
                                <>
                                  <div className="collections-list">
                                    {collections.map((collection) => (
                                      <Link
                                        key={collection.id}
                                        to={`/collections/${collection.handle}`}
                                        onClick={() => {
                                          closeSearch();
                                          close();
                                        }}
                                        className="collection-item"
                                      >
                                        <span>{collection.title}</span>
                                      </Link>
                                    ))}
                                  </div>
                                  {collections.length > 0 && (
                                    <div className="view-all-container">
                                      <Link
                                        to={`${SEARCH_ENDPOINT}?q=${term.current}`}
                                        onClick={() => {
                                          closeSearch();
                                          close();
                                        }}
                                        className="view-all-button"
                                      >
                                        View all results
                                      </Link>
                                    </div>
                                  )}
                                </>
                              ) : (
                                <div className="tab-no-results">
                                  <p>No collections found</p>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Pages Tab */}
                          {activeTab === 'pages' && (
                            <div className="tab-panel">
                              {pages && pages.length > 0 ? (
                                <>
                                  <div className="pages-list">
                                    {pages.map((page) => (
                                      <Link
                                        key={page.id}
                                        to={`/pages/${page.handle}`}
                                        onClick={() => {
                                          closeSearch();
                                          close();
                                        }}
                                        className="page-item"
                                      >
                                        <span>{page.title}</span>
                                      </Link>
                                    ))}
                                  </div>
                                  {pages.length > 0 && (
                                    <div className="view-all-container">
                                      <Link
                                        to={`${SEARCH_ENDPOINT}?q=${term.current}`}
                                        onClick={() => {
                                          closeSearch();
                                          close();
                                        }}
                                        className="view-all-button"
                                      >
                                        View all results
                                      </Link>
                                    </div>
                                  )}
                                </>
                              ) : (
                                <div className="tab-no-results">
                                  <p>No pages found</p>
                                </div>
                              )}
                            </div>
                          )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }}
                </SearchResultsPredictive>
              </>
            )}
          </SearchFormPredictive>
        </div>
      </div>
    </>
  );
}