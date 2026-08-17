import Link from "next/link";
import Image from "next/image";

interface BlogCardProps {
  title: string;
  description?: string;
  href: string;
  image?: string;
}

export function BlogCard({ title, description, href, image }: BlogCardProps) {
  return (
    <Link
      href={href}
      className="group my-6 block !no-underline transition-all duration-200 hover:scale-[1.02] hover:!no-underline"
    >
      <article className="cursor-pointer overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition-all duration-200 hover:border-blue-300 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-blue-800 dark:hover:bg-zinc-900/80">
        {/* Image container */}
        {image && (
          <div className="relative h-48 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover transition-transform duration-200 group-hover:scale-105"
            />
          </div>
        )}

        {/* Content */}
        <div className="p-5 sm:p-6">
          {/* Title */}
          <h3 className="mb-2 text-base font-semibold leading-tight text-blue-600 !no-underline transition-colors group-hover:!no-underline sm:text-lg dark:text-blue-400">
            {title}
          </h3>

          {/* Description */}
          {description && (
            <p className="text-sm leading-relaxed text-zinc-600 !no-underline group-hover:!no-underline dark:text-zinc-400">
              {description}
            </p>
          )}

          {/* Arrow indicator */}
          <div className="mt-4 inline-flex items-center text-xs font-medium text-zinc-500 transition-colors group-hover:text-blue-600 dark:text-zinc-400 dark:group-hover:text-blue-400">
            Open tool
            <svg
              className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </article>
    </Link>
  );
}
