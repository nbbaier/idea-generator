export interface ProjectIdea {
  title: string;
  description: string;
  features: string[];
  techStack: string[];
  complexity: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface StreamingState {
  isStreaming: boolean;
  streamedText: string;
  error: string | null;
}