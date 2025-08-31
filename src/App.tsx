import { useState, useEffect } from 'react';
import { ProjectIdeaDisplay } from '@/components/ProjectIdeaDisplay';
import { ActionButtons } from '@/components/ActionButtons';
import { OpenAIService } from '@/lib/openai';
import { StreamingState } from '@/types';
import { Toaster } from '@/components/ui/toaster';
import { toast } from '@/hooks/use-toast';

function App() {
  const [projectIdea, setProjectIdea] = useState('');
  const [streamingState, setStreamingState] = useState<StreamingState>({
    isStreaming: false,
    streamedText: '',
    error: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  const openaiService = new OpenAIService(import.meta.env.VITE_OPENAI_API_KEY);

  const generateProjectIdea = async () => {
    if (!import.meta.env.VITE_OPENAI_API_KEY) {
      toast({
        title: "API Key Required",
        description: "Please add your OpenAI API key to the environment variables.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setStreamingState({
      isStreaming: true,
      streamedText: '',
      error: null,
    });
    setProjectIdea('');

    try {
      const stream = await openaiService.generateProjectIdea();
      const reader = stream.getReader();
      let accumulatedText = '';

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          setStreamingState(prev => ({
            ...prev,
            isStreaming: false,
          }));
          setProjectIdea(accumulatedText);
          break;
        }

        accumulatedText += value;
        setStreamingState(prev => ({
          ...prev,
          streamedText: accumulatedText,
        }));
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      setStreamingState({
        isStreaming: false,
        streamedText: '',
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
  };

  // Generate initial project idea on mount
  useEffect(() => {
    generateProjectIdea();
  }, []);

  const currentContent = streamingState.isStreaming 
    ? streamingState.streamedText 
    : projectIdea;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
            Project Idea Generator
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Get inspired with AI-generated web development project ideas. 
            Perfect for skill building, portfolio projects, or your next big venture.
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          <div className="flex justify-center">
            <ProjectIdeaDisplay
              content={currentContent}
              isStreaming={streamingState.isStreaming}
              isLoading={isLoading}
            />
          </div>

          <ActionButtons
            content={currentContent}
            onRegenerate={generateProjectIdea}
            isLoading={isLoading}
            isStreaming={streamingState.isStreaming}
          />
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 pt-8">
          <p>Powered by OpenAI • Built with React & Tailwind CSS</p>
        </div>
      </div>
      
      <Toaster />
    </div>
  );
}

export default App;