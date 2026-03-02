"use client";

import { useTranslation } from "@components/i18n/LanguageProvider";

type Props = {
  title: string;
  description: string;
  tags?: string[];
  link?: string;
};

export default function ProjectCard({
  title,
  description,
  tags = [],
  link,
}: Props) {
  const { t } = useTranslation();

  const Wrapper = link ? "a" : "div";
  const wrapperProps = link
    ? { href: link, target: "_blank" as const, rel: "noreferrer" }
    : {};

  return (
    <Wrapper
      {...wrapperProps}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-zinc-200/60 bg-white/70 p-6 backdrop-blur-sm transition-all duration-300 hover:border-zinc-300/80 hover:shadow-lg hover:shadow-zinc-200/40 dark:border-zinc-800/60 dark:bg-zinc-900/70 dark:hover:border-zinc-700/80 dark:hover:shadow-zinc-900/40"
    >
      {/* Subtle gradient hover glow */}
      <div className="pointer-events-none absolute -inset-px rounded-xl bg-linear-to-br from-violet-500/0 via-sky-500/0 to-violet-500/0 opacity-0 transition-opacity duration-300 group-hover:from-violet-500/5 group-hover:via-sky-500/5 group-hover:to-violet-500/5 group-hover:opacity-100" />

      <div className="relative flex flex-1 flex-col">
        <h3 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          {title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
          {description}
        </p>
        {tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-zinc-200/80 bg-zinc-50 px-2.5 py-0.5 text-xs font-medium text-zinc-600 dark:border-zinc-700/80 dark:bg-zinc-800/60 dark:text-zinc-400"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        {link && (
          <div className="mt-auto pt-5">
            <span className="text-sm font-medium text-zinc-400 transition-colors group-hover:text-violet-600 dark:text-zinc-500 dark:group-hover:text-violet-400">
              {t("project.view")}
            </span>
          </div>
        )}
      </div>
    </Wrapper>
  );
}
