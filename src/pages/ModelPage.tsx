import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Comments } from '../components/Comments';
import { Download, Heart, Share2, Calendar, Tag, Pencil, Trash2, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { models } from '../lib/db/models';
import { Model } from '../types/model';
import { useAuth } from '../contexts/AuthContext';
import { EditModelModal } from '../components/EditModelModal';
import { DownloadDialog } from '../components/DownloadDialog';
import { ShareDialog } from '../components/ShareDialog';

export function ModelPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [model, setModel] = useState<Model | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [isDownloadDialogOpen, setIsDownloadDialogOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

  useEffect(() => {
    const loadModel = async () => {
      if (!id) return;
      
      try {
        const modelData = await models.findById(id);
        if (!modelData) {
          navigate('/');
          return;
        }
        setModel(modelData);
      } catch (error) {
        console.error('Error loading model:', error);
        navigate('/');
      }
    };

    loadModel();
  }, [id, navigate]);

  if (!model) {
    return <div>Loading...</div>;
  }

  const handleEdit = () => setIsEditing(true);

  const handleSaveEdit = async (updatedModel: Model) => {
    try {
      await models.update(updatedModel.id, updatedModel);
      setModel(updatedModel);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating model:', error);
      alert('Failed to update model. Please try again.');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this model?')) return;
    
    try {
      await models.delete(model.id);
      navigate('/');
    } catch (error) {
      console.error('Error deleting model:', error);
      alert('Failed to delete model. Please try again.');
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      const updatedModel = await models.update(model.id, {
        ...model,
        likes: model.likes + 1
      });
      setModel(updatedModel);
    } catch (error) {
      console.error('Error updating likes:', error);
    }
  };

  const handleDownload = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      const updatedModel = await models.update(model.id, {
        ...model,
        downloads: model.downloads + 1
      });
      setModel(updatedModel);
      setIsDownloadDialogOpen(true);
    } catch (error) {
      console.error('Error updating downloads:', error);
    }
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => 
      prev < (model.images?.length || 0) - 1 ? prev + 1 : prev
    );
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => prev > 0 ? prev - 1 : prev);
  };

  const allImages = [model.imageUrl, ...(model.images || [])];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <Button variant="outline" onClick={() => navigate('/')}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </div>
              <div className="flex gap-2">
                {user?.isAdmin && (
                  <>
                    <Button variant="outline" onClick={handleEdit}>
                      <Pencil className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="outline" onClick={handleDelete}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </>
                )}
                <Button variant="outline" onClick={() => setIsShareDialogOpen(true)}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                <Button onClick={handleDownload}>
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="relative">
                <img 
                  src={allImages[currentImageIndex]} 
                  alt={model.name}
                  className="w-full rounded-lg shadow-md"
                />
                {allImages.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      disabled={currentImageIndex === 0}
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full disabled:opacity-30"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={handleNextImage}
                      disabled={currentImageIndex === allImages.length - 1}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full disabled:opacity-30"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}
              </div>
              
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{model.name}</h1>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-gray-600">by</span>
                  <span className="text-blue-600">
                    {model.creator === 'ad2989846' ? 'master' : model.creator}
                  </span>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <button
                    onClick={handleLike}
                    className="flex items-center gap-1 text-gray-600 hover:text-red-500"
                  >
                    <Heart className="w-4 h-4" />
                    {model.likes}
                  </button>
                  <span className="flex items-center gap-1 text-gray-600">
                    <Download className="w-4 h-4" />
                    {model.downloads}
                  </span>
                  <span className="flex items-center gap-1 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    {new Date(model.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Description</h3>
                    <p className="text-gray-600">{model.description}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Details</h3>
                    <dl className="grid grid-cols-2 gap-4">
                      <div>
                        <dt className="text-sm text-gray-500">Version</dt>
                        <dd className="text-sm font-medium">{model.version}</dd>
                      </div>
                      <div>
                        <dt className="text-sm text-gray-500">Base Model</dt>
                        <dd className="text-sm font-medium">{model.baseModel}</dd>
                      </div>
                    </dl>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {model.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Comments modelId={model.id} />
          </div>
        </div>
      </main>

      {isEditing && (
        <EditModelModal
          model={model}
          isOpen={true}
          onClose={() => setIsEditing(false)}
          onSave={handleSaveEdit}
        />
      )}

      <DownloadDialog
        isOpen={isDownloadDialogOpen}
        onClose={() => setIsDownloadDialogOpen(false)}
        downloadUrl={model.downloadUrl || model.imageUrl}
      />

      <ShareDialog
        isOpen={isShareDialogOpen}
        onClose={() => setIsShareDialogOpen(false)}
        url={window.location.href}
      />
    </div>
  );
}