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

const FALLBACK_CONTENT = "";
// `# Sample Project Idea

// ## Description
// A task management app that uses AI to automatically categorize and prioritize your to-do items based on deadlines, importance, and your personal productivity patterns.

// ## Key Features
// - **AI-powered task categorization** - Automatically sorts tasks by type and priority
// - **Smart scheduling** - Suggests optimal times to work on specific tasks
// - **Progress tracking** - Visual analytics of your productivity patterns
// - **Team collaboration** - Share tasks and get AI insights on team workload
// - **Integration ready** - Connect with calendar, email, and project management tools

// ## Tech Stack
// - **Frontend**: React with TypeScript and Tailwind CSS
// - **Backend**: Node.js with Express or Next.js API routes
// - **AI Integration**: OpenAI API for task analysis
// - **Database**: PostgreSQL or MongoDB for data persistence

// ## Complexity Level
// Intermediate`;

function App() {
	const [projectIdea, setProjectIdea] = useState("");
	const [streamingState, setStreamingState] = useState<StreamingState>({
		isStreaming: false,
		streamedText: "",
		error: null,
	});
	const [isLoading, setIsLoading] = useState(false);

	const openaiService = useMemo(
		() => new OpenAIService(process.env.VITE_OPENAI_API_KEY),
		[],
	);

	const generateProjectIdea = useCallback(async () => {
		if (!process.env.VITE_OPENAI_API_KEY) {
			toast({
				title: "API Key Required",
				description:
					"Please add your OpenAI API key to the environment variables.",
				variant: "destructive",
			});
			setProjectIdea(FALLBACK_CONTENT);
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
			setProjectIdea(FALLBACK_CONTENT);
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
					description="Get inspired with AI-generated web development project ideas."
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
