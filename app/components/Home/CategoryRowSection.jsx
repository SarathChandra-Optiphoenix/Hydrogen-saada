export function CategoryRow({categories}) {
    return (
      <section className="category-row">
        <div className="category-scroll">
          {categories.map((c) => (
            <a key={c.key} href={`/collections/${c.handle}`} style={{ textDecoration: "none !important"}} >
              <div
                key={c.id}
                className="category-pill"
                role="button"
                tabIndex={0}
                style={{ textDecoration: "none !important"}}
              >
                <div className="category-thumb">
                  <img src={c.img} alt={c.title} />
                </div>
                <div className="cat-title">{c.title}</div>
              </div>
            </a>
          ))}
        </div>
        <div className="category-topline" aria-hidden="true" />
      </section>
    );
  }
