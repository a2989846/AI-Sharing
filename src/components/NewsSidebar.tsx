import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Article } from '../types/news';
import { articles as initialArticles } from '../data/news';
import { Button } from './ui/Button';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { ArticleModal } from './ArticleModal';

export function NewsSidebar() {
  const { user } = useAuth();
  const isAdmin = user?.isAdmin;
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReading, setIsReading] = useState(false);

  const handleCreateArticle = () => {
    setSelectedArticle(null);
    setIsModalOpen(true);
    setIsReading(false);
  };

  const handleEditArticle = (article: Article) => {
    setSelectedArticle(article);
    setIsModalOpen(true);
    setIsReading(false);
  };

  const handleReadArticle = (article: Article) => {
    setSelectedArticle(article);
    setIsReading(true);
  };

  const handleDeleteArticle = (id: string) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      setArticles(articles.filter(article => article.id !== id));
    }
  };

  const handleSaveArticle = (article: Article) => {
    if (selectedArticle) {
      setArticles(articles.map(a => a.id === article.id ? article : a));
    } else {
      setArticles([article, ...articles]);
    }
    setIsModalOpen(false);
    setIsReading(false);
  };

  return (
    <div className="w-64 bg-white shadow-md p-4 rounded-lg h-fit">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Latest News</h2>
        {isAdmin && (
          <Button size="sm" onClick={handleCreateArticle}>
            <Plus className="w-4 h-4 mr-1" />
            New Article
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {articles.map((article) => (
          <div key={article.id} className="border-b border-gray-200 pb-4">
            <div className="flex justify-between items-start mb-2">
              <h3 
                className="text-sm font-medium text-gray-900 hover:text-blue-600 cursor-pointer"
                onClick={() => handleReadArticle(article)}
              >
                {article.title}
              </h3>
              {isAdmin && (
                <div className="flex gap-2">
                  <button onClick={() => handleEditArticle(article)}>
                    <Pencil className="w-4 h-4 text-gray-500 hover:text-blue-500" />
                  </button>
                  <button onClick={() => handleDeleteArticle(article.id)}>
                    <Trash2 className="w-4 h-4 text-gray-500 hover:text-red-500" />
                  </button>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500">{article.createdAt}</p>
            <p className="text-sm text-gray-600 mt-1">{article.summary}</p>
          </div>
        ))}
      </div>

      <ArticleModal
        article={selectedArticle}
        isOpen={isModalOpen || isReading}
        onClose={() => {
          setIsModalOpen(false);
          setIsReading(false);
          setSelectedArticle(null);
        }}
        onSave={handleSaveArticle}
        readOnly={isReading}
      />
    </div>
  );
}