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
		<header className="w-full border-b border-solid border-black/[.06] bg-background">
			<div className="mx-auto max-w-4xl px-6 py-4">
				<div className="flex items-center justify-between">
					{/* Logo */}
					<Link href={routes.home} className="text-lg font-bold hover:opacity-70 transition-opacity">
						KY
					</Link>

					{/* Desktop Navigation */}
					<nav className="hidden lg:block ml-auto mr-8">
						<ul className="flex gap-8 text-sm">
							<li>
								<Link href={routes.about} className="hover:underline transition-all hover:opacity-70">
									{t("nav.about")}
								</Link>
							</li>
							<li>
								<Link href={routes.projects} className="hover:underline transition-all hover:opacity-70">
									{t("nav.projects")}
								</Link>
							</li>
							<li>
								<Link href={routes.blog} className="hover:underline transition-all hover:opacity-70">
									{t("nav.blog")}
								</Link>
							</li>
							<li>
								<Link href={routes.contact} className="hover:underline transition-all hover:opacity-70">
									{t("nav.contact")}
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
						className="lg:hidden p-2 hover:bg-black/5 rounded-lg transition-colors"
						aria-label="Toggle menu"
					>
						<svg
							className={`w-6 h-6 transition-transform duration-300 ${isOpen ? "rotate-90" : ""}`}
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							{isOpen ? (
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
							) : (
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
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
						<nav className="fixed left-0 right-0 top-[72px] w-full bg-background border-b border-black/[.06] z-50 lg:hidden">
							<div className="mx-auto max-w-4xl px-6 py-4">
								<ul className="flex flex-col gap-4">
									<li>
										<Link
											href={routes.about}
											onClick={handleLinkClick}
											className="block py-2 hover:text-gray-600 transition-colors"
										>
											{t("nav.about")}
										</Link>
									</li>
									<li>
										<Link
											href={routes.projects}
											onClick={handleLinkClick}
											className="block py-2 hover:text-gray-600 transition-colors"
										>
											{t("nav.projects")}
										</Link>
									</li>
									<li>
										<Link
											href={routes.blog}
											onClick={handleLinkClick}
											className="block py-2 hover:text-gray-600 transition-colors"
										>
											{t("nav.blog")}
										</Link>
									</li>
									<li>
										<Link
											href={routes.contact}
											onClick={handleLinkClick}
											className="block py-2 hover:text-gray-600 transition-colors"
										>
											{t("nav.contact")}
										</Link>
									</li>
									<li className="pt-2 border-t border-black/[.06]">
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
