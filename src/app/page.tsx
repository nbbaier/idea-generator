"use client";

import { useChat } from "@ai-sdk/react";
import { useCallback } from "react";
import { ActionButtons } from "@/components/ActionButtons";
import { Conversation, ConversationContent } from "@/components/conversation";
import {
	Container,
	ContentArea,
	Footer,
	Header,
	PageLayout,
} from "@/components/layouts";
import { Message, MessageContent } from "@/components/message";
import { Response as AIResponse } from "@/components/response";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "@/hooks/use-toast";

export default function Page() {
	const { messages, status, sendMessage } = useChat({
		onError: (error: Error) => {
			toast({
				title: "Generation Failed",
				description: error.message,
				variant: "destructive",
			});
		},
	});

	const generateProjectIdea = useCallback(async () => {
		await sendMessage({
			text: "Generate a creative web development project idea",
		});
	}, [sendMessage]);

	return (
		<PageLayout>
			<Container>
				<Header
					title="Project Idea Generator"
					description="Get inspired with AI-generated web development project ideas."
				/>

				<ContentArea>
					{messages.length === 0 ? (
						<div className="flex justify-center">
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
									disabled={status === "submitted" || status === "streaming"}
									className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
								>
									{status === "submitted" || status === "streaming"
										? "Generating..."
										: "Generate Project Idea"}
								</button>
							</div>
						</div>
					) : (
						<div className="w-full max-w-3xl mx-auto">
							<Conversation className="min-h-[400px]">
								<ConversationContent>
									{messages.map((message) => (
										<Message key={message.id} from={message.role}>
											<MessageContent>
												<AIResponse>
													{message.parts
														.filter((part) => part.type === "text")
														.map((part) => part.text)
														.join("")}
												</AIResponse>
											</MessageContent>
										</Message>
									))}
								</ConversationContent>
							</Conversation>

							<ActionButtons
								messages={messages}
								isLoading={status === "submitted" || status === "streaming"}
								onRegenerate={() =>
									sendMessage({
										text: "Generate another creative web development project idea",
									})
								}
								onNewIdea={generateProjectIdea}
							/>
						</div>
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
