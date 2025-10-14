
export function ProductBreadcrumbs({selectedCollection, product}) {
  const specialCollections = [
    'AIRY-LINEN SHORTS',
    'MEN AIRY-LINEN SHORT KURTAS',
    'AIRY LINEN PANTS',
    'THE FORMAL PANTS',
    'EVERYDAY COTTON TOP',
    'THE FORMAL SHIRTS',
  ];

  const plusCollections = [
    'Women Plus Size Wide Leg Pant',
    'Women Plus Size Viscose Palazzo Pant',
    'Women Plus Size Sleeveless Top',
    'Women Plus Size Pleated Top',
    'Women Plus Size Formal Pant',
    'Women Plus Size Cotton Pant',
    'Women Plus Size Airy-Linen Shirt',
    'Women Plus Size Airy Linen Short Kurta',
  ];

  return (
    <nav className="product-breadcrumbs" aria-label="Breadcrumb">
      <span>
        <a href="/">Home</a> /
      </span>{' '}
      {selectedCollection ? (
        <>
          {specialCollections.includes(selectedCollection.title) && (
            <span>
              <a href="/collections/goodbye-edition">Goodbye Edition</a> /
            </span>
          )}
          {plusCollections.includes(selectedCollection.title) && (
            <span>
              <a href="/collections/women-plus-size">Plus Edition</a> /
            </span>
          )}
          <span>
            <a href={`/collections/${selectedCollection.handle}`}>
              {selectedCollection.title}
            </a>{' '}
            /
          </span>
        </>
      ) : (
        product?.collections?.nodes
          ?.filter(
            (c) =>
              c.title?.includes('Shop All') &&
              !['Women Shop All', 'Men Shop All'].includes(c.title),
          )
          ?.slice(0, 1)
          ?.map((c) => (
            <span key={c.id}>
              <a href={`/collections/${c.handle}`}>{c.title}</a> /
            </span>
          ))
      )}
      <span>{product.title}</span>
    </nav>
  );
}