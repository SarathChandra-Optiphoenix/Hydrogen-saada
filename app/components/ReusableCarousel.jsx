import {useRef, useState, useEffect, useCallback, useMemo} from 'react';

export default function CommonCarousel({
  title = 'The Journal',
  subtitle = 'Threads of thoughtful living',
  items = [],
  cardWidth = 440,
  responsivePercent = {mobile: 80, desktop: 30},
  overlayColor = '#1c1c1c',
  overlayOpacity = 0.29,
  customClassName
}) {
  const trackRef = useRef(null);

  // internal state
  const [hovered, setHovered] = useState(false);
  const [showPrev, setShowPrev] = useState(false);
  const [showNext, setShowNext] = useState(false);

  // ---- helpers
  const hasOverflow = (el) => el.scrollWidth - el.clientWidth > 1;
  const atStart = (el) => el.scrollLeft <= 5;
  const atEnd = (el) => el.scrollLeft >= el.scrollWidth - el.clientWidth - 5;

  const updateArrowsFromScroll = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;

    if (!hasOverflow(el)) {
      setShowPrev(false);
      setShowNext(false);
      return;
    }
    setShowPrev(!atStart(el));
    setShowNext(!atEnd(el));
  }, []);

  const handleMouseEnter = useCallback(() => {
    const el = trackRef.current;
    setHovered(true);
    if (!el) return;
    // On first hover: only right if overflow
    if (hasOverflow(el)) {
      setShowPrev(false);
      setShowNext(true);
    } else {
      setShowPrev(false);
      setShowNext(false);
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHovered(false);
    setShowPrev(false);
    setShowNext(false);
  }, []);

  const scrollDir = useCallback(
    (dir) => {
      const el = trackRef.current;
      if (!el) return;
      if (dir === 'next') setShowPrev(true); // optimistic: once we move right, left should show
      el.scrollBy({
        left: dir === 'next' ? cardWidth : -cardWidth,
        behavior: 'smooth',
      });
    },
    [cardWidth],
  );

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    // Ensure we start at exact 0 to avoid false left-arrow on hover
    requestAnimationFrame(() => {
      el.scrollTo({left: 0});
      updateArrowsFromScroll();
    });

    const onScroll = () => updateArrowsFromScroll();
    el.addEventListener('scroll', onScroll, {passive: true});

    const ro = new ResizeObserver(updateArrowsFromScroll);
    ro.observe(el);

    return () => {
      el.removeEventListener('scroll', onScroll);
      ro.disconnect();
    };
  }, [updateArrowsFromScroll]);

  // ---- CSS vars
  const cssVars = useMemo(() => {
    const mobilePercent = Math.max(10, Math.min(100, responsivePercent.mobile));
    const desktopPercent = Math.max(
      10,
      Math.min(100, responsivePercent.desktop),
    );
    return {
      '--cc-mobile-percent': `${mobilePercent}%`,
      '--cc-desktop-percent': `${desktopPercent}%`,
      '--cc-overlay-color': overlayColor,
      '--cc-overlay-opacity': overlayOpacity,
    };
  }, [responsivePercent, overlayColor, overlayOpacity]);

  return (
    <section className="cc-section" style={cssVars}>
      <div className="cc-header">
        <h2 className="cc-title">{title}</h2>
        <p className="cc-subtitle">{subtitle}</p>
      </div>

      <div
        className="cc-wrapper"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* arrows appear only on hover */}
        {hovered && showPrev && (
          <button
            className="cc-arrow cc-arrow--left"
            onClick={() => scrollDir('prev')}
            aria-label="Previous"
          >
            <svg
              aria-hidden="true"
              focusable="false"
              fill="none"
              width="16"
              className="icon icon-arrow-left  icon--direction-aware"
              viewBox="0 0 16 18"
            >
              <path
                d="M11 1 3 9l8 8"
                stroke="currentColor"
                strokeLinecap="square"
              ></path>
            </svg>
          </button>
        )}
        {hovered && showNext && (
          <button
            className="cc-arrow cc-arrow--right"
            onClick={() => scrollDir('next')}
            aria-label="Next"
          >
            <svg
              aria-hidden="true"
              focusable="false"
              fill="none"
              width="16"
              className="icon icon-arrow-right  icon--direction-aware"
              viewBox="0 0 16 18"
            >
              <path
                d="m5 17 8-8-8-8"
                stroke="currentColor"
                strokeLinecap="square"
              ></path>
            </svg>
          </button>
        )}

        <div ref={trackRef} className="cc-track" role="region">
          {items.map((item, i) => (
            <a
              key={i}
              href={item.link}
              className="cc-card"
              aria-label={item.title || 'Open'}
            >
              <div className="img-wrap">
                <img src={item.image} alt={item.title || ''} loading="lazy" />
                <div className="overlay" />
                <div className="cc-card-content">
                  {item.title && <p className="cc-card-title">{item.title}</p>}
                  <button type="button" className={`cc-cta ${title === "Get to know us better" && customClassName}`}>
                    {item.cta}
                  </button>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
