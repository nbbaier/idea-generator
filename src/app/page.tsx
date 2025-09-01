"use client";

import { useCompletion } from "@ai-sdk/react";
import { useCallback } from "react";
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

export default function Page() {
	const { completion, isLoading, complete } = useCompletion({
		api: "/api/generate",
		onError: (error: Error) => {
			toast({
				title: "Generation Failed",
				description: error.message,
				variant: "destructive",
			});
		},
	});

	const generateProjectIdea = useCallback(async () => {
		await complete("");
	}, [complete]);

	return (
		<PageLayout>
			<Container>
				<Header
					title="Project Idea Generator"
					description="Get inspired with AI-generated web development project ideas."
				/>

				<ContentArea>
					<div className="flex justify-center">
						{!completion && !isLoading ? (
							<div className="text-center space-y-4">
								<h2 className="text-2xl font-bold text-gray-900">
									Welcome to Project Idea Generator
								</h2>
								<p className="text-gray-600 max-w-md">
									Get inspired with AI-generated web development project ideas.
									Click the button below to generate your first project idea!
								</p>
								<button
									type="button"
									onClick={generateProjectIdea}
									disabled={isLoading}
									className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
								>
									{isLoading ? "Generating..." : "Generate Project Idea"}
								</button>
							</div>
						) : (
							<ProjectIdeaDisplay
								content={completion}
								isLoading={isLoading}
								isStreaming={isLoading}
							/>
						)}
					</div>

					{completion && (
						<ActionButtons
							content={completion}
							isLoading={isLoading}
							isStreaming={isLoading}
							onRegenerate={generateProjectIdea}
						/>
					)}
				</ContentArea>

				<Footer>
					<p>Powered by OpenAI • Built with React & Tailwind CSS</p>
				</Footer>
			</Container>

			<Toaster />
		</PageLayout>
	);
}
