import { useState, useRef } from "react";


export function ProductGallery({images, fallbackImage}) {
    const all = images?.nodes?.length ? images?.nodes : fallbackImage ? [fallbackImage] : [];
    const [active, setActive] = useState(0);
    const imageRefs = useRef([]);
    
    if (!all.length) return <div className="pdp-gallery" />;
  
    const handleThumbClick = (index) => {
      setActive(index);
      // Scroll the corresponding main image into view
      imageRefs.current[index]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    };
  
    return (
      <div className="pdp-gallery">
        <div className="pdp-thumbs">
          {all.map((img, i) => (
            <button
              key={img.id ?? i}
              className={`pdp-thumb ${i === active ? 'is-active' : ''}`}
              onClick={() => handleThumbClick(i)}
              type="button"
              aria-label={`Thumbnail ${i + 1}`}
            >
              <img src={img.url} alt={img.altText ?? 'Product'} />
            </button>
          ))}
        </div>
  
        <div className="pdp-mainimg">
          <div className="contents">
          {all.map((img, i) => (
            <div
              key={img.id ?? i}
              ref={(el) => (imageRefs.current[i] = el)}
              className={`pdp-main-image ${i === active ? 'is-active' : ''}`}
            >
              <img src={img.url} alt={img.altText ?? 'Product'} />
            </div>
            
          ))}
        </div>
        </div>
      </div>
    );
  }