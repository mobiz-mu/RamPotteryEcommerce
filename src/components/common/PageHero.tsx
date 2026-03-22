type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export default function PageHero({ eyebrow, title, description }: Props) {
  return (
    <section className="border-b border-neutral-200 bg-white">
      <div className="container-padded py-16 sm:py-20">
        {eyebrow ? (
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-red-600">
            {eyebrow}
          </p>
        ) : null}

        <h1 className="max-w-4xl text-balance text-4xl font-semibold tracking-tight text-neutral-950 sm:text-5xl">
          {title}
        </h1>

        {description ? (
          <p className="mt-5 max-w-3xl text-lg leading-8 text-neutral-600">
            {description}
          </p>
        ) : null}
      </div>
    </section>
  );
}