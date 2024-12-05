import { useState } from 'react';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';
import { Button } from './ui/Button';
import { Type, Image as ImageIcon } from 'lucide-react';
import { RichTextEditor } from './RichTextEditor';
import { ImageUpload } from './ui/ImageUpload';

interface Block {
  id: string;
  type: 'text' | 'image';
  content: string;
}

interface ArticleEditorProps {
  initialContent?: Block[];
  onChange: (blocks: Block[]) => void;
}

export function ArticleEditor({ initialContent = [], onChange }: ArticleEditorProps) {
  const [blocks, setBlocks] = useState<Block[]>(initialContent);

  const addTextBlock = () => {
    const newBlock: Block = {
      id: `text-${Date.now()}`,
      type: 'text',
      content: '',
    };
    setBlocks([...blocks, newBlock]);
    onChange([...blocks, newBlock]);
  };

  const addImageBlock = () => {
    const newBlock: Block = {
      id: `image-${Date.now()}`,
      type: 'image',
      content: '',
    };
    setBlocks([...blocks, newBlock]);
    onChange([...blocks, newBlock]);
  };

  const updateBlockContent = (id: string, content: string) => {
    const newBlocks = blocks.map(block => 
      block.id === id ? { ...block, content } : block
    );
    setBlocks(newBlocks);
    onChange(newBlocks);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = blocks.findIndex(block => block.id === active.id);
      const newIndex = blocks.findIndex(block => block.id === over.id);

      const newBlocks = arrayMove(blocks, oldIndex, newIndex);
      setBlocks(newBlocks);
      onChange(newBlocks);
    }
  };

  const removeBlock = (id: string) => {
    const newBlocks = blocks.filter(block => block.id !== id);
    setBlocks(newBlocks);
    onChange(newBlocks);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button type="button" onClick={addTextBlock} variant="outline">
          <Type className="w-4 h-4 mr-2" />
          Add Text
        </Button>
        <Button type="button" onClick={addImageBlock} variant="outline">
          <ImageIcon className="w-4 h-4 mr-2" />
          Add Image
        </Button>
      </div>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-4">
            {blocks.map(block => (
              <SortableItem key={block.id} id={block.id}>
                <div className="group relative bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  {block.type === 'text' ? (
                    <RichTextEditor
                      content={block.content}
                      onChange={(content) => updateBlockContent(block.id, content)}
                    />
                  ) : (
                    <ImageUpload
                      maxImages={1}
                      onImagesChange={(files) => {
                        if (files.length > 0) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            updateBlockContent(block.id, reader.result as string);
                          };
                          reader.readAsDataURL(files[0]);
                        }
                      }}
                    />
                  )}
                  <button
                    onClick={() => removeBlock(block.id)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </SortableItem>
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}