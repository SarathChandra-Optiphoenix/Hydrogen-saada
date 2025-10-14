import {CategoryRow} from './Home/CategoryRowSection';
import {HeroSection} from './Home/HeroSection';
import {PartnersStrip} from './Home/PartnersStripSection';
import {StatsSection} from './Home/StatsSection';
import {CollectionsGrid} from './Home/CollectionsGrid';
import {AboutStripSection} from './Home/AboutStripSection';
import {StatsStripSection} from './Home/StatsStripSection';
import {UslInfiniteMarqueeSection} from './Home/UslInfiniteMarqueeSection';
import { JournalCarouselSection } from './Home/JournalCarousel';
import {ReviewCarouselSection} from './Home/ReviewCarouselSection';
import { KnowUsSection } from './Home/KnowUsSection';
import {PromoWhatsAppSection}  from './Home/PromoWhatsappSection';
import {SpottedStripSection} from './Home/SpottedStripSection';
import {VideoCarousel} from './Home/VideoCarousel';
import  BestSellers from '~/assets/images/bestsellers.webp';
import NewArrivals from '~/assets/images/new_arrivals.gif';
import Bottoms from '~/assets/images/trousers.webp';
import Kurtas  from '~/assets/images/kurta.webp';
import Tops from '~/assets/images/tops.webp';
import FlaredDresses from '~/assets/images/dresses.webp';
import Shirts from '~/assets/images/shirts.webp';
import Men from '~/assets/images//men.webp';
import ShopByColor from '~/assets/images/shop_by_color.webp';
import Review1 from '~/assets/images/review1.jpg';
import Review2 from '~/assets/images/review2.jpg';
import Review3 from '~/assets/images/review3.jpg';
import Review4 from '~/assets/images/review4.jpg';
import Review5 from '~/assets/images/review5.jpg';

const categoriesRow = [
  {
    id: 1,
    key: 'best-sellers',
    handle: 'best-sellers',
    title: 'Bestsellers',
    img: BestSellers,
  },
  {
    id: 2,
    key: 'new-arrival-all-product',
    handle: 'new-arrival-all-product',
    title: 'New',
    img: NewArrivals,
  },
  {
    id: 3,
    key: 'shop-bottoms',
    handle: 'shop-bottoms',
    title: 'Bottoms',
    img: Bottoms,
  },
  {
    id: 4,
    key: 'airy-linen-kurtas',
    handle: 'airy-linen-kurtas',
    title: 'Kurta',
    img: Kurtas,
  },
  {
    id: 5,
    key: 'shop-all-tops',
    handle: 'shop-all-tops',
    title: 'Tops',
    img: Tops,
  },
  {
    id: 6,
    key: 'airy-linen-flared-dress',
    handle: 'airy-linen-flared-dress',
    title: 'Flared Dress',
    img: FlaredDresses,
  },
  {
    id: 7,
    key: 'airy-linen-shirts',
    handle: 'airy-linen-shirts',
    title: 'Shirts',
    img: Shirts,
  },
  {
    id: 8,
    key: 'men',
    handle: 'men',
    title: 'Men',
    img: Men,
  },
  {
    id: 9,
    key: 'shop-by-color',
    handle: 'shop-by-color',
    title: 'By Color',
    img: ShopByColor,
  },
];

const statsStripItems = [
  {
    img: 'https://cdn.shopify.com/s/files/1/0450/3476/6485/files/Group_1171275222.svg?v=1744103366',
    label: 'Comfort<br>Fit',
  },
  {
    img: 'https://cdn.shopify.com/s/files/1/0450/3476/6485/files/Group_1171275226.svg?v=1744103607',
    label: 'Skin<br>Friendly',
  },
  {
    img: 'https://cdn.shopify.com/s/files/1/0450/3476/6485/files/Vector.svg?v=1744103606',
    label: 'Made<br>to Last',
  },
  {
    img: 'https://cdn.shopify.com/s/files/1/0450/3476/6485/files/Group_1171275227.svg?v=1744103606',
    label: 'Natural<br>Fibers',
  },
  {
    img: 'https://cdn.shopify.com/s/files/1/0450/3476/6485/files/Vector_1.svg?v=1744103607',
    label: 'Sizes<br>upto 5XL',
  },
];

const reviewData = [
  {
    id: 1,
    img: Review1,
    title: 'Akshay R.',
    meta: 'Good',
  },
  {
    id: 2,
    img:  Review2,
    title: 'Preeti J.',
    meta: 'I liked the colour fitting...',
  },
  {
    id: 3,
    img:  Review3,
    title: 'Swati S.',
    meta: 'Very comfortable.',
  },
  {
    id: 4,
    img:  Review4,
    title: 'Manisha D.',
    meta: 'Soft touch material.',
  },
  {
    id: 5,
    img:  Review5,
    title: 'Akshay R.',
    meta: 'Good',
  },
  {
    id: 6,
    img: Review1,
    title: 'Preeti J.',
    meta: 'I liked the colour fitting...',
  },
  {
    id: 7,
    img: Review2,
    title: 'Swati S.',
    meta: 'Very comfortable.',
  },
  {
    id: 8,
    img:Review3,
    title: 'Manisha D.',
    meta: 'Soft touch material.',
  },
  {
    id: 9,
    img: Review4,
    title: 'Akshay R.',
    meta: 'Good',
  },
  {
    id: 10,
    img: Review2,
    title: 'Preeti J.',
    meta: 'I liked the colour fitting...',
  },
  {
    id: 11,
    img: Review3,
    title: 'Swati S.',
    meta: 'Very comfortable.',
  },
  {
    id: 12,
    img: Review4,
    title: 'Manisha D.',
    meta: 'Soft touch material.',
  },
];

const UslItems = [
  {
    id: 'free-delivery',
    text: 'Free Delivery',
    // decorative tick SVG — mark aria-hidden if decorative
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="26 -26 100 125"
        aria-hidden="true"
        focusable="false"
      >
        <path
          className="st0"
          fill="#ffffff"
          d="M114.3,1.1L63.8,52.3c-1.7,1.8-4.6,1.8-6.3,0L36.7,31c-1.7-1.8-1.7-4.6,0-6.4c1.7-1.8,4.6-1.8,6.3,0l17.7,18.1  l47.4-48c1.7-1.8,4.6-1.8,6.3,0C116.1-3.5,116.1-0.7,114.3,1.1z"
        ></path>
      </svg>
    ),
  },
  {
    id: 'free-returns',
    text: 'Free Returns & Exchanges',
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="26 -26 100 125"
        aria-hidden="true"
        focusable="false"
      >
        <path
          className="st0"
          fill="#ffffff"
          d="M114.3,1.1L63.8,52.3c-1.7,1.8-4.6,1.8-6.3,0L36.7,31c-1.7-1.8-1.7-4.6,0-6.4c1.7-1.8,4.6-1.8,6.3,0l17.7,18.1  l47.4-48c1.7-1.8,4.6-1.8,6.3,0C116.1-3.5,116.1-0.7,114.3,1.1z"
        ></path>
      </svg>
    ),
  },
  {
    id: 'loved',
    text: 'Loved by 6,00,000+ Customers ❤️',
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="26 -26 100 125"
        aria-hidden="true"
        focusable="false"
      >
        <path
          className="st0"
          fill="#ffffff"
          d="M114.3,1.1L63.8,52.3c-1.7,1.8-4.6,1.8-6.3,0L36.7,31c-1.7-1.8-1.7-4.6,0-6.4c1.7-1.8,4.6-1.8,6.3,0l17.7,18.1  l47.4-48c1.7-1.8,4.6-1.8,6.3,0C116.1-3.5,116.1-0.7,114.3,1.1z"
        ></path>
      </svg>
    ),
  },
  {
    id: 'refund',
    text: "100% Refund if you don't ❤️ it",
    svg: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="26 -26 100 125"
        aria-hidden="true"
        focusable="false"
      >
        <path
          className="st0"
          fill="#ffffff"
          d="M114.3,1.1L63.8,52.3c-1.7,1.8-4.6,1.8-6.3,0L36.7,31c-1.7-1.8-1.7-4.6,0-6.4c1.7-1.8,4.6-1.8,6.3,0l17.7,18.1  l47.4-48c1.7-1.8,4.6-1.8,6.3,0C116.1-3.5,116.1-0.7,114.3,1.1z"
        ></path>
      </svg>
    ),
  },
];

const collectionLinks = {
  bottoms: "/collections/shop-all-bottoms",
  bestsellers: "/collections/best-sellers-women",
  newArrival: "/collections/new-arrivals-women",
  tops: "/collections/shop-all-tops-1",
};

export function MainHome() {
  return (
    <>
      <CategoryRow categories={categoriesRow} />
      <HeroSection />
      <StatsSection />
      <CollectionsGrid collectionLinks={collectionLinks}/>
      <PartnersStrip />
      <AboutStripSection />
      <VideoCarousel/>
      <SpottedStripSection/>
      <StatsStripSection items={statsStripItems} />
      <UslInfiniteMarqueeSection
        items={UslItems}
        itemWidth={320}
        itemHeight={54}
        gap={48}
        duration={28}
        startIndex={0}
      />
      <KnowUsSection/>
      <ReviewCarouselSection items={reviewData}/>
      <JournalCarouselSection/>
      <PromoWhatsAppSection />
    </>
  );
}
