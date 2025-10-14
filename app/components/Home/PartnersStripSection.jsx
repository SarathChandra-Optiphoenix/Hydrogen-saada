const logos = [
  'https://saadaa.in/cdn/shop/files/5_5e283120-e1aa-4957-8ab6-fb69e4d58490.png?v=1744436770&width=180',
  'https://saadaa.in/cdn/shop/files/4_41d58c42-ae17-4a83-a599-002ab84a78b2.png?v=1744436770&width=180',
  'https://saadaa.in/cdn/shop/files/6_81a9d37c-3091-4c0c-aad8-7ba4c5a0ddeb.png?v=1744436769&width=180',
  'https://saadaa.in/cdn/shop/files/3_85ab524e-bb5d-4fbd-a29b-263fcfe7bdc0.png?v=1744436770&width=180',
  'https://saadaa.in/cdn/shop/files/2_b7e2acee-da5c-4843-9661-c92ce652dfe7.png?v=1744436770&width=180',
  'https://saadaa.in/cdn/shop/files/1_34fd8e13-b431-47e5-8db0-f0805145c5cf.png?v=1744436770&width=180'
];

export function PartnersStrip() {
  const looped = [...logos, ...logos, ...logos]; // triple for seamless scroll

  return (
    <section className="partners">
      <div className="partners-marquee">
        <div className="partners-track">
          {looped.map((src, i) => (
            <div className="partners-item" key={i}>
              <img src={src} alt={`partner-${i % logos.length}`} loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}