import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

type ActionButtonsProps = {
	content: string;
	onRegenerate: () => void;
	isLoading: boolean;
	isStreaming: boolean;
};

export function ActionButtons({
	content,
	onRegenerate,
	isLoading,
	isStreaming,
}: ActionButtonsProps) {
	const handleCopyToMarkdown = async () => {
		if (!content.trim()) {
			toast({
				title: "Nothing to copy",
				description: "Generate a project idea first!",
				variant: "destructive",
			});
			return;
		}

		try {
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
		if (isLoading || isStreaming) {
			return;
		}
		onRegenerate();
	};

	return (
		<div className="flex justify-center gap-4">
			<Button
				className="min-w-[160px] transition-all duration-200 hover:bg-gray-50"
				disabled={!content.trim() || isStreaming}
				onClick={handleCopyToMarkdown}
				size="lg"
				variant="outline"
			>
				Copy to Markdown
			</Button>
			<Button
				className="min-w-[160px] transition-all duration-200"
				disabled={isLoading || isStreaming}
				onClick={handleRegenerate}
				size="lg"
			>
				{isLoading || isStreaming ? "Generating..." : "Regenerate"}
			</Button>
		</div>
	);
}
