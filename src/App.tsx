import { useCallback, useEffect, useMemo, useState } from "react";
import { ActionButtons } from "@/components/ActionButtons";
import { ProjectIdeaDisplay } from "@/components/ProjectIdeaDisplay";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "@/hooks/use-toast";
import { OpenAIService } from "@/lib/openai";
import type { StreamingState } from "@/types";

function App() {
	const [projectIdea, setProjectIdea] = useState("");
	const [streamingState, setStreamingState] = useState<StreamingState>({
		isStreaming: false,
		streamedText: "",
		error: null,
	});
	const [isLoading, setIsLoading] = useState(false);

	const openaiService = useMemo(
		() => new OpenAIService(import.meta.env.VITE_OPENAI_API_KEY),
		[],
	);

	const generateProjectIdea = useCallback(async () => {
		if (!import.meta.env.VITE_OPENAI_API_KEY) {
			toast({
				title: "API Key Required",
				description:
					"Please add your OpenAI API key to the environment variables.",
				variant: "destructive",
			});
			return;
		}

		setIsLoading(true);
		setStreamingState({
			isStreaming: true,
			streamedText: "",
			error: null,
		});
		setProjectIdea("");

		try {
			const stream = await openaiService.generateProjectIdea();
			const reader = stream.getReader();
			let accumulatedText = "";

			while (true) {
				const { done, value } = await reader.read();

				if (done) {
					setStreamingState((prev) => ({
						...prev,
						isStreaming: false,
					}));
					setProjectIdea(accumulatedText);
					break;
				}

				accumulatedText += value;
				setStreamingState((prev) => ({
					...prev,
					streamedText: accumulatedText,
				}));
			}
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "An unknown error occurred";
			setStreamingState({
				isStreaming: false,
				streamedText: "",
				error: errorMessage,
			});
			toast({
				title: "Generation Failed",
				description: errorMessage,
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	}, [openaiService]);

	// Generate initial project idea on mount
	useEffect(() => {
		generateProjectIdea();
	}, [generateProjectIdea]);

	const currentContent = streamingState.isStreaming
		? streamingState.streamedText
		: projectIdea;

	return (
		<div className="px-4 py-12 min-h-screen from-gray-50 to-gray-100 bg-gradient-to-br">
			<div className="mx-auto space-y-8 max-w-4xl">
				{/* Header */}
				<div className="space-y-4 text-center">
					<h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
						Project Idea Generator
					</h1>
					<p className="mx-auto max-w-2xl text-lg leading-relaxed text-gray-600">
						Get inspired with AI-generated web development project ideas.
						Perfect for skill building, portfolio projects, or your next big
						venture.
					</p>
				</div>

				{/* Main Content */}
				<div className="space-y-8">
					<div className="flex justify-center">
						<ProjectIdeaDisplay
							content={currentContent}
							isLoading={isLoading}
							isStreaming={streamingState.isStreaming}
						/>
					</div>

					<ActionButtons
						content={currentContent}
						isLoading={isLoading}
						isStreaming={streamingState.isStreaming}
						onRegenerate={generateProjectIdea}
					/>
				</div>

				{/* Footer */}
				<div className="pt-8 text-sm text-center text-gray-500">
					<p>Powered by OpenAI • Built with React & Tailwind CSS</p>
				</div>
			</div>

			<Toaster />
		</div>
	);
}

export default App;
