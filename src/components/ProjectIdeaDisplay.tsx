import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface ProjectIdeaDisplayProps {
  content: string;
  isStreaming: boolean;
  isLoading: boolean;
}

export function ProjectIdeaDisplay({ content, isStreaming, isLoading }: ProjectIdeaDisplayProps) {
  const [displayedContent, setDisplayedContent] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!isStreaming) {
      setDisplayedContent(content);
      setCurrentIndex(content.length);
      return;
    }

    if (currentIndex < content.length) {
      const timer = setTimeout(() => {
        setDisplayedContent(content.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, 20); // Adjust speed of streaming effect

      return () => clearTimeout(timer);
    }
  }, [content, currentIndex, isStreaming]);

  useEffect(() => {
    if (content !== displayedContent && !isStreaming) {
      setCurrentIndex(0);
      setDisplayedContent('');
    }
  }, [content, isStreaming]);

  if (isLoading) {
    return (
      <Card className="w-full max-w-3xl p-8 bg-white shadow-lg">
        <div className="space-y-6">
          <Skeleton className="h-8 w-3/4" />
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/5" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-6 w-1/3" />
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-4/5" />
            ))}
          </div>
          <div className="space-y-2">
            <Skeleton className="h-6 w-1/4" />
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-2/5" />
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-3xl p-8 bg-white shadow-lg transition-all duration-300 hover:shadow-xl">
      <div className="prose prose-lg max-w-none">
        <div 
          className="whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ 
            __html: formatMarkdownToHtml(displayedContent) 
          }} 
        />
        {isStreaming && (
          <span className="inline-block w-3 h-6 bg-gray-800 animate-pulse ml-1" />
        )}
      </div>
    </Card>
  );
}

function formatMarkdownToHtml(markdown: string): string {
  return markdown
    .replace(/^# (.+)$/gm, '<h1 class="text-3xl font-bold text-gray-900 mb-6">$1</h1>')
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-semibold text-gray-800 mt-8 mb-4">$1</h2>')
    .replace(/^- (.+)$/gm, '<li class="text-gray-700 mb-1">$1</li>')
    .replace(/(\n- .+(?:\n- .+)*)/g, '<ul class="list-disc list-inside space-y-1 mb-4">$1</ul>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold">$1</strong>')
    .replace(/\n\n/g, '<div class="mb-4"></div>')
    .replace(/\n/g, '<br />');
}