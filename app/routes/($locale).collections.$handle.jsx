import {redirect, useLoaderData} from 'react-router';
import {Analytics} from '@shopify/hydrogen';
import CollectionMain from '~/components/CollectionMain';
import {PRODUCT_ITEM_FRAGMENT} from '../lib/fragments';

/* -------------------- meta -------------------- */
export const meta = ({data}) => [
  {title: `${data?.collection?.title ?? 'Collection'} | SAADAA`},
];

/* -------------------- loader -------------------- */
export async function loader({context, params, request}) {
  const {handle} = params;
  if (!handle) throw redirect('/collections');
  
  const {storefront} = context;
  const url = new URL(request.url);
  
  // Extract filter and sort parameters from URL
  const sortKey = url.searchParams.get('sort_by') || 'manual';
  const reverse = getSortReverse(sortKey);
  const sortKeyGraphQL = getSortKeyGraphQL(sortKey);
  
  // Build filters array from URL
  const filters = buildFiltersFromURL(url.searchParams);
  
  // Fetch all products at once
  const allProducts = await fetchAllProducts(storefront, handle, filters, sortKeyGraphQL, reverse);
  
  if (!allProducts.collection) {
    throw new Response(`Collection ${handle} not found`, {status: 404});
  }
  
  return {collection: allProducts.collection};
}

/* -------------------- Fetch All Products -------------------- */
async function fetchAllProducts(storefront, handle, filters, sortKey, reverse) {
  let allProductNodes = [];
  let hasNextPage = true;
  let endCursor = null;
  let collectionData = null;

  while (hasNextPage) {
    const {collection} = await storefront.query(COLLECTION_QUERY, {
      variables: {
        handle,
        first: 250, // Fetch 250 products per request
        after: endCursor,
        filters,
        sortKey,
        reverse,
      },
    });

    if (!collectionData) {
      collectionData = collection;
    }

    allProductNodes = [...allProductNodes, ...collection.products.nodes];
    hasNextPage = collection.products.pageInfo.hasNextPage;
    endCursor = collection.products.pageInfo.endCursor;
  }

  // Return collection with all products
  return {
    collection: {
      ...collectionData,
      products: {
        ...collectionData.products,
        nodes: allProductNodes,
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
        },
      },
    },
  };
}

/* -------------------- Helper Functions -------------------- */

/**
 * Convert frontend sort value to GraphQL sortKey
 */
function getSortKeyGraphQL(sortBy) {
  const sortMap = {
    'manual': 'MANUAL',
    'best-selling': 'BEST_SELLING',
    'title-ascending': 'TITLE',
    'title-descending': 'TITLE',
    'price-ascending': 'PRICE',
    'price-descending': 'PRICE',
    'created-ascending': 'CREATED',
    'created-descending': 'CREATED',
  };
  return sortMap[sortBy] || 'MANUAL';
}

/**
 * Determine if sorting should be reversed
 */
function getSortReverse(sortBy) {
  const reverseKeys = ['title-descending', 'price-descending', 'created-descending'];
  return reverseKeys.includes(sortBy);
}

/**
 * Build filters array from URL parameters
 * @param {URLSearchParams} searchParams - The URLSearchParams object
 */
function buildFiltersFromURL(searchParams) {
  const filters = [];
  
  // Handle encoded filter parameters (f[])
  const filterParams = searchParams.getAll('f');
  filterParams.forEach((encodedFilter) => {
    try {
      const decoded = JSON.parse(decodeURIComponent(encodedFilter));
      filters.push(decoded);
    } catch (e) {
      console.error('Failed to parse filter:', e);
    }
  });
  
  // Handle in_stock filter
  if (searchParams.get('in_stock') === '1') {
    filters.push({
      available: true,
    });
  }
  
  // Handle price range filter
  const priceMin = searchParams.get('price_min');
  const priceMax = searchParams.get('price_max');
  if (priceMin || priceMax) {
    const priceFilter = {price: {}};
    if (priceMin) priceFilter.price.min = parseFloat(priceMin);
    if (priceMax) priceFilter.price.max = parseFloat(priceMax);
    filters.push(priceFilter);
  }
  
  return filters.length > 0 ? filters : undefined;
}

export default function CollectionRoute() {
  const {collection} = useLoaderData();
  return (
    <>
      <CollectionMain collection={collection} />
      <Analytics.CollectionView
        data={{collection: {id: collection.id, handle: collection.handle}}}
      />
    </>
  );
}

const COLLECTION_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query Collection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
    $filters: [ProductFilter!]
    $sortKey: ProductCollectionSortKeys
    $reverse: Boolean
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      metafields(identifiers: [
        {namespace:"custom", key: "banner_link_text"}
        {namespace: "custom", key: "collection_banner"},
        {namespace: "custom", key: "collection_banner_mobile"},
      ]) {
        key
        type
        value
        reference {
          __typename
          ... on MediaImage {
            image { url width height altText }
          }
          ... on GenericFile {
            url
          }
          ... on Video {
            sources { url }
          }
        }
      }
      products(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor,
        filters: $filters,
        sortKey: $sortKey,
        reverse: $reverse
      ) {
        nodes { ...ProductItem }
        pageInfo { hasPreviousPage hasNextPage endCursor startCursor }
        filters {
          id
          label
          type
          values { id label count input }
        }
      }
    }
  }
`;