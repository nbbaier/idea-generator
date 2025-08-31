import type { ReactNode } from "react";

type ContentAreaProps = {
	children: ReactNode;
	className?: string;
	spacing?: "sm" | "md" | "lg";
};

export function ContentArea({
	children,
	className = "",
	spacing = "lg",
}: ContentAreaProps) {
	const spacingClasses = {
		sm: "space-y-4",
		md: "space-y-6",
		lg: "space-y-8",
	};

	return (
		<div className={`space-y-8 ${spacingClasses[spacing]} ${className}`}>
			{children}
		</div>
	);
}
