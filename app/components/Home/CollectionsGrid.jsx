// app/components/CollectionsGrid.jsx
import  { useEffect, useState } from "react";

/**
 * CollectionsGrid
 *
 * Props:
 *  - productsByCategory?: { bottoms:[], bestsellers:[], newArrival:[], tops:[] }
 *  - collectionLinks?: { bottoms, bestsellers, newArrival, tops }
 *  - defaultTab?: "bottoms" | "bestsellers" | "newArrival" | "tops"
 *  - itemsPerCategory?: number (not used for static fallback)
 *
 * Behavior:
 *  - If productsByCategory is provided it will be used for tab content.
 *  - Otherwise uses an internal static dataset (taken from the HTML you pasted).
 *  - Uses classNames from your CSS (cg-root, cg-tabs, cg-tab, cg-grid, cg-card, cg-thumb, cg-name, cg-viewall-btn).
 */

const DEFAULT_LINKS = {
  bottoms: "/collections/shop-all-bottoms",
  bestsellers: "/collections/best-sellers-women",
  newArrival: "/collections/new-arrivals-women",
  tops: "/collections/shop-all-tops-1",
};

const STATIC_DATA = {
  bottoms: [
    {
      id: "b1",
      title: "Straight Fit Formal Pants",
      img:
        "https://cdn.shopify.com/s/files/1/0450/3476/6485/files/SDSSPWH_1_8a23a213-e9ff-4ca5-a052-8208ccb3ea30.webp?v=1753438133",
      url: "/products/white-straight-fit-formal-pants",
      badge:true
    },
    {
      id: "b2",
      title: "Airy Linen Straight Pants",
      img:"https://cdn.shopify.com/s/files/1/0450/3476/6485/files/1_f6b25854-3d8a-4042-8fa9-05388d3356ad_1.webp?v=1758017007",
      url: "/products/black-airy-linen-straight-pants",
      badge:true
    },
    {
      id: "b3",
      title: "Airy Linen Wide Leg Pants",
      img:
        "https://cdn.shopify.com/s/files/1/0450/3476/6485/files/1_9251d01d-9fbe-4474-aac5-bc2a20c847a5.webp?v=1756096682",
      url: "/products/women-coffee-brown-airy-linen-wide-leg-pant",
      badge:true
    },
    {
      id: "b4",
      title: "4-Way Stretchable Pants",
      img:
        "https://cdn.shopify.com/s/files/1/0450/3476/6485/files/6_17bf1b01-c39e-42de-b4fe-6fe3b28a036f.jpg?v=1744191968",
      url: "/products/ash-4-way-stretchable-pants",
    },
    {
      id: "b5",
      title: "Women Everyday Cotton Pants",
      img:
        "https://cdn.shopify.com/s/files/1/0450/3476/6485/files/SDCPRTRoseTaupe_1_98f96bd0-b954-4ae8-bf62-6d3ba2c0c67f.jpg?v=1744191968",
      url: "/products/salmon-pink-solid-regular-fit-cotton-trouser",
    },
    {
      id: "b6",
      title: "Viscose Palazzo Pants",
      img:
        "https://cdn.shopify.com/s/files/1/0450/3476/6485/files/1_091a3f84-383b-4be2-9537-940997cb565b.jpg?v=1744191968",
      url: "/products/english-blue-viscose-palazzo-pant",
    },
  ],
  bestsellers: [
    {
      id: "bs1",
      title: "Women Black Cotton Pant",
      img:
        "https://cdn.shopify.com/s/files/1/0450/3476/6485/files/1_3d5f7f38-fdfb-4dc9-b2e5-6d809faf345c_1.webp?v=1757741992",
      url: "/products/black-solid-regular-fit-cotton-trouser",
    },
    {
      id: "bs2",
      title: "Women White Cotton Pant",
      img:
        "https://cdn.shopify.com/s/files/1/0450/3476/6485/files/1_e8db68e9-6645-4e74-93a1-b723ba6383c0.webp?v=1757741964",
      url: "/products/white-solid-regular-fit-cotton-trouser",
    },
    {
      id: "bs3",
      title: "Women Beige Cotton Pant",
      img:
        "https://cdn.shopify.com/s/files/1/0450/3476/6485/files/1_503e78e0-74b0-4bba-bd56-a1a0e4dbc749.webp?v=1757740451",
      url: "/products/beige-solid-regular-fit-cotton-trouser",
    },
    {
      id: "bs4",
      title: "Women Grey Cotton Pant",
      img:
        "https://cdn.shopify.com/s/files/1/0450/3476/6485/files/1_dcdc96b4-3594-4162-925c-538aeeeac0cd.webp?v=1757741749",
      url: "/products/grey-solid-regular-fit-cotton-trouser",
    },
    {
      id: "bs5",
      title: "Women Rose Taupe Cotton Pant",
      img:
        "https://cdn.shopify.com/s/files/1/0450/3476/6485/files/1_0df572e2-bb3d-4115-ba13-0ed728c3d756.webp?v=1757740034",
      url: "/products/rose-taupe-solid-regular-fit-cotton-trouser",
    },
  ],
  newArrival: [
    {
      id: "n1",
      title: "Women Nude Cotton Camisole Top",
      img:
        "https://cdn.shopify.com/s/files/1/0450/3476/6485/files/1.1_a6068d14-0bec-450a-a81f-e0113f09334d.webp?v=1759308050",
      url: "/products/women-nude-cotton-camisole-top",
      badgePill: true
    },
    {
      id: "n2",
      title: "Women White Cotton Camisole Top",
      img:
        "https://cdn.shopify.com/s/files/1/0450/3476/6485/files/1.1_48f27e5f-9102-4cfc-802d-260bd456a5d2.webp?v=1759308490",
      url: "/products/women-white-cotton-camisole-top",
      badgePill: true
    },
    {
      id: "n3",
      title: "Women Light Pink Pure Linen Notch Collar Shirt",
      img:
        "https://cdn.shopify.com/s/files/1/0450/3476/6485/files/1.1_5712a4f1-ee82-477e-acef-14583c4d2268.webp?v=1759310179",
      url: "/products/women-light-pink-100-linen-notch-collar-shirt",
      badgePill: true
    },
    {
      id: "n4",
      title: "Women Light Blue Pure Linen Shirt",
      img:
        "https://cdn.shopify.com/s/files/1/0450/3476/6485/files/1.1_66e49a98-2812-4f2e-9a99-9750b65ef119.webp?v=1759310212",
      url: "/products/women-light-blue-100-linen-notch-collar-shirt",
      badgePill: true
    },
    {
      id: "n5",
      title: "Women Taupe Pure Linen Notch Collar Shirt",
      img:
        "https://cdn.shopify.com/s/files/1/0450/3476/6485/files/1.1_a8dbbbf1-9d3e-4e30-b32b-847ca587ee6e.webp?v=1759310253",
      url: "/products/women-taupe-100-linen-notch-collar-shirt",
      badgePill: true
    },
  ],
  tops: [
    {
      id: "t1",
      title: "Airy-Linen Shirts",
      img:
        "https://cdn.shopify.com/s/files/1/0450/3476/6485/files/2_6_dcc6f159-78b7-4825-ba35-2c05addabe9a.webp?v=1755075659",
      url: "/products/airy-linen-shirts",
      badge:true
    },
    {
      id: "t2",
      title: "Airy-Linen Short Kurtas",
      img:
        "https://cdn.shopify.com/s/files/1/0450/3476/6485/files/2_3f9fc794-7a8c-48c3-aaca-537979b99360.webp?v=1755075553",
      url: "/products/airy-linen-short-kurtas",
      badge:true
    },
    {
      id: "t3",
      title: "V-Neck Sleeveless Top",
      img:
        "https://cdn.shopify.com/s/files/1/0450/3476/6485/files/1_da9b5812-9dc7-40fd-8f33-0b0a6174bd9e.webp?v=1755075698",
      url: "/products/v-neck-sleeveless-top",
      badge:true
    },
    {
      id: "t4",
      title: "Everyday Cotton Top",
      img:
        "https://cdn.shopify.com/s/files/1/0450/3476/6485/files/1_f152eb87-f90c-4dd9-9b8d-b52f76997931.webp?v=1755075747",
      url: "/products/everyday-cotton-tops",
      badge:true
    },
    {
      id: "t5",
      title: "Viscose Pleated Top",
      img:
        "https://cdn.shopify.com/s/files/1/0450/3476/6485/files/3_ec699e96-a75a-44d5-9e15-9fba6b063911.webp?v=1755075773",
      url: "/products/viscose-pleated-top",
    },
  ],
};

export function CollectionsGrid({
  productsByCategory = null,
  collectionLinks = DEFAULT_LINKS,
  defaultTab = "bottoms",
  itemsPerCategory = 12,
}) {
  const tabs = [
    { key: "bottoms", label: "Bottom Wear" },
    { key: "bestsellers", label: "Best Sellers" },
    { key: "newArrival", label: "New Arrival" },
    { key: "tops", label: "Top Wear" },
  ];

  const [active, setActive] = useState(defaultTab);
  const [items, setItems] = useState(
    productsByCategory?.[defaultTab] ?? STATIC_DATA[defaultTab] ?? []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // If parent passes productsByCategory later, pick them up
  useEffect(() => {
    if (!productsByCategory) return;
    if (productsByCategory[active]) {
      setItems(productsByCategory[active]);
      setLoading(false);
      setError(null);
    }
  }, [productsByCategory, active]);

  // when active tab changes
  useEffect(() => {
    setError(null);
    setLoading(false);

    // prefer props data, otherwise static fallback
    if (productsByCategory && productsByCategory[active]) {
      setItems(productsByCategory[active]);
      return;
    }
    if (STATIC_DATA[active]) {
      setItems(STATIC_DATA[active].slice(0, itemsPerCategory));
      return;
    }

    // If neither, show empty — you could wire a fetch here to storefront API
    setItems([]);
  }, [active, productsByCategory, itemsPerCategory]);

  const onTabClick = (key) => {
    setActive(key);
  };

  const onViewAll = () => {
    // prefer collectionLinks prop; fallback to default path pattern
    const link =
      collectionLinks?.[active] ||
      (active === "bottoms"
        ? "/collections/shop-all-bottoms"
        : active === "bestsellers"
        ? "/collections/best-sellers-women"
        : active === "newArrival"
        ? "/collections/new-arrivals-women"
        : "/collections/shop-all-tops-1");

    // client-side navigation inside Hydrogen could use <Link/> but simple redirect works here
    window.location.href = link;
  };

  return (
    <section className="cg-root" aria-labelledby="collections-heading">
      <div className="container cg-inner">
        <div className="cg-header">
          <div
            className="cg-tabs"
            role="tablist"
            aria-label="Collections tabs"
          >
            {tabs.map((t) => (
              <button
                key={t.key}
                role="tab"
                aria-selected={active === t.key}
                aria-controls={`panel-${t.key}`}
                id={`tab-${t.key}`}
                tabIndex={active === t.key ? 0 : -1}
                className={`cg-tab ${active === t.key ? "active" : ""}`}
                onClick={() => onTabClick(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div
          className="cg-grid"
          role="region"
          aria-live="polite"
          aria-atomic="false"
        >
          {loading ? (
            <div className="cg-loading">Loading…</div>
          ) : error ? (
            <div className="cg-error">Error: {error}</div>
          ) : items.length === 0 ? (
            <div className="cg-empty">No items found</div>
          ) : (
            items.map((p) => (
              <article
                key={p.id}
                className="cg-card"
                role="listitem"
                aria-labelledby={`item-${p.id}-title`}
              >
                <a href={p.url || "#"} className="cg-thumb" aria-hidden={false}>
                  {/* lazy loading + width/height for better layout stability */}
                  <img
                    src={p.img}
                    alt={p.title}
                    loading="lazy"
                    decoding="async"
                    style={{ width: "100%", height: "300px", objectFit: "cover" }}
                  />
                </a>
                <div id={`item-${p.id}-title`} className="cg-name">
                  {p.title}
                </div>
                {(active === "bottoms" && p.badge === true) && <span className="product-badge-dot badge-bob" aria-hidden="true"></span>}
                {(active === "newArrival" && p.badgePill === true) && <span className="product-badge-pill" aria-hidden="true">NEW</span>}
                {(active === "tops" && p.badge === true) && <span className="product-badge-dot" aria-hidden="true"></span>}
              </article>
            ))
          )}
        </div>

        <div className="cg-viewall">
          <button className="cg-viewall-btn" onClick={onViewAll}>
            VIEW ALL →
          </button>
        </div>
      </div>
    </section>
  );
}