import { useState, useEffect } from 'react';
import { Bold, Italic, List, Heading1, Heading2, Image } from 'lucide-react';
import { Button } from './ui/Button';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const [editorContent, setEditorContent] = useState(content);

  useEffect(() => {
    setEditorContent(content);
  }, [content]);

  const handleCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    const newContent = document.querySelector('[contenteditable]')?.innerHTML || '';
    setEditorContent(newContent);
    onChange(newContent);
  };

  return (
    <div className="border border-gray-300 rounded-md overflow-hidden">
      <div className="flex items-center gap-1 p-2 border-b border-gray-300 bg-gray-50">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => handleCommand('bold')}
          className="p-2"
        >
          <Bold className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => handleCommand('italic')}
          className="p-2"
        >
          <Italic className="w-4 h-4" />
        </Button>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => handleCommand('formatBlock', 'h1')}
          className="p-2"
        >
          <Heading1 className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => handleCommand('formatBlock', 'h2')}
          className="p-2"
        >
          <Heading2 className="w-4 h-4" />
        </Button>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => handleCommand('insertUnorderedList')}
          className="p-2"
        >
          <List className="w-4 h-4" />
        </Button>
      </div>
      <div
        contentEditable
        className="min-h-[200px] p-4 focus:outline-none prose max-w-none"
        dangerouslySetInnerHTML={{ __html: editorContent }}
        onInput={(e) => {
          const newContent = e.currentTarget.innerHTML;
          setEditorContent(newContent);
          onChange(newContent);
        }}
      />
    </div>
  );
}