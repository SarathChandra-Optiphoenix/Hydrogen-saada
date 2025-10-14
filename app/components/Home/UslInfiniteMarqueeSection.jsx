import { useMemo } from "react";

export function UslInfiniteMarqueeSection({
  items = [],
  itemWidth = 280,
  itemHeight = 48,
  gap = 28,
  duration = 36,
  startIndex = 0,
}) {
  // duplicate list (list concat itself) to create seamless loop
  const doubled = useMemo(() => [...items, ...items], [items]);

  // compute negative delay so animation appears to start as if progressed
  const len = Math.max(items.length, 1);
  const negDelay = -Math.min(duration, (duration * (startIndex % len)) / len);

  const rootStyle = {
    ["--usl-item-w"]: `${itemWidth}px`,
    ["--usl-item-h"]: `${itemHeight}px`,
    ["--usl-gap"]: `${gap}px`,
    ["--usl-duration"]: `${duration}s`,
    ["--usl-delay"]: `${negDelay}s`,
  };

  return (
    <div className="usl-infinite-marquee" style={rootStyle}>
      <div className="usl-infinite-viewport" aria-hidden="false">
        <div
          className="usl-infinite-track"
          style={{ animationDelay: "var(--usl-delay)" }}
        >
          {doubled.map((it, i) => {
            const key = `${it.id ?? "item"}-${i}`;
            return (
              <div className="usl-item-slot" key={key} role="listitem">
                <div className="usl-item-inner heading">
                  {it.svg ? <span className="usl-svg">{it.svg}</span> : null}
                  <span className="usl-text">{it.text}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}