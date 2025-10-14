// app/components/ProductHighlights.jsx
import {useMemo} from 'react';

const TAG = '[pdp:highlights]';
const MAX_ROWS = 12;

/**
 * Extracts product specification from metafields
 * Returns array of [key, value] pairs
 */
function extractFromMetafields(product) {
  try {
    // Find the product_specification metafield
    const specMetafield = (product?.metafields || []).find(
      (mf) => mf?.key === 'product_specification',
    );

    if (!specMetafield?.reference?.fields) {
      return [];
    }

    const fields = specMetafield.reference.fields;
    const pairs = [];

    // Extract key-value pairs (ps_key_1 -> ps_value_1, etc.)
    for (let i = 1; i <= MAX_ROWS; i++) {
      const keyField = fields.find((f) => f?.key === `ps_key_${i}`);
      const valueField = fields.find((f) => f?.key === `ps_value_${i}`);

      const key = keyField?.value?.trim();
      const value = valueField?.value?.trim();

      if (key && value) {
        pairs.push([key, value]);
      }
    }

    return pairs;
  } catch (e) {
    console.warn(`${TAG} failed to extract metafields`, e);
    return [];
  }
}

/**
 * SSR-safe parser: pulls <li>...</li>, strips tags, returns ["Key: Value", ...]
 */
function extractLiText(descriptionHtml = '') {
  if (typeof descriptionHtml !== 'string' || !descriptionHtml) return [];

  try {
    const liMatches = [...descriptionHtml.matchAll(/<li[^>]*>(.*?)<\/li>/gis)];
    return liMatches
      .map((m) =>
        m[1]
          .replace(/<[^>]+>/g, '') // strip nested tags
          .replace(/&amp;/g, '&')
          .replace(/&nbsp;/g, ' ')
          .replace(/\s+/g, ' ')
          .trim(),
      )
      .filter(Boolean);
  } catch (e) {
    console.warn(`${TAG} failed to parse descriptionHtml`, e);
    return [];
  }
}

/**
 * Turns "Key: Value" into [key, value] pairs, with validation + dedupe
 */
function toPairs(lines) {
  const seen = new Set();
  const out = [];

  for (const line of lines) {
    const idx = line.indexOf(':');
    if (idx <= 0) continue; // must have "key: value"

    const key = line.slice(0, idx).trim();
    const val = line.slice(idx + 1).trim();

    if (!key || !val) continue;

    // basic sanity: avoid insanely long keys/values
    if (key.length > 60 || val.length > 400) continue;

    const sig = `${key.toLowerCase()}|${val.toLowerCase()}`;
    if (seen.has(sig)) continue;

    seen.add(sig);
    out.push([key, val]);

    if (out.length >= MAX_ROWS) break;
  }

  return out;
}

export function ProductHighlights({product}) {
  const rows = useMemo(() => {
    // ---- A) metafields first (strictly validated) ----
    const metaPairs = extractFromMetafields(product);

    if (metaPairs.length) {
      return metaPairs;
    }

    // ---- B) fallback: parse product.descriptionHtml ----
    const lines = extractLiText(product?.descriptionHtml || '');
    const descPairs = toPairs(lines);

    if (descPairs.length) {
      return descPairs;
    }

    // ---- C) last resort: try plain-text bullets from product.description ----
    const altLines = Array.isArray(product?.description)
      ? product.description
      : (product?.description || '')
          .split(/\n+/)
          .map((s) => s.trim())
          .filter(Boolean);

    const altPairs = toPairs(altLines);

    if (!altPairs.length) {
      console.warn(`${TAG} no highlights from metafields or description`);
    }

    return altPairs;
  }, [product?.metafields, product?.descriptionHtml, product?.description]);

  // render guard
  if (!Array.isArray(rows) || rows.length === 0) return null;

  return (
    <div className="product-highlights" id="product_description">
      <h1 className="ps_heading">Key Highlights</h1>
      <div className="product_specification_detail">
        {rows.map(([key, value], idx) => (
          <div key={`${key}-${idx}`} className="ps_box">
            <div className="ps_key">{key}</div>
            <div className="ps_value">{value}</div>
          </div>
        ))}
      </div>

      <div className="ps_disclaimer">
        <b>
          Disclaimer: There might be a slight variation in the actual color of
          the product due to different screen resolutions.
        </b>
      </div>
    </div>
  );
}
