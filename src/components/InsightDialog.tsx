import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import ReactMarkdown from 'react-markdown';

interface InsightDialogProps {
  topic: string;
}

export function InsightDialog({ topic }: InsightDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [report, setReport] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [provider, setProvider] = useState<'gemini' | 'openai'>('gemini');

  const generateReport = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/deepResearch?topic=${encodeURIComponent(topic)}&provider=${provider}`,
      );
      const data = await response.json();
      setReport(data.report);
    } catch (error) {
      console.error('Failed to generate report:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">AI Insight</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>AI Research Report: {topic}</DialogTitle>
        </DialogHeader>
        {!report ? (
          <div className="flex flex-col items-center gap-4 py-8">
            <select
              className="border rounded px-2 py-1"
              value={provider}
              onChange={(e) => setProvider(e.target.value as 'gemini' | 'openai')}
            >
              <option value="gemini">Gemini</option>
              <option value="openai">OpenAI</option>
            </select>
            <Button onClick={generateReport} disabled={isLoading}>
              {isLoading ? 'Generating...' : 'Generate Report'}
            </Button>
          </div>
        ) : (
          <div className="prose dark:prose-invert max-w-none">
            <ReactMarkdown>{report}</ReactMarkdown>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
} 