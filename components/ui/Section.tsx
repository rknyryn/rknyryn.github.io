import React from "react";

type Props = {
	title?: string;
	children: React.ReactNode;
};

export default function Section({ title, children }: Props) {
	return (
		<section className="mx-auto max-w-4xl px-6 py-12">
			{title && <h2 className="mb-6 text-2xl font-semibold">{title}</h2>}
			<div>{children}</div>
		</section>
	);
}
