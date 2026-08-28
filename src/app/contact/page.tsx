import type { Metadata } from "next";
import Image from "next/image";
import { GithubIcon, LinkedinIcon, MailIcon } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { H2, Link } from "@/components/typography";
import styles from "./contact.module.css";

export const metadata: Metadata = {
	title: "Contact",
	description: "Get in touch with Jay Griffin.",
};

const links = [
	{
		href: "mailto:jay@jaygriff.com",
		label: "jay@jaygriff.com",
		icon: MailIcon,
		external: false,
	},
	{
		href: "https://github.com/jaygriffinjay",
		label: "GitHub",
		icon: GithubIcon,
		external: true,
	},
	{
		href: "https://linkedin.com/in/jaygriffinjay",
		label: "LinkedIn",
		icon: LinkedinIcon,
		external: true,
	},
];

export default function ContactPage() {
	return (
		<Container className={styles.container}>
			<header className={styles.header}>
				<Image
					src="/images/me.jpg"
					alt="Jay Griffin"
					width={200}
					height={200}
					priority
					className={styles.portrait}
				/>
                <H2 className={styles.title}>Contact Me</H2>
			</header>

			<nav className={styles.links} aria-label="Contact links">
				{links.map(({ href, label, icon: Icon, external }) => (
					<Link
						key={href}
						href={href}
						className={styles.contactLink}
						{...(external
							? { target: "_blank", rel: "noopener noreferrer" }
							: {})}
					>
						<span className={styles.iconSlot} aria-hidden="true">
							<Icon />
						</span>
						<span className={styles.label}>{label}</span>
						<span className={styles.arrow} aria-hidden="true">
							↗
						</span>
					</Link>
				))}
			</nav>
		</Container>
	);
}
