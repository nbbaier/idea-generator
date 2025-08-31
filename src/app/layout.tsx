import type { Metadata } from "next";
import "../index.css";

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
		<html lang="en">
			<body>{children}</body>
		</html>
	);
}
