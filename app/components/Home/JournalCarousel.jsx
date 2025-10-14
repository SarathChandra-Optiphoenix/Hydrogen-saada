import CommonCarousel from "../ReusableCarousel";
import SaadaaJeeven from '~/assets/images/saadaa-jeevan.avif';
import Simplicity from '~/assets/images/Simplicity.avif';
import SimpleLiving from '~/assets/images/Simple-living.avif';
import FabricEverything from '~/assets/images/fabric-of-everything.avif';
import LiveLifeSimply from '~/assets/images/live-life-simply.avif';
import TimelessWardrobe from '~/assets/images/build-timeless-wardrobe.avif';
import YourFavouriteOutfits from '~/assets/images/your-favourite-outfits.webp';
import SolidClothesDifferent from '~/assets/images/solid-clothes-so-different.webp';
import UtimateSummerFabric from '~/assets/images/utimate-summer-fabric.webp';
import SayNoToFashion from '~/assets/images/say-no-to-fast-fashion.webp';
import RightPantsOfYourBodyType from '~/assets/images/right-pants-of-your-body-type.webp';


export function JournalCarouselSection() {

  const items = [
    {
      image: SaadaaJeeven,
      title: 'सादा जीवन | SAADAA JEEVAN',
      link: 'https://saadaa.in/blogs/embrace-saadagi-with-saadaa/embrace-saadagi-with-saadaa',
      cta: 'Read more ➝',
    },
    {
      image: Simplicity,
      title: 'What Is Simplicity According To You?',
      link: 'https://saadaa.in/blogs/the-art-of-simplicity-finding-joy-in-a-less-complicated-life/the-art-of-simplicity-finding-joy-in-a-less-complicated-life',
      cta: 'Read more ➝',
    },
    {
      image: SimpleLiving,
      title: 'The Art of Simple Living',
      cta: 'Read more ➝',
      link: 'https://saadaa.in/blogs/the-art-of-simple-living-less-is-the-new-more/the-art-of-simple-living-less-is-the-new-more',
    },
    {
      image:
        FabricEverything,
      title: 'The Fabric of Everyday',
      cta: 'Read more ➝',
      link: 'https://saadaa.in/blogs/how-to-build-a-timeless-wardrobe-5/how-to-build-a-timeless-wardrobe',
    },
    {
      image: LiveLifeSimply,
      title: 'How to Live Life Simply?',
      cta: 'Read more ➝',
      link: 'https://saadaa.in/blogs/how-to-live-life-simply/how-to-live-life-simply',
    },
    {
      image: TimelessWardrobe,
      title: 'How to Build a Timeless Wardrobe?',
      cta: 'Read more ➝',
      link: 'https://saadaa.in/blogs/the-art-of-simplicity-finding-joy-in-a-less-complicated-life/the-art-of-simplicity-finding-joy-in-a-less-complicated-life',
    },
    {
      image: YourFavouriteOutfits,
      title: '5 Ways to Rewear Your Favourite Outfits',
      cta: 'Read more ➝',
      link: 'https://saadaa.in/blogs/5-ways-to-rewear-your-favourite-outfits-without-looking-repetitive/what-makes-solid-clothes-so-different',
    },
    {
      image:
      SolidClothesDifferent,
      title: 'What Makes Solid Clothes So Different?',
      cta: 'Read more ➝',
      link: 'https://saadaa.in/blogs/what-makes-solid-clothes-so-different-1/what-makes-solid-clothes-so-different',
    },
    {
      image:
      UtimateSummerFabric,
      title: 'Why is Linen the Ultimate Summer Fabric?',
      cta: 'Read more ➝',
      link: 'https://saadaa.in/blogs/why-is-linen-the-ultimate-summer-fabric/why-is-linen-the-ultimate-summer-fabric',
    },
    {
      image:
      SayNoToFashion,
      title: 'Why We Say No to Fast Fashion?',
      cta: 'Read more ➝',
      link: 'https://saadaa.in/blogs/why-we-say-no-to-fast-fashion/why-we-say-no-to-fast-fashion',
    },
    {
      image:
      RightPantsOfYourBodyType,
      title: 'How to Choose the Right Pants for Your Body Type ?',
      cta: 'Read more ➝',
      link: 'https://saadaa.in/blogs/how-to-choose-the-right-pants-for-your-body-type/how-to-choose-the-right-pants-for-your-body-type',
    },
  ];

  return (
    <CommonCarousel
      title="The Journal"
      subtitle="Threads of thoughtful living"
      items={items}
    />
  );
}