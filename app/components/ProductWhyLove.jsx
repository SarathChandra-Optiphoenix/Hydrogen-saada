import {Image} from '@shopify/hydrogen';

export function ProductWhyLove({selectedCollection}) {
  // Early return if no metafields
  if (!selectedCollection?.metafields) {
    return null;
  }

  // Filter out null/undefined metafields
  const metafields = selectedCollection.metafields.filter(Boolean);
  
  if (!metafields.length) {
    return null;
  }

  // Find the offer_image metafield (this should be the correct one)
  const offerImageMf = metafields.find((m) => m?.key === 'offer_image');

  // Get the images/references
  const offerNodes = offerImageMf?.references?.nodes?.filter(Boolean) ?? [];
  const offerRef = offerImageMf?.reference ?? null;

  // Early return if no content - CHECK THIS BEFORE RENDERING
  if (!offerNodes.length && !offerRef) {
    return null;
  }

  return (
    <section className="product-love">
      <h2>Why you will love this ?</h2>
      <div className="product-love-carousel no-scrollbar">
        {/* Render from references.nodes if it's a list */}
        {offerNodes.map((node) => {
          const img = node?.image ?? node;
          if (!img?.url) return null;
          return (
            <div className="product-love-card" key={node.id || img.url}>
              <Image data={img} />
            </div>
          );
        })}
        
        {/* Render from reference if it's a single image */}
        {offerRef?.image?.url && (
          <div className="product-love-card">
            <Image data={offerRef.image} />
          </div>
        )}
      </div>
    </section>
  );
}