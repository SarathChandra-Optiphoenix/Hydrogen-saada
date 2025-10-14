// app/routes/($locale).products.$handle.jsx
import {useEffect} from 'react';
import {useLoaderData} from 'react-router';
import {getSelectedProductOptions} from '@shopify/hydrogen';
import {gaEvent, toGAItem} from '~/utils/ga';
import {ProductMain} from '../components/ProductMain';

export async function loader({context, params, request}) {
  const {handle} = params;
  const {storefront} = context;
  if (!handle) throw new Response('Missing handle', {status: 400});

  const selectedOptions = getSelectedProductOptions(request);
  const data = await storefront.query(PRODUCT_QUERY, {
    variables: {handle, selectedOptions},
  });

  if (!data?.product?.id) throw new Response('Product not found', {status: 404});

  return {product: data.product};
}

export default function Product() {
  const {product} = useLoaderData();

  // ===== GA4: PDP view =====
  useEffect(() => {
    if (!product) return;
    const v =
      product.selectedOrFirstAvailableVariant ||
      product.adjacentVariants?.[0] ||
      null;

    const currency =
      v?.price?.currencyCode ||
      product?.priceRange?.minVariantPrice?.currencyCode ||
      'INR';

    const value =
      Number(v?.price?.amount ??
        product?.priceRange?.minVariantPrice?.amount ??
        0);

    gaEvent('view_item', {
      currency,
      value,
      items: [toGAItem(product, v, 1)],
    });
  }, [product]);

  // Expose an add-to-cart tracker for ProductMain to call AFTER mutation success
  function onAddToCartTracked(variant, quantity = 1) {
    const item = toGAItem(product, variant, quantity);
    gaEvent('add_to_cart', {
      currency: variant?.price?.currencyCode || 'INR',
      value: Number(variant?.price?.amount || 0) * quantity,
      items: [item],
    });
  }

  return <ProductMain product={product} onAddToCartTracked={onAddToCartTracked} />;
}

const PRODUCT_QUERY = `#graphql
 query Product(
 $country: CountryCode
 $language: LanguageCode
 $handle: String!
 $selectedOptions: [SelectedOptionInput!]!
 ) @inContext(country: $country, language: $language) {
 product(handle: $handle) {
 ...Product
 collections(first: 2) {
 nodes {
 id
 handle
 title
 metafields(identifiers: [
 {namespace: "custom", key: "free_shipping_text"},
 {namespace: "custom", key: "exchange_return_text"},
 {namespace: "custom", key: "offer_image"}
 ]) {
 key
 value
 type
 reference {
 ... on MediaImage {
 id
 image {
 id
 url
 width
 height
 altText
 }
 }
 }
 references(first: 10) {
 nodes {
 ... on MediaImage {
 id
 image {
 id
 url
 width
 height
 altText
 }
 }
 }
 }
 }
 # Get all products from collection for color matching
 products(first: 50) {
 nodes {
 id
 handle
 title
 tags
 featuredImage {
 url
 altText
 width
 height
 }
 priceRange {
 minVariantPrice {
 amount
 currencyCode
 }
 }
 }
 }
 }
 }
 metafields(identifiers: [
 {namespace: "custom", key: "product_specification"},
 {namespace: "custom", key: "style_with_product"},
 ]) {
 key
 value
 type
 reference {
 ... on Metaobject {
 type
 fields {
 key
 value
 }
 }
 ... on Product {
 id
 handle
 title
 images(first: 1) {
 nodes {
 id
 url
 altText
 width
 height
 }
 }
 }
 }
 references(first: 5) {
 nodes {
 ... on Product {
 id
 handle
 title
 images(first: 1) {
 nodes {
 id
 url
 width
 height
 altText
 }
 }
 }
 }
 }
 }
 }
 
 # Query all color metaobjects
 metaobjects(type: "color", first: 50) {
 nodes {
 id
 handle
 type
 fields {
 key
 value
 reference {
 ... on MediaImage {
 image {
 url
 altText
 width
 height
 }
 }
 }
 }
 }
 }
 }
 
 fragment Product on Product {
 id
 title
 handle
 vendor
 descriptionHtml
 description
 tags
 encodedVariantExistence
 encodedVariantAvailability
 images(first: 10) {
 nodes { id url altText width height }
 }
 options {
 name
 optionValues {
 name
 firstSelectableVariant {
 ...ProductVariant
 }
 }
 }
 selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true) {
 ...ProductVariant
 }
 adjacentVariants(selectedOptions: $selectedOptions) {
 ...ProductVariant
 }
 seo {
 title
 description
 }
 }
 
 fragment ProductVariant on ProductVariant {
 id
 title
 availableForSale
 sku
 image {
 id
 url
 altText
 width
 height
 }
 price {
 amount
 currencyCode
 }
 compareAtPrice {
 amount
 currencyCode
 }
 selectedOptions {
 name
 value
 }
 product { handle }
 }
`;
