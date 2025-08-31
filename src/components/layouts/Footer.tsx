import type { ReactNode } from "react";

type FooterProps = {
	children: ReactNode;
	className?: string;
};

export function Footer({ children, className = "" }: FooterProps) {
	return (
		<div className={`pt-8 text-sm text-center text-gray-500 ${className}`}>
			{children}
		</div>
	);
}
