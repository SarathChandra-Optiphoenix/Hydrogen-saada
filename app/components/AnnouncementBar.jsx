import { useState, useEffect, memo } from 'react';
import { Link } from 'react-router';

/**
 * Announcement Bar Component with rotating messages
 */
export const AnnouncementBar = memo(() => {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [fade, setFade] = useState(true);

  const messages = [
    { text: "100% Refund if you don't ❤️ it" },
    {
      text: 'EXPERIENCE TIMELESS COMFORT WITH OUR ALL-NEW PURE LINEN - ',
      link: { text: 'SHOP NOW', url: '/collections/pre-launch' },
    },
    {
      text: 'NEW COLOR LAUNCH OLIVE GREEN COTTON PANT FOR MEN - ',
      link: { text: 'SHOP NOW', url: '/products/white-100-linen-half-sleeve-shirt-men' },
    },
    {
      text: 'YOUR FAVORITES, NOW IN NEW COLORS - ',
      link: { text: 'SHOP NOW', url: '/collections/new-color-launch' },
    },
    { text: 'Free Delivery with Free Returns & Free Exchanges' },
    { text: 'Loved by 6,00,000+ Customers ❤️' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentMessage((prev) => (prev + 1) % messages.length);
        setFade(true);
      }, 500);
    }, 3000);

    return () => clearInterval(interval);
  }, [messages.length]);

  const currentMsg = messages[currentMessage];

  return (
    <div className="announcement-bar" role="banner">
      <span className={`announcement-text ${fade ? 'fade-in' : 'fade-out'}`}>
        {currentMsg.text}
        {currentMsg.link && (
          <Link to={currentMsg.link.url} className="custom-bar-link">
            {currentMsg.link.text}
          </Link>
        )}
      </span>
    </div>
  );
});

AnnouncementBar.displayName = 'AnnouncementBar';