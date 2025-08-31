import type { ReactNode } from "react";

type PageLayoutProps = {
	children: ReactNode;
	className?: string;
};

export function PageLayout({ children, className = "" }: PageLayoutProps) {
	return (
		<div
			className={`px-4 py-12 min-h-screen from-gray-50 to-gray-100 bg-gradient-to-br ${className}`}
		>
			{children}
		</div>
	);
}
