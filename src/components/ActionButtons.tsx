import type { UIMessage } from "ai";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

type ActionButtonsProps = {
	messages: UIMessage[];
	onRegenerate: () => void;
	onNewIdea: () => void;
	isLoading: boolean;
};

export function ActionButtons({
	messages,
	onRegenerate,
	onNewIdea,
	isLoading,
}: ActionButtonsProps) {
	const handleCopyToMarkdown = async () => {
		const assistantMessages = messages.filter((m) => m.role === "assistant");
		if (assistantMessages.length === 0) {
			toast({
				title: "Nothing to copy",
				description: "Generate a project idea first!",
				variant: "destructive",
			});
			return;
		}

		const lastAssistantMessage =
			assistantMessages[assistantMessages.length - 1];
		try {
			const content = lastAssistantMessage.parts
				.filter((part) => part.type === "text")
				.map((part) => part.text)
				.join("");
			await navigator.clipboard.writeText(content);
			toast({
				title: "Copied to clipboard!",
				description: "Project idea has been copied in Markdown format.",
			});
		} catch (_error) {
			toast({
				title: "Copy failed",
				description: "Unable to copy to clipboard. Please try again.",
				variant: "destructive",
			});
		}
	};

	const handleRegenerate = () => {
		if (isLoading) {
			return;
		}
		onRegenerate();
	};

	const handleNewIdea = () => {
		if (isLoading) {
			return;
		}
		onNewIdea();
	};

	return (
		<div className="flex justify-center gap-4 mt-6">
			<Button
				className="min-w-[160px] transition-all duration-200 hover:bg-gray-50"
				disabled={messages.length === 0 || isLoading}
				onClick={handleCopyToMarkdown}
				size="lg"
				variant="outline"
			>
				Copy to Markdown
			</Button>
			<Button
				className="min-w-[160px] transition-all duration-200"
				disabled={isLoading}
				onClick={handleRegenerate}
				size="lg"
				variant="outline"
			>
				{isLoading ? "Regenerating..." : "Regenerate"}
			</Button>
			<Button
				className="min-w-[160px] transition-all duration-200"
				disabled={isLoading}
				onClick={handleNewIdea}
				size="lg"
			>
				{isLoading ? "Generating..." : "New Idea"}
			</Button>
		</div>
	);
}
