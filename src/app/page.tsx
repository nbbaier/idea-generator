"use client";

import { useCallback, useState } from "react";
import {
	Container,
	ContentArea,
	Footer,
	Header,
	PageLayout,
} from "@/components/layouts";
import { Response as AIResponse } from "@/components/response";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "@/hooks/use-toast";

export default function Page() {
	const [resultMarkdown, setResultMarkdown] = useState("");
	const [isStreaming, setIsStreaming] = useState(false);

	const generateProjectIdea = useCallback(async () => {
		try {
			setIsStreaming(true);
			setResultMarkdown("");
			const response = await fetch("/api/generate", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ messages: [] }),
			});
			if (!response.ok || !response.body) {
				throw new Error("Failed to start streaming response");
			}
			const reader = response.body.getReader();
			const decoder = new TextDecoder();
			while (true) {
				const { done, value } = await reader.read();
				if (done) break;
				setResultMarkdown(
					(prev) => prev + decoder.decode(value, { stream: true }),
				);
			}
			// Flush any remaining decoded bytes after the stream ends
			setResultMarkdown((prev) => prev + decoder.decode());
		} catch (error: unknown) {
			const message = error instanceof Error ? error.message : "Unknown error";
			toast({
				title: "Generation Failed",
				description: message,
				variant: "destructive",
			});
		} finally {
			setIsStreaming(false);
		}
	}, []);

	const handleCopyMarkdown = useCallback(async () => {
		if (!resultMarkdown) return;
		try {
			await navigator.clipboard.writeText(resultMarkdown);
			toast({
				title: "Copied",
				description: "Markdown copied to clipboard.",
			});
		} catch (error: unknown) {
			const message = error instanceof Error ? error.message : "Unknown error";
			toast({
				title: "Copy Failed",
				description: message,
				variant: "destructive",
			});
		}
	}, [resultMarkdown]);

	return (
		<PageLayout>
			<Container>
				<Header
					title="Project Idea Generator"
					description="Get inspired with AI-generated web development project ideas."
				/>

				<ContentArea>
					<div className="w-full max-w-3xl mx-auto space-y-6">
						<div className="min-h-[300px]">
							<AIResponse>{resultMarkdown}</AIResponse>
						</div>

						<div className="flex justify-center">
							<div className="flex gap-3">
								<button
									type="button"
									onClick={generateProjectIdea}
									disabled={isStreaming}
									aria-busy={isStreaming}
									className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
									aria-label="Generate Project Idea"
								>
									{isStreaming ? "Generating..." : "Generate Project Idea"}
								</button>
								<button
									type="button"
									onClick={handleCopyMarkdown}
									disabled={!resultMarkdown}
									className="px-6 py-3 border border-gray-300 text-gray-700 bg-white rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
									aria-label="Copy to Markdown"
								>
									Copy to Markdown
								</button>
							</div>
						</div>
					</div>
				</ContentArea>

				<Footer>
					<p>Powered by OpenAI • Built with React & Tailwind CSS</p>
				</Footer>
			</Container>

			<Toaster />
		</PageLayout>
	);
}
