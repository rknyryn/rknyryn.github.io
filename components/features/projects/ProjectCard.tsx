"use client";

import { useTranslation } from "@components/i18n/LanguageProvider";

type Props = {
	title: string;
	description: string;
	tags?: string[];
	link?: string;
};

export default function ProjectCard({ title, description, tags = [], link }: Props) {
	const { t } = useTranslation();

	return (
		<article className="card rounded-lg p-6 shadow-md bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100 border border-black/[.04] dark:border-white/[.06]">
			<h3 className="text-lg font-semibold">{title}</h3>
			<p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">{description}</p>
			{tags.length > 0 && (
				<div className="mt-3 flex flex-wrap gap-2">
					{tags.map((t) => (
						<span key={t} className="rounded-full bg-zinc-100 px-2 py-1 text-xs text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
							{t}
						</span>
					))}
				</div>
			)}
			{link && (
				<div className="mt-4">
					<a href={link} target="_blank" rel="noreferrer" className="text-sm font-medium text-sky-600 dark:text-sky-400">
						{t("project.view")}
					</a>
				</div>
			)}
		</article>
	);
}
