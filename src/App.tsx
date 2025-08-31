import { useCallback, useEffect, useMemo, useState } from "react";
import { ActionButtons } from "@/components/ActionButtons";
import {
	Container,
	ContentArea,
	Footer,
	Header,
	PageLayout,
} from "@/components/layouts";
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
		<PageLayout>
			<Container>
				<Header
					title="Project Idea Generator"
					description="Get inspired with AI-generated web development project ideas. Perfect for skill building, portfolio projects, or your next big venture."
				/>

				<ContentArea>
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
				</ContentArea>

				<Footer>
					<p>Powered by OpenAI • Built with React & Tailwind CSS</p>
				</Footer>
			</Container>

			<Toaster />
		</PageLayout>
	);
}

export default App;
