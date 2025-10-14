import {useLoaderData, Link} from 'react-router';
import {Image, getPaginationVariables} from '@shopify/hydrogen';

/**
 * @param {Route.LoaderArgs} args
 */
export async function loader({context, request}) {
  const url = new URL(request.url);
  const perPage = 48;
  const currentPage = Math.max(1, Number(url.searchParams.get('page')) || 1);

  // Get pagination variables from Hydrogen (handles ?after and ?before)
  const paginationVariables = getPaginationVariables(request, {pageBy: perPage});

  const [{collections}] = await Promise.all([
    context.storefront.query(COLLECTIONS_QUERY, { 
      variables: {
        ...paginationVariables,
        first: paginationVariables.last ? null : perPage,
        last: paginationVariables.last || null,
      }
    }),
  ]);

  const pageInfo = collections?.pageInfo;
  const totalCount = collections?.totalCount ?? 0;
  const totalPages = totalCount > 0 ? Math.ceil(totalCount / perPage) : 0;

  return {
    collections,
    perPage,
    currentPage,
    totalCount,
    totalPages,
    hasNextPage: pageInfo?.hasNextPage ?? false,
    hasPreviousPage: pageInfo?.hasPreviousPage ?? false,
    startCursor: pageInfo?.startCursor,
    endCursor: pageInfo?.endCursor,
  };
}

export default function Collections() {
  const {collections, currentPage, totalPages, hasNextPage, hasPreviousPage, startCursor, endCursor} = useLoaderData();

  return (
    <div className="collections-main">
      <h1 className="collections-header">All Collections</h1>

      <div className="collections-grid">
        {collections?.nodes?.map((c, i) => {
          const img = c?.products?.nodes?.[0]?.images?.nodes?.[0] ?? c?.image ?? null;
          if (!img) return null;
          return (
            <Link key={c.id} className="collection-item-box" to={`/collections/${c.handle}`} prefetch="intent">
              <div className="ci-card">
                <div className="ci-thumb">
                  <Image
                    data={img}
                    alt={img.altText || c.title}
                    loading={i < 3 ? 'eager' : undefined}
                    sizes="(min-width:62rem) 360px, (min-width:45rem) 300px, 100vw"
                    className="ci-img"
                  />
                  <div className="ci-title">{c.title}</div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <SimplePagination
        currentPage={currentPage}
        totalPages={totalPages}
        hasNextPage={hasNextPage}
        hasPreviousPage={hasPreviousPage}
        startCursor={startCursor}
        endCursor={endCursor}
      />
    </div>
  );
}

/**
 * Simple arrow-only pagination that works with Shopify cursors
 * Page numbers are displayed but not clickable (show-only)
 */
function SimplePagination({currentPage, totalPages, hasNextPage, hasPreviousPage, startCursor, endCursor}) {
  if (totalPages <= 1) return null;

  // Build page numbers for display only
  const pages = [];
  
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    if (currentPage <= 4) {
      pages.push(1, 2, 3, 4, 5, '…', totalPages);
    } else if (currentPage >= totalPages - 3) {
      pages.push(1, '…', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, '…', currentPage - 1, currentPage, currentPage + 1, '…', totalPages);
    }
  }

  // Previous and Next links
  const prevHref = hasPreviousPage && startCursor 
    ? `?page=${currentPage - 1}&before=${encodeURIComponent(startCursor)}` 
    : null;
  
  const nextHref = hasNextPage && endCursor 
    ? `?page=${currentPage + 1}&after=${encodeURIComponent(endCursor)}` 
    : null;

  return (
    <nav className="v-pager" aria-label="Collections pagination">
      <ul className="v-pager-list">
        {/* Left Arrow */}
        <li>
          {prevHref ? (
            <Link to={prevHref} className="v-pager-arrow" aria-label="Previous page" prefetch="intent">
              &lt;
            </Link>
          ) : (
            <span className="v-pager-arrow disabled" aria-disabled="true">
              &lt;
            </span>
          )}
        </li>

        {/* Page Numbers - Display Only */}
        {pages.map((p) =>
          p === '…' ? (
            <li key={`e-${p}`}>
              <span className="v-pager-ellipsis">…</span>
            </li>
          ) : (
            <li key={`p-${p}`}>
              <span className={`v-pager-num ${p === currentPage ? 'active' : ''}`}>
                {p}
              </span>
            </li>
          )
        )}

        {/* Right Arrow */}
        <li>
          {nextHref ? (
            <Link to={nextHref} className="v-pager-arrow" aria-label="Next page" prefetch="intent">
              &gt;
            </Link>
          ) : (
            <span className="v-pager-arrow disabled" aria-disabled="true">
              &gt;
            </span>
          )}
        </li>
      </ul>
    </nav>
  );
}

const COLLECTIONS_QUERY = `#graphql
  fragment CollectionWithFirstProduct on Collection {
    id
    title
    handle
    image {
      id
      url
      altText
      width
      height
    }
    products(first: 1) {
      nodes {
        id
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
  }

  query StoreCollections(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    collections(
      first: $first
      last: $last
      before: $startCursor
      after: $endCursor
    ) {
      nodes { ...CollectionWithFirstProduct }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
`;

/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */