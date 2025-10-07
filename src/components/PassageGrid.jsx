import { Link } from "react-router-dom";

export default function PassageGrid({ passages }) {
  if (!passages.length) {
    return <p className="empty-state">No adventures match those filters yet.</p>;
  }

  return (
    <section className="card-grid" aria-live="polite">
      {passages.map(passage => (
        <article className="card" key={passage.id}>
          <Link className="card__link" to={`/passages/${encodeURIComponent(passage.id)}`}>
            <figure className="card__figure">
              <img src={passage.coverImage} alt={passage.imageAlt} loading="lazy" />
              <figcaption className="pill">{passage.categoryLabel}</figcaption>
            </figure>
            <div className="card__body">
              <h3>{passage.title}</h3>
              <p className="card__summary">
                {passage.summary.length > 140
                  ? `${passage.summary.slice(0, 137)}...`
                  : passage.summary}
              </p>
              <p className="card__meta">{passage.wordCount} words • {passage.readingLevel}</p>
            </div>
          </Link>
        </article>
      ))}
    </section>
  );
}
