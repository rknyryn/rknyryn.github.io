import React from "react";

type Props = {
	title?: string;
	children: React.ReactNode;
};

export default function Section({ title, children }: Props) {
	return (
		<section className="mx-auto max-w-4xl px-6 py-16">
			{title && (
				<div className="mb-10 flex items-center gap-4">
					<div className="h-px flex-1 bg-linear-to-r from-transparent via-zinc-200 to-transparent dark:via-zinc-800" />
					<h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
						{title}
					</h2>
					<div className="h-px flex-1 bg-linear-to-r from-transparent via-zinc-200 to-transparent dark:via-zinc-800" />
				</div>
			)}
			<div>{children}</div>
		</section>
	);
}
