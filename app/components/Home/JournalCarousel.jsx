import CommonCarousel from "../ReusableCarousel";


export function JournalCarouselSection() {

  const items = [
    {
      image: 'https://saadaa.in/cdn/shop/files/SDE0792_1.png?v=1744203414',
      title: 'सादा जीवन | SAADAA JEEVAN',
      link: 'https://saadaa.in/blogs/embrace-saadagi-with-saadaa/embrace-saadagi-with-saadaa',
      cta: 'Read more ➝',
    },
    {
      image: 'https://saadaa.in/cdn/shop/files/SD39120_2.png?v=1744271354',
      title: 'What Is Simplicity According To You?',
      link: 'https://saadaa.in/blogs/the-art-of-simplicity-finding-joy-in-a-less-complicated-life/the-art-of-simplicity-finding-joy-in-a-less-complicated-life',
      cta: 'Read more ➝',
    },
    {
      image: 'https://saadaa.in/cdn/shop/files/3_1.png?v=1745294960',
      title: 'The Art of Simple Living',
      cta: 'Read more ➝',
      link: 'https://saadaa.in/blogs/the-art-of-simple-living-less-is-the-new-more/the-art-of-simple-living-less-is-the-new-more',
    },
    {
      image:
        'https://saadaa.in/cdn/shop/files/Blog_Page_banner_259x281_1_1.jpg?v=1746158993',
      title: 'The Fabric of Everyday',
      cta: 'Read more ➝',
      link: 'https://saadaa.in/blogs/how-to-build-a-timeless-wardrobe-5/how-to-build-a-timeless-wardrobe',
    },
    {
      image: 'https://saadaa.in/cdn/shop/files/Blog_Page_banner_259x281_2_1.jpg?v=1746158993',
      title: 'How to Live Life Simply?',
      cta: 'Read more ➝',
      link: 'https://saadaa.in/blogs/how-to-live-life-simply/how-to-live-life-simply',
    },
    {
      image: 'https://saadaa.in/cdn/shop/files/Frame_427319658.png?v=1747994527',
      title: 'How to Build a Timeless Wardrobe?',
      cta: 'Read more ➝',
      link: 'https://saadaa.in/blogs/the-art-of-simplicity-finding-joy-in-a-less-complicated-life/the-art-of-simplicity-finding-joy-in-a-less-complicated-life',
    },
    {
      image: '	https://saadaa.in/cdn/shop/files/DSC01185_4_1.png?v=1748082063',
      title: '5 Ways to Rewear Your Favourite Outfits',
      cta: 'Read more ➝',
      link: 'https://saadaa.in/blogs/5-ways-to-rewear-your-favourite-outfits-without-looking-repetitive/what-makes-solid-clothes-so-different',
    },
    {
      image:
        '	https://saadaa.in/cdn/shop/files/SD38908_1_3.png?v=1748001897',
      title: 'What Makes Solid Clothes So Different?',
      cta: 'Read more ➝',
      link: 'https://saadaa.in/blogs/what-makes-solid-clothes-so-different-1/what-makes-solid-clothes-so-different',
    },
    {
      image:
        '	https://saadaa.in/cdn/shop/files/DSC01185_6.png?v=1748004724',
      title: 'Why is Linen the Ultimate Summer Fabric?',
      cta: 'Read more ➝',
      link: 'https://saadaa.in/blogs/why-is-linen-the-ultimate-summer-fabric/why-is-linen-the-ultimate-summer-fabric',
    },
    {
      image:
        '	https://saadaa.in/cdn/shop/files/RM_28150_1.webp?v=1750076391',
      title: 'Why We Say No to Fast Fashion?',
      cta: 'Read more ➝',
      link: 'https://saadaa.in/blogs/why-we-say-no-to-fast-fashion/why-we-say-no-to-fast-fashion',
    },
    {
      image:
        'https://saadaa.in/cdn/shop/files/SDE0154_1.webp?v=1750076391',
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