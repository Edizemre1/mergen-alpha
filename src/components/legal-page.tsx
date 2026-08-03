export interface LegalSection {
  readonly title: string;
  readonly body: string;
}

export function LegalPage({
  eyebrow,
  title,
  intro,
  sections,
}: {
  readonly eyebrow: string;
  readonly title: string;
  readonly intro: string;
  readonly sections: readonly LegalSection[];
}) {
  return (
    <article className="legal-page">
      <header className="page-header">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{intro}</p>
      </header>
      <div className="legal-sections">
        {sections.map((section) => (
          <section key={section.title}>
            <h2>{section.title}</h2>
            <p>{section.body}</p>
          </section>
        ))}
      </div>
    </article>
  );
}
