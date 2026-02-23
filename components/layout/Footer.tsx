"use client";

import profile from "@data/profile.json";
import { useTranslation } from "@components/i18n/LanguageProvider";

export default function Footer() {
	const { t } = useTranslation();
	const year = new Date().getFullYear();
	return (
		<footer className="w-full border-t border-solid border-black/[.04] bg-background">
			<div className="mx-auto max-w-4xl px-6 py-8 text-sm text-zinc-600">
				<div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
					<div>© {year} {profile.name}. {t("footer.all_rights")}</div>
					<div className="flex gap-4">
						{profile.socials?.github && (
							<a href={profile.socials.github} target="_blank" rel="noreferrer" className="hover:underline">GitHub</a>
						)}
						{profile.socials?.linkedin && (
							<a href={profile.socials.linkedin} target="_blank" rel="noreferrer" className="hover:underline">LinkedIn</a>
						)}
					</div>
				</div>
			</div>
		</footer>
	);
}
