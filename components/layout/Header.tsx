"use client";

import Link from "next/link";
import { useTranslation } from "@components/i18n/LanguageProvider";
import LanguageSwitcher from "@components/i18n/LanguageSwitcher";
import routes from "@/routes/RouteStackList";

export default function Navbar() {
	const { t } = useTranslation();

	return (
		<header className="sticky top-0 z-50 w-full border-b border-zinc-200/60 bg-white/80 backdrop-blur-lg dark:border-zinc-800/60 dark:bg-black/80">
			<div className="mx-auto max-w-4xl px-6 py-4">
				<div className="flex items-center justify-between">
					{/* Logo */}
					<Link href={routes.home} className="text-lg font-bold tracking-tight text-zinc-900 transition-opacity hover:opacity-70 dark:text-zinc-100">
						KY
					</Link>

					{/* Navigation */}
					<nav className="ml-auto mr-8">
						<ul className="flex gap-8 text-sm">
							<li>
								<Link href={routes.projects} className="text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
									{t("nav.projects")}
								</Link>
							</li>
							<li>
								<Link href={routes.blog} className="text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">
									{t("nav.blog")}
								</Link>
							</li>
						</ul>
					</nav>

					{/* Language Switcher */}
					<LanguageSwitcher />
				</div>
			</div>
		</header>
	);
}
