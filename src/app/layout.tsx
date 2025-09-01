import type { Metadata } from "next";
import "../index.css";

import { Atkinson_Hyperlegible_Next, IBM_Plex_Sans } from "next/font/google";

// If loading a variable font, you don't need to specify the font weight
const inter = IBM_Plex_Sans({
	subsets: ["latin", "latin-ext"],
	display: "swap",
});
export const metadata: Metadata = {
	title: "AI Project Idea Generator",
	description: "Get inspired with AI-generated web development project ideas.",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" className={inter.className}>
			<body>{children}</body>
		</html>
	);
}
