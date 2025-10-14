import CommonCarousel from '../ReusableCarousel';
import AboutUs from '~/assets/images/About-us.avif';
import OurJourney from '~/assets/images/our-journey.avif';
import OurStore from '~/assets/images/our-store.avif';
import WorkWithUs from '~/assets/images/work-with-us.avif';
import PartnerWithUs from '~/assets/images/partner-with-us.avif'

export function KnowUsSection() {
  const items = [
    {
      image: AboutUs,
      cta: 'About Us',
      link: 'https://saadaa.in/pages/about-us',
    },
    {
      image: OurJourney,
      cta: 'Our Journey',
      link: 'https://saadaa.in/pages/our-journey',
    },
    {
      image: OurStore,
      cta: 'Our Store',
      link: 'https://saadaa.in/pages/our-store',
    },
    {
      image: WorkWithUs,
      cta: 'Work With Us',
      link: 'https://saadaa.in/pages/work-with-us',
    },
    {
      image:
        PartnerWithUs,
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
