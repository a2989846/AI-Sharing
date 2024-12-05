import { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { ModelGrid } from '../components/ModelGrid';
import { EditModelModal } from '../components/EditModelModal';
import { NewsSidebar } from '../components/NewsSidebar';
import { Model } from '../types/model';
import { models as modelsDb } from '../lib/db/models';
import { useAuth } from '../contexts/AuthContext';

export function HomePage() {
  const { user } = useAuth();
  const [models, setModels] = useState<Model[]>([]);
  const [editingModel, setEditingModel] = useState<Model | null>(null);
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'downloads'>('newest');

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const fetchedModels = await modelsDb.findAll();
        const sortedModels = sortModels(fetchedModels, sortBy);
        setModels(sortedModels);
      } catch (error) {
        console.error('Error fetching models:', error);
      }
    };

    fetchModels();
  }, [sortBy]);

  const sortModels = (modelList: Model[], sort: string) => {
    return [...modelList].sort((a, b) => {
      switch (sort) {
        case 'popular':
          return b.likes - a.likes;
        case 'downloads':
          return b.downloads - a.downloads;
        case 'newest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this model?')) {
      try {
        await modelsDb.delete(id);
        setModels(models.filter(model => model.id !== id));
      } catch (error) {
        console.error('Error deleting model:', error);
        alert('Failed to delete model. Please try again.');
      }
    }
  };

  const handleEdit = (model: Model) => {
    setEditingModel(model);
  };

  const handleSaveEdit = async (updatedModel: Model) => {
    try {
      await modelsDb.update(updatedModel.id, updatedModel);
      setModels(models.map(model => 
        model.id === updatedModel.id ? updatedModel : model
      ));
      setEditingModel(null);
    } catch (error) {
      console.error('Error updating model:', error);
      alert('Failed to update model. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          <NewsSidebar />
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Featured Models</h2>
              <div className="flex gap-2">
                <select 
                  className="px-3 py-2 border border-gray-300 rounded-md bg-white"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                >
                  <option value="newest">Newest First</option>
                  <option value="popular">Most Popular</option>
                  <option value="downloads">Most Downloaded</option>
                </select>
              </div>
            </div>

            <ModelGrid 
              models={models}
              onDelete={user?.isAdmin ? handleDelete : undefined}
              onEdit={user?.isAdmin ? handleEdit : undefined}
            />
          </div>
        </div>

        {editingModel && (
          <EditModelModal
            model={editingModel}
            isOpen={true}
            onClose={() => setEditingModel(null)}
            onSave={handleSaveEdit}
          />
        )}
      </main>
    </div>
  );
}