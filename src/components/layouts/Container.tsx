import type { ReactNode } from "react";

type ContainerProps = {
	children: ReactNode;
	className?: string;
	size?: "sm" | "md" | "lg" | "xl" | "full";
};

export function Container({
	children,
	className = "",
	size = "md",
}: ContainerProps) {
	const sizeClasses = {
		sm: "max-w-2xl",
		md: "max-w-4xl",
		lg: "max-w-6xl",
		xl: "max-w-7xl",
		full: "max-w-full",
	};

	return (
		<div className={`mx-auto ${sizeClasses[size]} ${className}`}>
			{children}
		</div>
	);
}
