import {useState, useRef, useEffect} from 'react';

const videoData = [
  {
    id: 1,
    title: 'Women Lilac Airy Linen Short Kurta',
    price: '₹ 799',
    videoUrl: 'https://cdn.shopify.com/s/files/1/0450/3476/6485/files/whatmore_tn_4c81abfd-fb09-43a3-9c90-b7ac99f96903.mp4?v=1745312996',
    posterUrl: 'https://cdn.shopify.com/s/files/1/0450/3476/6485/files/whatmore_poster_4c81abfd-fb09-43a3-9c90-b7ac99f96903.webp?v=1745313016',
    productUrl: 'https://saadaa.in/products/lilac-airy-linen-short-kurta',
  },
  {
    id: 2,
    title: 'Women Ecru Airy-linen Shirt',
    price: '₹ 1,199',
    videoUrl: 'https://cdn.shopify.com/s/files/1/0450/3476/6485/files/whatmore_tn_0cb46723-f69b-4167-a66d-0c3f6ce77ba2.mp4?v=1745313001',
    posterUrl: 'https://cdn.shopify.com/s/files/1/0450/3476/6485/files/whatmore_poster_0cb46723-f69b-4167-a66d-0c3f6ce77ba2.webp?v=1745313018',
    productUrl: 'https://saadaa.in/products/ecru-airy-linen-shirt',
  },
  {
    id: 3,
    title: 'Women White Airy-linen Shirt',
    price: '₹ 1,199',
    videoUrl: 'https://cdn.shopify.com/s/files/1/0450/3476/6485/files/whatmore_tn_2f599941-89d2-4e03-936d-6d1878731fe4.mp4?v=1745313006',
    posterUrl: 'https://cdn.shopify.com/s/files/1/0450/3476/6485/files/whatmore_poster_2f599941-89d2-4e03-936d-6d1878731fe4.webp?v=1745313023',
    productUrl: 'https://saadaa.in/products/white-airy-linen-shirt',
  },
  {
    id: 4,
    title: 'Women Brinjal Viscose Pleated Top',
    price: '₹ 1,299',
    videoUrl: 'https://cdn.shopify.com/s/files/1/0450/3476/6485/files/whatmore_tn_b3f3a8d1-23f0-4d72-8f85-a0e750523cf4.mp4?v=1745313021',
    posterUrl: 'https://cdn.shopify.com/s/files/1/0450/3476/6485/files/whatmore_poster_b3f3a8d1-23f0-4d72-8f85-a0e750523cf4.webp?v=1745313038',
    productUrl: 'https://saadaa.in/products/beige-viscose-palazzo-pant',
  },
  {
    id: 5,
    title: 'Women Black Cotton Pant',
    price: '₹ 799',
    videoUrl: 'https://cdn.shopify.com/s/files/1/0450/3476/6485/files/whatmore_tn_71bbf3b6-5264-445c-a680-baa83de6d39a.mp4?v=1745313025',
    posterUrl: 'https://cdn.shopify.com/s/files/1/0450/3476/6485/files/whatmore_poster_71bbf3b6-5264-445c-a680-baa83de6d39a.webp?v=1745313042',
    productUrl: 'https://saadaa.in/products/black-solid-regular-fit-cotton-trouser',
  },
  {
    id: 6,
    title: 'Women Coffee Brown Airy-linen Shirt',
    price: '₹ 1,199',
    videoUrl: 'https://cdn.shopify.com/s/files/1/0450/3476/6485/files/whatmore_tn_92ea5239-f550-4d8b-a843-dcf15cb9d630.mp4?v=1745313043',
    posterUrl: 'https://cdn.shopify.com/s/files/1/0450/3476/6485/files/whatmore_poster_92ea5239-f550-4d8b-a843-dcf15cb9d630.webp?v=1745313061',
    productUrl: 'https://saadaa.in/products/coffee-brown-airy-linen-shirt',
  },
  {
    id: 7,
    title: 'Women Beige Wide Leg Pants',
    price: '₹ 1,999',
    videoUrl: 'https://cdn.shopify.com/s/files/1/0450/3476/6485/files/whatmore_tn_eeccacbc-1be3-4734-bf36-3a33dcbfb1ca.mp4?v=1745313051',
    posterUrl: 'https://cdn.shopify.com/s/files/1/0450/3476/6485/files/whatmore_poster_eeccacbc-1be3-4734-bf36-3a33dcbfb1ca.webp?v=1745313068',
    productUrl: 'https://saadaa.in/products/beige-wide-leg-pants-1',
  },
  {
    id: 8,
    title: 'Women Brinjal V-neck Sleeveless Top',
    price: '₹ 799',
    videoUrl: 'https://cdn.shopify.com/s/files/1/0450/3476/6485/files/whatmore_tn_e9fe48ea-4f9a-4d76-8f4f-930bc9487d9b.mp4?v=1745313066',
    posterUrl: 'https://cdn.shopify.com/s/files/1/0450/3476/6485/files/whatmore_poster_e9fe48ea-4f9a-4d76-8f4f-930bc9487d9b.webp?v=1745313082',
    productUrl: 'https://saadaa.in/products/raspberry-everyday-cotton-top',
  },
  {
    id: 9,
    title: 'Women Cinnamon Everyday Cotton Top',
    price: '₹ 799',
    videoUrl: 'https://cdn.shopify.com/s/files/1/0450/3476/6485/files/whatmore_tn_d9377a2d-ee67-409f-bad9-3bb18b7ba961.mp4?v=1745313086',
    posterUrl: 'https://cdn.shopify.com/s/files/1/0450/3476/6485/files/whatmore_poster_d9377a2d-ee67-409f-bad9-3bb18b7ba961.webp?v=1745313102',
    productUrl: 'https://saadaa.in/products/cinnamon-everyday-cotton-top',
  },
  {
    id: 10,
    title: 'Women Ecru Airy-linen Shirt',
    price: '₹ 1,199',
    videoUrl: 'https://cdn.shopify.com/s/files/1/0450/3476/6485/files/whatmore_tn_c54119a1-0d52-4406-9e10-02a7db25f440.mp4?v=1745313077',
    posterUrl: 'https://cdn.shopify.com/s/files/1/0450/3476/6485/files/whatmore_poster_c54119a1-0d52-4406-9e10-02a7db25f440.webp?v=1745313093',
    productUrl: 'https://saadaa.in/products/ecru-airy-linen-shirt',
  },
  {
    id: 11,
    title: 'Women Beige Wide Leg Pants',
    price: '₹ 1,999',
    videoUrl: 'https://cdn.shopify.com/s/files/1/0450/3476/6485/files/whatmore_tn_3e1a4d9a-65e5-4b2c-90e8-06f56747faef.mp4?v=1745313093',
    posterUrl: 'https://cdn.shopify.com/s/files/1/0450/3476/6485/files/whatmore_poster_3e1a4d9a-65e5-4b2c-90e8-06f56747faef.webp?v=1745313110',
    productUrl: 'https://saadaa.in/products/beige-wide-leg-pants-1',
  },
  {
    id: 12,
    title: 'Women Navy Blue V-neck Sleeveless Top',
    price: '₹ 799',
    videoUrl: 'https://cdn.shopify.com/s/files/1/0450/3476/6485/files/whatmore_tn_2a5774d5-1441-41c2-bd1f-4089373ebbc7.mp4?v=1745313108',
    posterUrl: 'https://cdn.shopify.com/s/files/1/0450/3476/6485/files/whatmore_poster_2a5774d5-1441-41c2-bd1f-4089373ebbc7.webp?v=1745313125',
    productUrl: 'https://saadaa.in/products/navy-blue-v-neck-sleeveless-top',
  },
];

export function VideoCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const videoRefs = useRef([]);
  const itemsPerPage = isMobile ? 2 : 5;

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-play videos when they come into view
  useEffect(() => {
    const startIndex = currentIndex * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    videoRefs.current.forEach((video, index) => {
      if (video) {
        if (index >= startIndex && index < endIndex) {
          // Play videos that are currently visible
          video.play().catch(() => {
            // Ignore autoplay errors
          });
        } else {
          // Pause and reset videos that are not visible
          video.pause();
          video.currentTime = 0;
        }
      }
    });
  }, [currentIndex, itemsPerPage]);


  const totalPages = Math.ceil(videoData.length / itemsPerPage);

  const handleNext = () => {
    if (currentIndex < totalPages - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleVideoClick = (video) => {
    if (video.productUrl) {
      window.location.href = video.productUrl;
    }
  };

  const visibleVideos = videoData.slice(
    currentIndex * itemsPerPage,
    (currentIndex + 1) * itemsPerPage
  );

  return (
    <div className="video-carousel-container">
      <h2 className="carousel-heading">Socially Approved</h2>

      <div className="carousel-wrapper">
        {currentIndex > 0 && (
          <button
            className="carousel-arrow carousel-arrow-left"
            onClick={handlePrev}
            aria-label="Previous videos"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M15 18L9 12L15 6"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}

        <div className="carousel-content">
          <div className="video-grid">
            {visibleVideos.map((video, index) => (
              <div 
                key={video.id} 
                className="video-card"
                onClick={() => handleVideoClick(video)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleVideoClick(video);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label={`View ${video.title} - ${video.price}`}
              >
                <div className="video-wrapper">
                  <video
                    ref={(el) => (videoRefs.current[currentIndex * itemsPerPage + index] = el)}
                    className="video-player"
                    loop
                    muted
                    playsInline
                    autoPlay
                    poster={video.posterUrl}
                  >
                    <source src={video.videoUrl} type="video/mp4" />
                  </video>
                </div>
              </div>
            ))}
          </div>
        </div>

        {currentIndex < totalPages - 1 && (
          <button
            className="carousel-arrow carousel-arrow-right"
            onClick={handleNext}
            aria-label="Next videos"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 18L15 12L9 6"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}