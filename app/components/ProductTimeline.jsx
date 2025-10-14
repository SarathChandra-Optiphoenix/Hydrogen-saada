
import {useEffect, useState} from 'react';

export function ProductTimeline() {
  const [dates, setDates] = useState({
    orderBy: '—',
    dispatchBy: '—',
    deliveryBy: '—',
  });

  useEffect(() => {
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const ordinal = n => {
      const j = n % 10, k = n % 100;
      if (k >= 11 && k <= 13) return n + 'th';
      if (j === 1) return n + 'st';
      if (j === 2) return n + 'nd';
      if (j === 3) return n + 'rd';
      return n + 'th';
    };
    const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
    const fmt = d => `${months[d.getMonth()]} ${ordinal(d.getDate())}`;
    const range = (a,b) => {
      const sameMonth = a.getMonth()===b.getMonth() && a.getFullYear()===b.getFullYear();
      return sameMonth
        ? `${months[a.getMonth()]} ${ordinal(a.getDate())}–${ordinal(b.getDate())}`
        : `${fmt(a)}–${fmt(b)}`;
    };

    const now = new Date();
    setDates({
      orderBy: fmt(now),
      dispatchBy: range(addDays(now,0), addDays(now,1)),
      deliveryBy: range(addDays(now,2), addDays(now,5)),
    });
  }, []);

  return (
    <section className="product-timeline" aria-label="Order status timeline">
      <div className="product-timeline-track">
        <div className="product-timeline-step" aria-current="step">
          <div className="product-timeline-icon"><svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="9" cy="20" r="1"></circle>
            <circle cx="17" cy="20" r="1"></circle>
            <path d="M3 3h2l2.4 10.4A2 2 0 0 0 9.36 15H18a2 2 0 0 0 2-1.6L22 7H6"></path>
          </svg></div>
          <div className="product-timeline-date">{dates.orderBy}</div>
          <div className="product-timeline-label">Order Placed</div>
        </div>
        <div className="product-timeline-step">
          <div className="product-timeline-icon"><svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3 7h11v8H3z"></path>
            <path d="M14 10h4l3 3v2h-7"></path>
            <circle cx="7" cy="18" r="2"></circle>
            <circle cx="17" cy="18" r="2"></circle>
          </svg></div>
          <div className="product-timeline-date">{dates.dispatchBy}</div>
          <div className="product-timeline-label">Order Shipped</div>
        </div>
        <div className="product-timeline-step">
          <div className="product-timeline-icon"><svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M3 7l9-4 9 4-9 4-9-4z"></path>
            <path d="M3 7v10l9 4 9-4V7"></path>
            <path d="M12 11v10"></path>
          </svg></div>
          <div className="product-timeline-date">{dates.deliveryBy}</div>
          <div className="product-timeline-label">Estimated Delivery</div>
        </div>
      </div>
    </section>
  );
}