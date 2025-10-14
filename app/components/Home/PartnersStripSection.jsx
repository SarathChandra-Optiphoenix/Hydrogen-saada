
import Partner1 from '~/assets/images/CMAI-logo.avif';
import Partner2 from '~/assets/images/partener-logo.avif';
import Partner3 from '~/assets/images/CNBC-logo.avif';
import Partner4 from '~/assets/images/Inc_logo.avif';
import Partner5 from '~/assets/images/Apparel-logo.webp';
import Partner6 from '~/assets/images/Indianstartuptimes-logo.webp';

const logos = [
  Partner1,
  Partner2,
  Partner3,
  Partner4,
  Partner5,
  Partner6
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