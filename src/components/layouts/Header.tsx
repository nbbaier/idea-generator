import type { ReactNode } from "react";

type HeaderProps = {
	title: string;
	description?: string;
	children?: ReactNode;
	className?: string;
};

export function Header({
	title,
	description,
	children,
	className = "",
}: HeaderProps) {
	return (
		<div className={`space-y-4 text-center ${className}`}>
			<h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
				{title}
			</h1>
			{description && (
				<p className="mx-auto max-w-2xl text-lg leading-relaxed text-gray-600">
					{description}
				</p>
			)}
			{children}
		</div>
	);
}
