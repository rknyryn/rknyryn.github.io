"use client";

import Link from "next/link";
import profile from "@data/profile.json";
import { useTranslation } from "@components/i18n/LanguageProvider";
import LanguageSwitcher from "@components/i18n/LanguageSwitcher";

export default function Navbar() {
	const { t } = useTranslation();

	return (
		<header className="w-full border-b border-solid border-black/[.06] bg-background">
			<div className="mx-auto max-w-4xl px-6 py-4">
				<div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
					<Link href="/" className="text-lg font-semibold">KY</Link>

					<nav className="w-full sm:w-auto sm:ml-auto">
						<ul className="flex flex-wrap justify-start gap-4 text-sm sm:justify-end">
							<li>
								<Link href="/about" className="hover:underline">{t("nav.about")}</Link>
							</li>
							<li>
								<Link href="/projects" className="hover:underline">{t("nav.projects")}</Link>
							</li>
							<li>
								<Link href="/blog" className="hover:underline">{t("nav.blog")}</Link>
							</li>
							<li>
								<Link href="/contact" className="hover:underline">{t("nav.contact")}</Link>
							</li>
						</ul>
					</nav>

					<div className="mt-3 sm:mt-0">
						<LanguageSwitcher />
					</div>
				</div>
			</div>
		</header>
	);
}
