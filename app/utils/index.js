import {useMemo} from 'react';

/** ---------- Badges ---------- **/
export function getProductBadges(product) {
  if (!product) return [];
  const tags = product?.tags || [];
  const badges = [];

  const publishedAt = product?.publishedAt ? new Date(product.publishedAt) : null;
  const daysSincePublished = publishedAt
    ? (Date.now() - publishedAt.getTime()) / (1000 * 60 * 60 * 24)
    : Infinity;

  if (tags.includes('new_launch') || tags.includes('new_color')) {
    badges.push({text: 'NEW LAUNCH', background: '#22c55e', textColor: '#0a0a0a'});
  } else if (tags.includes('pre_launch')) {
    badges.push({text: 'PRE LAUNCH', background: '#22c55e', textColor: '#0a0a0a'});
  } else if (daysSincePublished <= 14 || tags.includes('Badges__New')) {
    badges.push({text: 'NEW', background: '#22c55e', textColor: '#0a0a0a'});
  }

  if (tags.includes('community_exclusive')) {
    badges.push({text: 'COMMUNITY EXCLUSIVE', background: '#facc15', textColor: '#111827'});
  }
  if (tags.includes('Badges__BEST-SELLER')) {
    badges.push({text: 'BEST-SELLER', background: '#facc15', textColor: '#111827'});
  }
  return badges;
}

/** ---------- Category helpers ---------- **/
export function normalizeCat(str = '') {
  // trim, collapse internal whitespace, lowercase
  return String(str).trim().replace(/\s+/g, ' ').toLowerCase();
}

export function getCategoryFromProduct(product) {
  // Access the categoryName metafield value (matches the GraphQL alias)
  return product?.categoryName?.value?.trim() || null;
}

export function getCategoryImage(product) {
  // Prefer custom media reference; fallback to featured image
  const ref = product?.categoryImage?.reference;
  if (!ref) return product?.featuredImage?.url || null;
  if(ref?.image?.url) return ref.image.url;
  if(ref?.url) return ref.url;
  return product?.featuredImage?.url || null;
}

/**
 * Build a Map<normalizedLabel, imageUrl> for the category circle row.
 * Use like: const thumbs = useCategoryThumbs(products)
 */
export const useCategoryThumbs = (products) =>
  useMemo(() => {
    const map = new Map();
    for (const p of products || []) {
      const raw = getCategoryFromProduct(p);
      const img = getCategoryImage(p);
      if (!raw || !img) continue;

      const key = normalizeCat(raw);
      if (!map.has(key)) map.set(key, img);
    }
    return map;
  }, [products]);