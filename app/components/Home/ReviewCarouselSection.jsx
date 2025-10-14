import { useRef, useEffect, useState } from "react";

/*
  ReviewCarousel
  Props:
    - items: array of { id, img, title, meta, rating }  (rating: integer 0..5)
    - visible: approximate number of cards visible in desktop (used as hint)
*/
export function ReviewCarouselSection({ items = [], visible = 4 }) {
  const listRef = useRef(null);
  const [showPrev, setShowPrev] = useState(false);
  const [showNext, setShowNext] = useState(true);
  const [isHover, setIsHover] = useState(false);
  const [cardWidth, setCardWidth] = useState(0);

  useEffect(() => {
    const node = listRef.current;
    if (!node) return;

    // measure after first paint/layout, and after images have loaded
    const measure = () => {
      const child = node.querySelector(".rc-card");
      if (child) {
        const style = getComputedStyle(child);
        const mr = parseFloat(style.marginRight || "0");
        setCardWidth(child.getBoundingClientRect().width + mr);
      }
      updateArrows();
    };

    // ensure measure runs after layout
    requestAnimationFrame(measure);

    // also measure after images load (to avoid showing prev arrow incorrectly)
    const imgs = Array.from(node.querySelectorAll("img"));
    if (imgs.length === 0) {
      requestAnimationFrame(measure);
    } else {
      let loaded = 0;
      const onLoad = () => {
        loaded += 1;
        // when most images loaded we measure
        if (loaded >= imgs.length) requestAnimationFrame(measure);
      };
      imgs.forEach((img) => {
        if (img.complete) onLoad();
        else img.addEventListener("load", onLoad, { once: true });
      });
    }

    const onScroll = () => updateArrows();
    node.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);

    return () => {
      node.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  function updateArrows() {
    const node = listRef.current;
    if (!node) return;
    const maxScroll = Math.max(0, node.scrollWidth - node.clientWidth);
    const cur = Math.round(node.scrollLeft || 0);
    const tolerance = 8;
    setShowPrev(cur > tolerance);
    setShowNext(cur < maxScroll - tolerance);
  }

  function scrollByDirection(dir = "next") {
    const node = listRef.current;
    if (!node) return;

    // prefer scrolling by card width if measured; fallback to chunk
    const fallbackChunk = Math.max(240, Math.round(node.clientWidth / Math.max(1, visible || 3)));
    const delta = cardWidth ? cardWidth : fallbackChunk;
    node.scrollBy({ left: dir === "next" ? delta : -delta, behavior: "smooth" });
  }

  // focus handling (so keyboard focus shows arrows)
  function handleFocusIn() {
    setIsHover(true);
  }
  function handleFocusOut(e) {
    if (!listRef.current || !e.relatedTarget) {
      setIsHover(false);
      return;
    }
    if (!listRef.current.contains(e.relatedTarget)) setIsHover(false);
  }

  return (
    <div
      className="rc-root"
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onFocus={handleFocusIn}
      onBlur={handleFocusOut}
    >
      <div className="rc-header">
        <div className="rc-title">SAADAA On YOU</div>
        <div className="rc-sub">Tag us to show your move of the day.</div>
      </div>

      <div className="rc-track-wrap">
        {/* Prev arrow */}
        <button
          className={`rc-arrow rc-prev ${showPrev ? "visible" : ""} ${isHover ? "hovered" : ""}`}
          aria-hidden={!showPrev}
          aria-label="Previous"
          onClick={() => scrollByDirection("prev")}
          tabIndex={showPrev ? 0 : -1}
        >
          <svg viewBox="0 0 12 18" width="18" height="24" aria-hidden>
            <path
              d="m10 2-8 7 8 7"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </button>

        {/* Scrollable list */}
        <div className="rc-track" ref={listRef}  role="list" aria-label="Customer reviews">
          {items.map((it) => (
            <article className="rc-card" key={it.id} role="listitem">
              <div className="rc-image-wrap">
                <img src={it.img} alt={it.title} className="rc-image" />
                <div className="rc-rating-pill" aria-hidden="true">
                  <span className="rc-stars" title={`${it.rating ?? 5} out of 5`}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg
                        key={i}
                        viewBox="0 0 24 24"
                        width="14"
                        height="14"
                        className={`star ${i < (it.rating ?? 5) ? "filled" : ""}`}
                        aria-hidden
                      >
                        <path d="M12 .587l3.668 7.431L23.4 9.75l-5.7 5.556L18.8 23 12 19.77 5.2 23l1.095-7.694L.6 9.75l7.732-1.732z" />
                      </svg>
                    ))}
                  </span>
                </div>
              </div>

              <div className="rc-body">
              <p className="rc-author">{it.title}</p>
                <p className="rc-content">{it.meta}</p>
                
              </div>
            </article>
          ))}
        </div>

        {/* Next arrow */}
        <button
          className={`rc-arrow rc-next ${showNext ? "visible" : ""} ${isHover ? "hovered" : ""}`}
          aria-hidden={!showNext}
          aria-label="Next"
          onClick={() => scrollByDirection("next")}
        >
          <svg viewBox="0 0 12 18" width="18" height="24" aria-hidden>
            <path
              d="m2 2 8 7-8 7"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}