import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useCallback,
} from 'react';

const useIso =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export function StatsStripSection({items = [], mobileBreakpoint = 860}) {
  const [isMobile, setIsMobile] = useState(false);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);
  const trackRef = useRef(null);
  const rafRef = useRef(null);
  const roRef = useRef(null);

  const updateArrows = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = Math.max(0, el.scrollWidth - el.clientWidth - 1);
    setCanLeft(el.scrollLeft > 0);
    setCanRight(el.scrollLeft < max);
  }, []);

  /* Detect mobile (SSR-safe) */
  useIso(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia(`(max-width:${mobileBreakpoint - 1}px)`);
    const onChange = () => setIsMobile(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [mobileBreakpoint]);

  /* Scroll listener (RAF-throttled) */
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        updateArrows();
      });
    };

    el.addEventListener('scroll', onScroll, {passive: true});
    updateArrows();

    return () => {
      el.removeEventListener('scroll', onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [updateArrows]);

  /* Recalculate on resize/content changes */
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    // Observe size changes of the track
    roRef.current = new ResizeObserver(() => updateArrows());
    roRef.current.observe(el);

    // Recalculate after each image loads
    const imgs = Array.from(el.querySelectorAll('img'));
    const handlers = imgs.map((img) => {
      const fn = () => updateArrows();
      img.addEventListener('load', fn, {once: true});
      return {img, fn};
    });

    // Fallback: also recalc once on next frame
    const id = requestAnimationFrame(updateArrows);

    // Window resize
    const onWindowResize = () => updateArrows();
    window.addEventListener('resize', onWindowResize);

    return () => {
      if (roRef.current) roRef.current.disconnect();
      handlers.forEach(({img, fn}) => img.removeEventListener('load', fn));
      cancelAnimationFrame(id);
      window.removeEventListener('resize', onWindowResize);
    };
  }, [items, updateArrows]);

  const pageByOne = useCallback((dir = 1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector('.sc-card');
    if (!card) return;
    const {width} = card.getBoundingClientRect();
    el.scrollTo({left: el.scrollLeft + width * dir, behavior: 'smooth'});
  }, []);

  const safeHTML = (html) =>
    String(html)
      .replace(/<\s*br\s*\/?>/gi, '[[BR]]')
      .replace(/<[^>]*>/g, '')
      .replace(/\[\[BR\]\]/g, '<br>');

  const plain = (s) => String(s).replace(/<[^>]*>/g, '').trim();

  return (
    <div className="sc-wrap">


      <div
        ref={trackRef}
        className={`sc-track ${isMobile ? 'sc-track--mobile' : 'sc-track--desktop'}`}
      >
        {items.map((it, i) => (
          <div className="sc-card" key={`${i}-${it.img}`}>
            <div className="sc-card__inner">
              <img
                className="sc-card__img"
                src={it.img}
                alt={plain(it.label)}
                loading="lazy"
              />
              <p
                className="sc-card__label"
                dangerouslySetInnerHTML={{__html: safeHTML(it.label)}}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StatsStripSection;
