import { useState, useEffect } from 'react';
import { Article } from '../types/news';
import { Button } from './ui/Button';
import { X } from 'lucide-react';
import { ArticleEditor } from './ArticleEditor';
import { Input } from './ui/Input';

interface ArticleModalProps {
  article: Article | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (article: Article) => void;
  readOnly?: boolean;
}

export function ArticleModal({ article, isOpen, onClose, onSave, readOnly = false }: ArticleModalProps) {
  const [formData, setFormData] = useState<Partial<Article>>({
    title: '',
    content: '',
    summary: '',
    author: 'ModelShare Team',
    createdAt: new Date().toISOString().split('T')[0],
    images: []
  });

  useEffect(() => {
    if (article) {
      setFormData(article);
    } else {
      setFormData({
        title: '',
        content: '',
        summary: '',
        author: 'ModelShare Team',
        createdAt: new Date().toISOString().split('T')[0],
        images: []
      });
    }
  }, [article, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: article?.id || Date.now().toString(),
      ...formData as Article
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {readOnly ? 'Article' : article ? 'Edit Article' : 'New Article'}
          </h2>
          <button onClick={onClose}>
            <X className="w-6 h-6" />
          </button>
        </div>

        {readOnly ? (
          <div className="prose max-w-none">
            <h1>{formData.title}</h1>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
              <span>{formData.author}</span>
              <span>•</span>
              <span>{formData.createdAt}</span>
            </div>
            <div dangerouslySetInnerHTML={{ __html: formData.content }} />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />

            <Input
              label="Summary"
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              required
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Content</label>
              <ArticleEditor
                initialContent={[]}
                onChange={(blocks) => {
                  const content = blocks.map(block => {
                    if (block.type === 'text') {
                      return block.content;
                    } else {
                      return `<img src="${block.content}" class="w-full rounded-lg my-4" />`;
                    }
                  }).join('\n');
                  setFormData({ ...formData, content });
                }}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {article ? 'Save Changes' : 'Create Article'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}