import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type ProjectIdeaDisplayProps = {
	content: string;
	isStreaming: boolean;
	isLoading: boolean;
};

export function ProjectIdeaDisplay({
	content,
	isStreaming,
	isLoading,
}: ProjectIdeaDisplayProps) {
	const [displayedContent, setDisplayedContent] = useState("");
	const [currentIndex, setCurrentIndex] = useState(0);

	useEffect(() => {
		if (!isStreaming) {
			setDisplayedContent(content);
			setCurrentIndex(content.length);
			return;
		}

		if (currentIndex < content.length) {
			const timer = setTimeout(() => {
				setDisplayedContent(content.slice(0, currentIndex + 1));
				setCurrentIndex(currentIndex + 1);
			}, 20); // Adjust speed of streaming effect

			return () => clearTimeout(timer);
		}
	}, [content, currentIndex, isStreaming]);

	useEffect(() => {
		if (content !== displayedContent && !isStreaming) {
			setCurrentIndex(0);
			setDisplayedContent("");
		}
	}, [content, displayedContent, isStreaming]);

	if (isLoading) {
		return (
			<Card className="p-8 w-full max-w-3xl bg-white shadow-lg">
				<div className="space-y-6">
					<Skeleton className="w-3/4 h-8" />
					<div className="space-y-3">
						<Skeleton className="w-full h-4" />
						<Skeleton className="w-5/6 h-4" />
						<Skeleton className="w-4/5 h-4" />
					</div>
					<div className="space-y-2">
						<Skeleton className="w-1/3 h-6" />
						{Array.from({ length: 5 }).map(() => (
							<Skeleton
								className="w-4/5 h-4"
								key={Math.random().toString(36)}
							/>
						))}
					</div>
					<div className="space-y-2">
						<Skeleton className="w-1/4 h-6" />
						{Array.from({ length: 4 }).map(() => (
							<Skeleton
								className="w-2/5 h-4"
								key={Math.random().toString(36)}
							/>
						))}
					</div>
				</div>
			</Card>
		);
	}

	return (
		<Card className="p-8 w-full max-w-3xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl">
			<div className="max-w-none prose prose-lg">
				<MarkdownRenderer content={displayedContent} />
				{isStreaming && (
					<span className="inline-block ml-1 w-3 h-6 bg-gray-800 animate-pulse" />
				)}
			</div>
		</Card>
	);
}

function MarkdownRenderer({ content }: { content: string }) {
	const lines = content.split("\n");
	const elements: JSX.Element[] = [];
	let listItems: JSX.Element[] = [];
	let elementId = 0;

	const flushList = () => {
		if (listItems.length > 0) {
			elements.push(
				<ul
					key={`list-${elementId++}`}
					className="mb-4 space-y-1 list-disc list-inside"
				>
					{listItems}
				</ul>,
			);
			listItems = [];
		}
	};

	lines.forEach((line) => {
		if (line.startsWith("# ")) {
			flushList();
			elements.push(
				<h1
					key={`h1-${elementId++}`}
					className="mb-6 text-3xl font-bold text-gray-900"
				>
					{line.slice(2)}
				</h1>,
			);
		} else if (line.startsWith("## ")) {
			flushList();
			elements.push(
				<h2
					key={`h2-${elementId++}`}
					className="mt-8 mb-4 text-xl font-semibold text-gray-800"
				>
					{line.slice(3)}
				</h2>,
			);
		} else if (line.startsWith("- ")) {
			const content = line.slice(2);
			const parts = content.split(/(\*\*.*?\*\*)/g);
			listItems.push(
				<li key={`item-${elementId++}`} className="mb-1 text-gray-700">
					{parts.map((part, i) =>
						part.startsWith("**") && part.endsWith("**") ? (
							<strong
								key={`strong-${elementId++}-${i}`}
								className="font-semibold"
							>
								{part.slice(2, -2)}
							</strong>
						) : (
							part
						),
					)}
				</li>,
			);
		} else if (line.trim() === "") {
			flushList();
			if (elements.length > 0) {
				elements.push(<div key={`spacer-${elementId++}`} className="mb-4" />);
			}
		} else {
			flushList();
			const parts = line.split(/(\*\*.*?\*\*)/g);
			elements.push(
				<p key={`p-${elementId++}`} className="mb-2">
					{parts.map((part, i) =>
						part.startsWith("**") && part.endsWith("**") ? (
							<strong
								key={`strong-${elementId++}-${i}`}
								className="font-semibold"
							>
								{part.slice(2, -2)}
							</strong>
						) : (
							part
						),
					)}
				</p>,
			);
		}
	});

	flushList();
	return <>{elements}</>;
}
