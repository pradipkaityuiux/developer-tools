export function LegalPage({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`mx-auto flex-1 px-4 py-12 sm:px-6 ${
        className ?? "max-w-3xl"
      }`}
    >
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">
        {title}
      </h1>
      <div className="mt-8 space-y-4 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
        {children}
      </div>
    </div>
  );
}
