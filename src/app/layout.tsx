import type { Metadata } from "next";

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
			<body>
				{/** biome-ignore lint/correctness/useUniqueElementIds: don't care about this problem */}
				<div id="root">{children}</div>
			</body>
		</html>
	);
}
