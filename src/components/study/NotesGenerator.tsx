
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface NotesGeneratorProps {
  onSendMessage: (message: string) => void;
}

const NotesGenerator: React.FC<NotesGeneratorProps> = ({ onSendMessage }) => {
  const [topic, setTopic] = useState('');
  const [format, setFormat] = useState('comprehensive');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateNotes = () => {
    if (!topic.trim()) {
      toast.error('Please enter a topic for the notes');
      return;
    }

    setIsLoading(true);
    let prompt = '';
    
    if (format === 'concise') {
      prompt = `Generate concise study notes on ${topic}. Include only the key points, important definitions, and core concepts. Format with bullet points for easy quick review.`;
    } else if (format === 'comprehensive') {
      prompt = `Generate comprehensive study notes on ${topic}. Include detailed explanations, examples, diagrams descriptions, and connections to related concepts. Format with clear headings and subheadings.`;
    } else if (format === 'exam') {
      prompt = `Generate exam-focused study notes on ${topic}. Highlight commonly tested concepts, include practice problems with solutions, and provide memory aids. Format with clear sections for different question types likely to appear.`;
    }
    
    onSendMessage(prompt);
    setIsLoading(false);
    toast.success('Generating notes...');
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-purple-600" />
          Notes Generator
        </CardTitle>
        <CardDescription>
          Create customized study notes for any topic
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label htmlFor="topic" className="block text-sm font-medium mb-1">
            Topic
          </label>
          <Input
            id="topic"
            placeholder="Enter the topic (e.g., Cell Biology, Linear Algebra)"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="format" className="block text-sm font-medium mb-1">
            Note Format
          </label>
          <select
            id="format"
            className="w-full px-3 py-2 border rounded-md text-sm"
            value={format}
            onChange={(e) => setFormat(e.target.value)}
          >
            <option value="concise">Concise (Key points only)</option>
            <option value="comprehensive">Comprehensive (Detailed explanations)</option>
            <option value="exam">Exam-Focused (With practice questions)</option>
          </select>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleGenerateNotes} 
          disabled={isLoading || !topic.trim()} 
          className="w-full"
        >
          {isLoading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            'Generate Notes'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NotesGenerator;
