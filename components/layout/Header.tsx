"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useTranslation } from "@components/i18n/LanguageProvider";
import LanguageSwitcher from "@components/i18n/LanguageSwitcher";
import routes from "@/routes/RouteStackList";

export default function Navbar() {
	const { t } = useTranslation();
	const [isOpen, setIsOpen] = useState(false);

	// Close menu when screen resizes to larger than lg
	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth >= 1024) {
				setIsOpen(false);
			}
		};

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	// Prevent scroll when menu is open
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "unset";
		}
		return () => {
			document.body.style.overflow = "unset";
		};
	}, [isOpen]);

	const handleLinkClick = () => {
		setIsOpen(false);
	};

	return (
		<header className="sticky top-0 z-50 w-full border-b border-zinc-200/60 bg-white/80 backdrop-blur-lg dark:border-zinc-800/60 dark:bg-black/80">
			<div className="mx-auto max-w-4xl px-6 py-4">
				<div className="flex items-center justify-between">
					{/* Logo */}
					<Link href={routes.home} className="text-lg font-bold tracking-tight text-zinc-900 transition-opacity hover:opacity-70 dark:text-zinc-100">
						KY
					</Link>

					{/* Desktop Navigation */}
					<nav className="hidden lg:block ml-auto mr-8">
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

					{/* Desktop Language Switcher */}
					<div className="hidden lg:block">
						<LanguageSwitcher />
					</div>

					{/* Mobile Menu Button */}
					<button
						onClick={() => setIsOpen(!isOpen)}
						className="lg:hidden p-2 rounded-lg text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
						aria-label="Toggle menu"
					>
						<svg
							className={`w-5 h-5 transition-transform duration-300 ${isOpen ? "rotate-90" : ""}`}
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							{isOpen ? (
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
							) : (
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
							)}
						</svg>
					</button>
				</div>

				{/* Mobile Menu */}
				{isOpen && (
					<>
						{/* Backdrop */}
						<div
							className="fixed inset-0 bg-black/20 lg:hidden z-40"
							onClick={() => setIsOpen(false)}
						/>

						{/* Dropdown Menu */}
						<nav className="fixed left-0 right-0 top-[72px] w-full border-b border-zinc-200/60 bg-white z-50 lg:hidden dark:border-zinc-800/60 dark:bg-black">
							<div className="mx-auto max-w-4xl px-6 py-4">
								<ul className="flex flex-col gap-1">
									<li>
										<Link
											href={routes.projects}
											onClick={handleLinkClick}
											className="block rounded-lg px-3 py-2.5 text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-100"
										>
											{t("nav.projects")}
										</Link>
									</li>
									<li>
										<Link
											href={routes.blog}
											onClick={handleLinkClick}
											className="block rounded-lg px-3 py-2.5 text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-100"
										>
											{t("nav.blog")}
										</Link>
									</li>
									<li className="mt-2 border-t border-zinc-200/60 pt-3 dark:border-zinc-800/60">
										<LanguageSwitcher />
									</li>
								</ul>
							</div>
						</nav>
					</>
				)}
			</div>
		</header>
	);
}
