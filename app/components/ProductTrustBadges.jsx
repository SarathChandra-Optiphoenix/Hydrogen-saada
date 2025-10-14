export function ProductTrustBadges() {
  return (
    <div className="guarantee-hstack guarantee-gap desktop-only">
      <svg
        stroke="rgb(34, 197, 160)"
        fill="rgb(34, 197, 160)"
        strokeWidth="0"
        viewBox="0 0 16 16"
        role="presentation"
        height="20px"
        width="20px"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"></path>
      </svg>
      <span className="guarantee-text">7-Day Money Back Guarantee</span>
      <div className="guarantee-tooltip">
        <img
          src="https://cdn.shopify.com/s/files/1/0450/3476/6485/files/Group_2.svg?v=1747286143"
          alt="info"
        />
        <div className="guarantee-tooltip-text">
          Return or exchange within 7 days of delivery. Product must be unused
          with original packaging intact.
        </div>
      </div>
    </div>
  );
}
