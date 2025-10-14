import {useState, useEffect, useRef} from 'react';
import {Link} from 'react-router';
import {Aside, useAside} from '~/components/Aside';

/**
 * Menu Aside Component - HARDCODED MENU matching SAADAA production
 * No Storefront API - Direct HTML structure from Liquid
 */
export function MenuAside({setIsLoginOpen}) {
  const [expandedSection, setExpandedSection] = useState('shop-women'); // Default: SHOP WOMEN open
  const [expandedSubmenu, setExpandedSubmenu] = useState(null);
  const [expandedSecondary, setExpandedSecondary] = useState(null);
  const {close} = useAside();

  const scrollerRef = useRef(null);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    let timeout = null;

    const onScroll = () => {
      el.classList.add('scrolling');
      if (timeout) clearTimeout(timeout);
      // remove class 800ms after scrolling stops
      timeout = setTimeout(() => {
        el.classList.remove('scrolling');
      }, 800);
    };

    el.addEventListener('scroll', onScroll, {passive: true});
    return () => {
      el.removeEventListener('scroll', onScroll);
      if (timeout) clearTimeout(timeout);
    };
  }, []);

  const toggleMainSection = (sectionId) => {
    // Close all main sections first
    if (expandedSection === sectionId) {
      setExpandedSection(null);
    } else {
      setExpandedSection(sectionId);
    }
    setExpandedSubmenu(null); // Reset submenu
  };

  const toggleSubmenu = (submenuId) => {
    setExpandedSubmenu(expandedSubmenu === submenuId ? null : submenuId);
  };

  const toggleSecondary = (sectionId) => {
    setExpandedSecondary(expandedSecondary === sectionId ? null : sectionId);
  };

  return (
    <Aside
      type="mobile"
      heading={
        <header className="cp-header">
          <div className="cp-header-inner">
            <img
              src="https://cdn.shopify.com/s/files/1/0450/3476/6485/files/image_1.png?v=1749793852"
              alt="Saadaa logo"
              className="cp-logo"
            />
            <button
              to="#"
              onClick={(e) => {
                e.preventDefault();
                close();
                Promise.resolve().then(() => setIsLoginOpen(true));
              }}
              className="text-with-icon kwik-pass-login button sidebarLoginBtn"
              id="kp-account"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  d="M16.125 8.75c-.184 2.478-2.063 4.5-4.125 4.5s-3.944-2.021-4.125-4.5c-.187-2.578 1.64-4.5 4.125-4.5 2.484 0 4.313 1.969 4.125 4.5Z"
                  strokeWidth="1.5"
                />
                <path
                  d="M3.017 20.747C3.783 16.5 7.922 14.25 12 14.25s8.217 2.25 8.984 6.497"
                  strokeWidth="1.5"
                />
              </svg>
              <span>Log in</span>
            </button>
            <button
              type="button"
              className="close reset"
              onClick={close}
              aria-label="Close"
            >
              <svg
                aria-hidden="true"
                focusable="false"
                fill="none"
                width="16"
                className="icon icon-close"
                viewBox="0 0 16 16"
              >
                <path
                  d="m1 1 14 14M1 15 15 1"
                  stroke="currentColor"
                  strokeWidth="1.5"
                ></path>
              </svg>
            </button>
          </div>
        </header>
      }
      openFrom="left"
    >
      <div className="header-sidebar__main-panel">
        {/* STICKY HEADER: Logo + Login + Close */}

        {/* SCROLLABLE CONTENT */}
        <div className="header-sidebar__scroller" ref={scrollerRef}>
          {/* SHOP WOMEN - Main Accordion */}
          <div
            className="header-sidebar__group-list saadaa-accordion-section"
            id="accordion-shop-women"
            data-main
          >
            <button
              className="saadaa-accordion-title"
              data-main
              onClick={() => toggleMainSection('shop-women')}
            >
              SHOP WOMEN{' '}
              <span className="icon">
                {expandedSection === 'shop-women' ? '−' : '+'}
              </span>
            </button>
            {expandedSection === 'shop-women' && (
              <div className="saadaa-accordion-content">
                <ul className="header-sidebar__linklist unstyled-list">
                  {/* All Tops with submenu */}
                  <li>
                    <details
                      className="sidebar-accordion-item"
                      open={expandedSubmenu === 'all-tops'}
                    >
                      <summary
                        className="header-sidebar__linklist-button"
                        onClick={(e) => {
                          e.preventDefault();
                          toggleSubmenu('all-tops');
                        }}
                      >
                        <img
                          src="https://cdn.shopify.com/s/files/1/0450/3476/6485/files/image_3.webp?v=1752564952"
                          className="menu-img"
                          alt=""
                        />
                        All Tops
                        <span style={{marginLeft: 'auto'}}>
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                          >
                            <path
                              d="M9 18l6-6-6-6"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                      </summary>
                      {expandedSubmenu === 'all-tops' && (
                        <ul className="sidebar-accordion-list">
                          <li>
                            <Link
                              to="/collections/women-100-linen-shirts"
                              onClick={close}
                            >
                              <img
                                src="https://cdn.shopify.com/s/files/1/0450/3476/6485/files/1_19.webp?v=1759348453"
                                className="menu-img"
                                alt=""
                              />
                              Pure Linen Shirt
                              <span
                                className="home-nav-badge-new"
                                style={{marginLeft: '5px'}}
                              >
                                NEW
                              </span>
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/collections/women-100-notch-collar-shirts"
                              onClick={close}
                            >
                              <img
                                src="https://cdn.shopify.com/s/files/1/0450/3476/6485/files/1_18.webp?v=1759348452"
                                className="menu-img"
                                alt=""
                              />
                              Pure Linen Notch Collar Shirt
                              <span
                                className="home-nav-badge-new"
                                style={{marginLeft: '5px'}}
                              >
                                NEW
                              </span>
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/collections/women-cotton-camisole-top"
                              onClick={close}
                            >
                              <img
                                src="https://cdn.shopify.com/s/files/1/0450/3476/6485/files/1_20.webp?v=1759348452"
                                className="menu-img"
                                alt=""
                              />
                              Cotton Camisole Top
                              <span
                                className="home-nav-badge-new"
                                style={{marginLeft: '5px'}}
                              >
                                NEW
                              </span>
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/collections/airy-linen-flared-dress"
                              onClick={close}
                            >
                              <img
                                src="https://cdn.shopify.com/s/files/1/0450/3476/6485/files/1_7.webp?v=1753246195"
                                className="menu-img"
                                alt=""
                              />
                              Airy Linen Flared Dress
                              <span
                                className="home-nav-badge-new"
                                style={{marginLeft: '5px'}}
                              >
                                NEW
                              </span>
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/collections/short-kurtas"
                              onClick={close}
                            >
                              <img
                                src="https://cdn.shopify.com/s/files/1/0450/3476/6485/files/6309ae0851cc4c5f6751bf7b0933229f60eed077.webp?v=1752565415"
                                className="menu-img"
                                alt=""
                              />
                              Airy - Linen Short Kurta
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/collections/airy-linen-long-kurtas"
                              onClick={close}
                            >
                              <img
                                src="https://cdn.shopify.com/s/files/1/0450/3476/6485/files/2a3f853d163b6760b2f92a575e155f654091e45d.webp?v=1752565415"
                                className="menu-img"
                                alt=""
                              />
                              Airy - Linen Long Kurta
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/collections/airy-linen-shirts"
                              onClick={close}
                            >
                              <img
                                src="https://cdn.shopify.com/s/files/1/0450/3476/6485/files/11bab64671ebc246fa1d1fa6e9667c9ad27a954b.webp?v=1752565416"
                                className="menu-img"
                                alt=""
                              />
                              Airy-Linen Shirts
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/collections/v-neck-sleeveless-top"
                              onClick={close}
                            >
                              <img
                                src="https://cdn.shopify.com/s/files/1/0450/3476/6485/files/image_4.webp?v=1752565417"
                                className="menu-img"
                                alt=""
                              />
                              V-Neck Sleeveless Top
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/collections/viscose-pleated-top"
                              onClick={close}
                            >
                              <img
                                src="https://cdn.shopify.com/s/files/1/0450/3476/6485/files/image_6.webp?v=1752565415"
                                className="menu-img"
                                alt=""
                              />
                              Viscose Pleated Top
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/collections/shop-all-tops-1"
                              onClick={close}
                            >
                              <img
                                src="https://cdn.shopify.com/s/files/1/0450/3476/6485/files/image_7.webp?v=1752565415"
                                className="menu-img"
                                alt=""
                              />
                              Shop All Tops
                            </Link>
                          </li>
                        </ul>
                      )}
                    </details>
                  </li>

                  {/* All Bottoms with submenu */}
                  <li>
                    <details
                      className="sidebar-accordion-item"
                      open={expandedSubmenu === 'all-bottoms'}
                    >
                      <summary
                        className="header-sidebar__linklist-button"
                        onClick={(e) => {
                          e.preventDefault();
                          toggleSubmenu('all-bottoms');
                        }}
                      >
                        <img
                          src="https://cdn.shopify.com/s/files/1/0450/3476/6485/files/image_2.webp?v=1752564952"
                          className="menu-img"
                          alt=""
                        />
                        All Bottoms
                        <span style={{marginLeft: 'auto'}}>
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                          >
                            <path
                              d="M9 18l6-6-6-6"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                      </summary>
                      {expandedSubmenu === 'all-bottoms' && (
                        <ul className="sidebar-accordion-list">
                          <li>
                            <Link
                              to="/collections/straight-fit-formal-pants"
                              onClick={close}
                            >
                              <img
                                src="https://cdn.shopify.com/s/files/1/0450/3476/6485/files/1_10.webp?v=1753441076"
                                className="menu-img"
                                alt=""
                              />
                              Straight Fit Formal Pants
                              <span
                                className="home-nav-badge-new"
                                style={{marginLeft: '5px'}}
                              >
                                NEW
                              </span>
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/collections/airy-linen-straight-pant"
                              onClick={close}
                            >
                              <img
                                src="https://cdn.shopify.com/s/files/1/0450/3476/6485/files/1_3.webp?v=1753246195"
                                className="menu-img"
                                alt=""
                              />
                              Airy Linen Straight Pants
                              <span
                                className="home-nav-badge-new"
                                style={{marginLeft: '5px'}}
                              >
                                NEW
                              </span>
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/collections/4-way-stretchable-pants"
                              onClick={close}
                            >
                              <img
                                src="https://cdn.shopify.com/s/files/1/0450/3476/6485/files/2_2.webp?v=1753165204"
                                className="menu-img"
                                alt=""
                              />
                              4-Way Stretchable Pants
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/collections/cotton-trousers"
                              onClick={close}
                            >
                              <img
                                src="https://cdn.shopify.com/s/files/1/0450/3476/6485/files/SDCPRT.webp?v=1753165204"
                                className="menu-img"
                                alt=""
                              />
                              Everyday Cotton Pants
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/collections/viscose-palazzo-pants"
                              onClick={close}
                            >
                              <img
                                src="https://cdn.shopify.com/s/files/1/0450/3476/6485/files/3_2.webp?v=1753165204"
                                className="menu-img"
                                alt=""
                              />
                              Viscose Palazzo Pants
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/collections/wide-leg-pants"
                              onClick={close}
                            >
                              <img
                                src="https://cdn.shopify.com/s/files/1/0450/3476/6485/files/3_4.webp?v=1753165204"
                                className="menu-img"
                                alt=""
                              />
                              Wide Leg Pants
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/collections/airy-linen-wide-leg-pant"
                              onClick={close}
                            >
                              <img
                                src="https://cdn.shopify.com/s/files/1/0450/3476/6485/files/1_5_2.png?v=1753271491"
                                className="menu-img"
                                alt=""
                              />
                              Airy Linen Wide Leg Pants
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/collections/shop-all-bottoms"
                              onClick={close}
                            >
                              <img
                                src="https://cdn.shopify.com/s/files/1/0450/3476/6485/files/image_13.webp?v=1752565969"
                                className="menu-img"
                                alt=""
                              />
                              Shop All Bottoms
                            </Link>
                          </li>
                        </ul>
                      )}
                    </details>
                  </li>

                  {/* Airy Linen with submenu */}
                  <li>
                    <details
                      className="sidebar-accordion-item"
                      open={expandedSubmenu === 'airy-linen'}
                    >
                      <summary
                        className="header-sidebar__linklist-button"
                        onClick={(e) => {
                          e.preventDefault();
                          toggleSubmenu('airy-linen');
                        }}
                      >
                        <img
                          src="https://cdn.shopify.com/s/files/1/0450/3476/6485/files/image_1.webp?v=1752564952"
                          className="menu-img"
                          alt=""
                        />
                        Airy Linen
                        <span style={{marginLeft: 'auto'}}>
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                          >
                            <path
                              d="M9 18l6-6-6-6"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                      </summary>
                      {expandedSubmenu === 'airy-linen' && (
                        <ul className="sidebar-accordion-list">
                          <li>
                            <Link
                              to="/collections/airy-linen-flared-dress"
                              onClick={close}
                            >
                              <img
                                src="https://cdn.shopify.com/s/files/1/0450/3476/6485/files/1_13_e079b39b-363d-4582-8449-94e42ebd7e56.webp?v=1756378093"
                                className="menu-img"
                                alt=""
                              />
                              Airy Linen Flared Dress
                              <span
                                className="home-nav-badge-new"
                                style={{marginLeft: '5px'}}
                              >
                                NEW
                              </span>
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/collections/airy-linen-straight-pant"
                              onClick={close}
                            >
                              <img
                                src="https://cdn.shopify.com/s/files/1/0450/3476/6485/files/1_3.webp?v=1753246195"
                                className="menu-img"
                                alt=""
                              />
                              Airy Linen Straight Pants
                              <span
                                className="home-nav-badge-new"
                                style={{marginLeft: '5px'}}
                              >
                                NEW
                              </span>
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/collections/airy-linen-wide-leg-pant"
                              onClick={close}
                            >
                              <img
                                src="https://cdn.shopify.com/s/files/1/0450/3476/6485/files/1_5_2.png?v=1753271491"
                                className="menu-img"
                                alt=""
                              />
                              Airy Linen Wide Leg Pants
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/collections/short-kurtas"
                              onClick={close}
                            >
                              <img
                                src="https://cdn.shopify.com/s/files/1/0450/3476/6485/files/6309ae0851cc4c5f6751bf7b0933229f60eed077.webp?v=1752565415"
                                className="menu-img"
                                alt=""
                              />
                              Airy-Linen Short Kurtas
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/collections/airy-linen-long-kurtas"
                              onClick={close}
                            >
                              <img
                                src="https://cdn.shopify.com/s/files/1/0450/3476/6485/files/2a3f853d163b6760b2f92a575e155f654091e45d.webp?v=1752565415"
                                className="menu-img"
                                alt=""
                              />
                              Airy Linen Long Kurtas
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/collections/airy-linen-shirts"
                              onClick={close}
                            >
                              <img
                                src="https://cdn.shopify.com/s/files/1/0450/3476/6485/files/11bab64671ebc246fa1d1fa6e9667c9ad27a954b.webp?v=1752565416"
                                className="menu-img"
                                alt=""
                              />
                              Airy-Linen Shirts
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/collections/shop-airy-linen"
                              onClick={close}
                            >
                              <img
                                src="https://cdn.shopify.com/s/files/1/0450/3476/6485/files/image_7.webp?v=1752565415"
                                className="menu-img"
                                alt=""
                              />
                              Shop All Airy Linen Products
                            </Link>
                          </li>
                        </ul>
                      )}
                    </details>
                  </li>

                  {/* All Whites - Simple Link */}
                  <li>
                    <Link
                      to="/collections/all-whites"
                      onClick={close}
                      className="header-sidebar__linklist-button"
                      style={{padding: '0px 3px', margin: '8px 0px'}}
                    >
                      <img
                        src="https://cdn.shopify.com/s/files/1/0450/3476/6485/files/download.webp?v=1752564952"
                        className="menu-img"
                        alt=""
                      />
                      All Whites
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* SHOP MEN - Main Accordion */}
          <div
            className="header-sidebar__group-list saadaa-accordion-section"
            id="accordion-shop-men"
            data-main
          >
            <button
              className="saadaa-accordion-title"
              data-main
              onClick={() => toggleMainSection('shop-men')}
            >
              SHOP MEN{' '}
              <span className="icon">
                {expandedSection === 'shop-men' ? '−' : '+'}
              </span>
            </button>
            {expandedSection === 'shop-men' && (
              <div className="saadaa-accordion-content">
                <ul className="header-sidebar__linklist unstyled-list">
                  <li>
                    <Link
                      to="/collections/men-cotton-pant"
                      onClick={close}
                      className="header-sidebar__linklist-button"
                    >
                      <img
                        src="https://cdn.shopify.com/s/files/1/0450/3476/6485/files/1_12_d76e65a2-1a5e-48cb-a523-1b450e5b4e28.webp?v=1756377574"
                        className="menu-img"
                        alt=""
                      />
                      Men Cotton Pant
                      <span
                        className="home-nav-badge-new"
                        style={{marginLeft: '5px'}}
                      >
                        NEW
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/collections/men-linen-full-sleeve-shirts"
                      onClick={close}
                      className="header-sidebar__linklist-button"
                    >
                      <img
                        src="https://cdn.shopify.com/s/files/1/0450/3476/6485/files/1_21.webp?v=1759348452"
                        className="menu-img"
                        alt=""
                      />
                      Pure Linen Full Sleeve Shirt
                      <span
                        className="home-nav-badge-new"
                        style={{marginLeft: '5px'}}
                      >
                        NEW
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/collections/men-linen-short-sleeve-shirts"
                      onClick={close}
                      className="header-sidebar__linklist-button"
                    >
                      <img
                        src="https://cdn.shopify.com/s/files/1/0450/3476/6485/files/1_22.webp?v=1759348452"
                        className="menu-img"
                        alt=""
                      />
                      Pure Linen Short Sleeve Shirt
                      <span
                        className="home-nav-badge-new"
                        style={{marginLeft: '5px'}}
                      >
                        NEW
                      </span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/collections/airy-linen-long-kurtas-1"
                      onClick={close}
                      className="header-sidebar__linklist-button"
                    >
                      <img
                        src="https://cdn.shopify.com/s/files/1/0450/3476/6485/files/RK_3628.webp?v=1753165931"
                        className="menu-img"
                        alt=""
                      />
                      Airy Linen Long Kurta
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/collections/airy-linen-short-kurtas"
                      onClick={close}
                      className="header-sidebar__linklist-button"
                    >
                      <img
                        src="https://cdn.shopify.com/s/files/1/0450/3476/6485/files/RK_4565_2.webp?v=1753272743"
                        className="menu-img"
                        alt=""
                      />
                      Airy Linen Short Kurta
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/collections/men"
                      onClick={close}
                      className="header-sidebar__linklist-button"
                    >
                      <img
                        src="https://cdn.shopify.com/s/files/1/0450/3476/6485/files/RK_3355_1.png?v=1753271493"
                        className="menu-img"
                        alt=""
                      />
                      Shop All
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* SECONDARY LINKS */}
          <div className="header-sidebar__group-list">
            <div className="saadaa-accordion-section">
              <Link to="/collections/shop-the-look" onClick={close}>
                <button className="saadaa-accordion-title">
                  BUNDLES<span className="home-nav-badge-new">NEW</span>
                </button>
              </Link>
            </div>

            <div className="saadaa-accordion-section">
              <Link to="/collections/plus-edition" onClick={close}>
                <button className="saadaa-accordion-title">
                  PLUS EDITION <span className="home-nav-badge-new">NEW</span>
                </button>
              </Link>
            </div>

            <div className="saadaa-accordion-section">
              <Link to="/collections/goodbye-edition" onClick={close}>
                <button className="saadaa-accordion-title">
                  THE GOODBYE EDITION
                </button>
              </Link>
            </div>

            <div className="saadaa-accordion-section">
              <Link to="https://saadaa.in/pages/new-customers" onClick={close}>
                <button className="saadaa-accordion-title">
                  NEW CUSTOMERS
                </button>
              </Link>
            </div>

            <div className="saadaa-accordion-section">
              <Link to="/collections/best-sellers-women" onClick={close}>
                <button className="saadaa-accordion-title">
                  BUILD YOUR WARDROBE
                </button>
              </Link>
            </div>

            <div className="saadaa-accordion-section">
              <Link to="https://saadaa.in/apps/return_prime" onClick={close}>
                <button className="saadaa-accordion-title">
                  RETURN & EXCHANGE
                </button>
              </Link>
            </div>

            <div className="saadaa-accordion-section">
              <Link to="https://saadaa.in/pages/work-with-us" onClick={close}>
                <button className="saadaa-accordion-title">CAREER</button>
              </Link>
            </div>

            {/* KNOW US BETTER - Expandable */}
            <div className="saadaa-accordion-section">
              <button
                className="saadaa-accordion-title"
                onClick={() => toggleSecondary('know-us')}
              >
                KNOW US BETTER{' '}
                <span className="icon">
                  {expandedSecondary === 'know-us' ? '−' : '+'}
                </span>
              </button>
              {expandedSecondary === 'know-us' && (
                <div
                  className="saadaa-accordion-content"
                  style={{lineHeight: '32px'}}
                >
                  <Link to="https://saadaa.in/pages/about-us" onClick={close}>
                    About Us
                  </Link>
                  <br />
                  <Link to="https://saadaa.in/pages/contact-us" onClick={close}>
                    Contact Us
                  </Link>
                  <br />
                  <Link to="https://saadaa.in/pages/our-store" onClick={close}>
                    Our Store
                  </Link>
                  <br />
                  <Link
                    to="https://saadaa.in/pages/our-journey"
                    onClick={close}
                  >
                    Our Journey
                  </Link>
                </div>
              )}
            </div>

            {/* THE STORY WE SHARE - Expandable */}
            <div className="saadaa-accordion-section">
              <button
                className="saadaa-accordion-title"
                onClick={() => toggleSecondary('story')}
              >
                THE STORY WE SHARE{' '}
                <span className="icon">
                  {expandedSecondary === 'story' ? '−' : '+'}
                </span>
              </button>
              {expandedSecondary === 'story' && (
                <div
                  className="saadaa-accordion-content"
                  style={{lineHeight: '32px'}}
                >
                  <Link
                    to="https://saadaa.in/pages/transparency-page"
                    onClick={close}
                  >
                    Transparency Matters
                  </Link>
                  <br />
                  <Link to="https://saadaa.in/pages/reviews" onClick={close}>
                    Reviews
                  </Link>
                </div>
              )}
            </div>

            {/* COLLABORATE WITH US - Expandable */}
            <div className="saadaa-accordion-section">
              <button
                className="saadaa-accordion-title"
                onClick={() => toggleSecondary('collaborate')}
              >
                COLLABORATE WITH US{' '}
                <span className="icon">
                  {expandedSecondary === 'collaborate' ? '−' : '+'}
                </span>
              </button>
              {expandedSecondary === 'collaborate' && (
                <div
                  className="saadaa-accordion-content"
                  style={{lineHeight: '32px'}}
                >
                  <Link
                    to="https://saadaa.in/pages/franchise-onboarding"
                    onClick={close}
                  >
                    Saadaa Franchise
                  </Link>
                  <br />
                  <Link
                    to="https://saadaa.in/pages/b2b-bulk-enquiries-form"
                    onClick={close}
                  >
                    For B2b/ Bulk Enquiries
                  </Link>
                  <br />
                  <Link
                    to="https://saadaa.in/pages/vendor-onboarding"
                    onClick={close}
                  >
                    Partner as Supplier
                  </Link>
                  <br />
                  <Link to="https://saadaa.in/pages/creators" onClick={close}>
                    Saadaa Kalakaar
                  </Link>
                  <br />
                  <Link to="https://saadaa.in/pages/uniform" onClick={close}>
                    The Collective Thread
                  </Link>
                </div>
              )}
            </div>

            <div className="saadaa-accordion-section">
              <Link to="https://saadaa.in/pages/community" onClick={close}>
                <button className="saadaa-accordion-title">
                  SAADAA COMMUNITY
                </button>
              </Link>
            </div>

            <div className="saadaa-accordion-section">
              <Link to="https://saadaa.in/pages/wash-care" onClick={close}>
                <button className="saadaa-accordion-title">WASH CARE</button>
              </Link>
            </div>
          </div>
        </div>

        {/* STICKY FOOTER: Trust Badge */}
        <div className="saadaa-sticky-bottom">
          <div
            className="trust-badge trust-badge--stack"
            role="complementary"
            aria-label="Loved by six lakh customers"
          >
            <div className="trust-badge__stars" aria-hidden="true">
              <svg viewBox="0 0 24 24" className="star">
                <path d="M12 2.5l2.9 6 6.6.6-5 4.4 1.5 6.4L12 16.9 6 19.9l1.5-6.4-5-4.4 6.6-.6L12 2.5z" />
              </svg>
              <svg viewBox="0 0 24 24" className="star">
                <path d="M12 2.5l2.9 6 6.6.6-5 4.4 1.5 6.4L12 16.9 6 19.9l1.5-6.4-5-4.4 6.6-.6L12 2.5z" />
              </svg>
              <svg viewBox="0 0 24 24" className="star">
                <path d="M12 2.5l2.9 6 6.6.6-5 4.4 1.5 6.4L12 16.9 6 19.9l1.5-6.4-5-4.4 6.6-.6L12 2.5z" />
              </svg>
              <svg viewBox="0 0 24 24" className="star">
                <path d="M12 2.5l2.9 6 6.6.6-5 4.4 1.5 6.4L12 16.9 6 19.9l1.5-6.4-5-4.4 6.6-.6L12 2.5z" />
              </svg>
              <svg viewBox="0 0 24 24" className="star">
                <path d="M12 2.5l2.9 6 6.6.6-5 4.4 1.5 6.4L12 16.9 6 19.9l1.5-6.4-5-4.4 6.6-.6L12 2.5z" />
              </svg>
            </div>
            <span className="trust-badge__text">
              Loved by 6,00,000+ customers
            </span>
          </div>
        </div>
      </div>
    </Aside>
  );
}
