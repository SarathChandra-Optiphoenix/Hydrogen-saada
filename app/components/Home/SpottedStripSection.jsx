import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function SpottedStripSection() {
  const scrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const people = [
    { name: "Tina Dutta", img: "https://cdn.shopify.com/s/files/1/0450/3476/6485/files/whatmore_b2291fef-b8e6-4ecd-a2fb-23153675b339.webp?width=400" },
    { name: "Aneri Vajani", img: "https://cdn.shopify.com/s/files/1/0450/3476/6485/files/whatmore_47674572-18c7-4609-95da-2bb08d32ae67.webp?width=400" },
    { name: "Pooja Gaur", img: "https://cdn.shopify.com/s/files/1/0450/3476/6485/files/whatmore_abe45dfe-c78d-460f-bba1-1b02eb046e77.webp?width=400" },
    { name: "Sana Makbul", img: "https://cdn.shopify.com/s/files/1/0450/3476/6485/files/whatmore_654b8860-c319-41d4-90b7-e2effdc12adf.webp?width=400" },
    { name: "Hansika Motwani", img: "https://cdn.shopify.com/s/files/1/0450/3476/6485/files/whatmore_079b0ba9-fe20-4aab-bd81-c4dc8b316cfc.webp?width=400" },
    { name: "Barkha Sen", img: "https://cdn.shopify.com/s/files/1/0450/3476/6485/files/whatmore_f5fef4b2-c7dc-4d64-81c2-55ebdaf8b283.webp?width=400" },
    { name: "Puja Sharma", img: "https://cdn.shopify.com/s/files/1/0450/3476/6485/files/whatmore_b75f6e1c-a56f-4cd7-85a8-024c1261bb6d.webp?width=400" },
    { name: "Akanksha Singh", img: "https://cdn.shopify.com/s/files/1/0450/3476/6485/files/whatmore_483616e2-c13a-4027-9096-dc2b2057977d.webp?width=400" },
    { name: "Anita H Ready", img: "https://cdn.shopify.com/s/files/1/0450/3476/6485/files/whatmore_cce7e024-f750-4587-835b-193b268db3a4.webp?width=400" },
    { name: "Anjali Anand", img: "https://cdn.shopify.com/s/files/1/0450/3476/6485/files/whatmore_4b2ddb63-f74b-47d0-8c00-8b67c302999c.webp?width=400" },
  ];

  const checkArrows = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    checkArrows();
    const element = scrollRef.current;
    if (element) {
      element.addEventListener("scroll", checkArrows);
      window.addEventListener("resize", checkArrows);
    }
    return () => {
      if (element) {
        element.removeEventListener("scroll", checkArrows);
      }
      window.removeEventListener("resize", checkArrows);
    };
  }, []);

  const scroll = (dir) => {
    if (scrollRef.current) {
      const width = scrollRef.current.clientWidth;
      scrollRef.current.scrollBy({ left: dir === "left" ? -width : width, behavior: "smooth" });
    }
  };

  return (
    <section className="spotted-section">
      <div className="container text-center">
        <h2>#Spotted in SAADAA</h2>
        <p className="subtitle">When simplicity meets the spotlight.</p>
      </div>
      <div className="spotted-carousel">
        {showLeftArrow && (
          <button className="nav-btn left" onClick={() => scroll("left")}>
            <ChevronLeft size={28} />
          </button>
        )}
        <div className="spotted-track" ref={scrollRef}>
          {people.map((p, i) => (
            <div key={i} className="spotted-item">
              <div className="circle">
                <img src={p.img} alt={p.name} />
              </div>
              <p>{p.name}</p>
            </div>
          ))}
        </div>
        {showRightArrow && (
          <button className="nav-btn right" onClick={() => scroll("right")}>
            <ChevronRight size={28} />
          </button>
        )}
      </div>
    </section>
  );
}