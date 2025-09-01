export type ProjectIdea = {
	title: string;
	description: string;
	features: string[];
	techStack: string[];
	complexity: "Beginner" | "Intermediate" | "Advanced";
};

export type GenerateRequest = {
	topic?: string;
	domain?: string;
	difficulty?: DifficultyLevel;
};

export type DifficultyLevel = "Beginner" | "Intermediate" | "Advanced";
