import CommonCarousel from '../ReusableCarousel';

export function KnowUsSection() {
  const items = [
    {
      image: 'https://saadaa.in/cdn/shop/files/nj.png?v=1744869154',
      cta: 'About Us',
      link: 'https://saadaa.in/pages/about-us',
    },
    {
      image: 'https://saadaa.in/cdn/shop/files/card_360.jpg?v=1744113181',
      cta: 'Our Journey',
      link: 'https://saadaa.in/pages/our-journey',
    },
    {
      image:
        'https://saadaa.in/cdn/shop/files/SAADAA-EBO001-AMP-110_1.png?v=1744112072',
      cta: 'Our Store',
      link: 'https://saadaa.in/pages/our-store',
    },
    {
      image: 'https://saadaa.in/cdn/shop/files/TI_1.png?v=1744112311',
      cta: 'Work With Us',
      link: 'https://saadaa.in/pages/work-with-us',
    },
    {
      image:
        'https://saadaa.in/cdn/shop/files/Desktop_view_banner_1_1.png?v=1744112071',
      cta: 'Partner With Us',
      link: 'https://docs.google.com/forms/d/e/1FAIpQLScoYIX8AzUL-C7cA219JJURZij7pQJ5RJZvaEYGRp9e9pgdww/viewform',
    },
  ];

  return (
    <CommonCarousel
      title="Get to know us better"
      subtitle="A closer look at who we are."
      items={items}
      customClassName={"custom-cta-styles"}
    />
  );
}
