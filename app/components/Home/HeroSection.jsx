export function HeroSection() {
  return (
    <div className="myBannerContainer">
      <a className="myBannerItemPS" href="/collections/surprise-drop">
        <img
          className="myBannerImagePS"
          src="https://cdn.shopify.com/s/files/1/0450/3476/6485/files/surprise.webp?v=1760414453"
          alt="surprise-drop"
          width="2220"
          height="1200"
          loading={'eager' | 'lazy'}
        />
      </a>

      <a className="myBannerItemFP" href="/collections/cotton-trousers">
        <img
          className="myBannerImageFP"
          src="https://cdn.shopify.com/s/files/1/0450/3476/6485/files/Group_-_2025-10-04T094226.240.webp?v=1759551161"
          alt="cotton-trousers"
          width="2220"
          height="1200"
          loading={'eager' | 'lazy'}
        />
      </a>
    </div>
  );
}
