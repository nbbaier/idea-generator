export type ProjectIdea = {
	title: string;
	description: string;
	features: string[];
	techStack: string[];
	complexity: "Beginner" | "Intermediate" | "Advanced";
};

export type StreamingState = {
	isStreaming: boolean;
	streamedText: string;
	error: string | null;
};
