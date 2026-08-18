type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;

  align?: "left" | "center";
};

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: SectionHeadingProps) {
  const alignment =
    align === "center" ? "items-center text-center" : "items-start text-left";

  return (
    <div className={`flex max-w-3xl flex-col ${alignment}`}>
      {eyebrow && (
        <p className="font-body mb-3 text-sm font-bold uppercase tracking-[0.22em] text-violet-600 dark:text-cyan-300">
          {eyebrow}
        </p>
      )}

      <h2 className="font-display text-4xl leading-none tracking-wide md:text-6xl">
        {title}
      </h2>

      {description && (
        <p className="font-body mt-5 max-w-2xl text-lg leading-8 text-[var(--foreground-muted)]">
          {description}
        </p>
      )}
    </div>
  );
}
