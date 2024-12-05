import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { ImageUpload } from '../components/ui/ImageUpload';
import { useAuth } from '../contexts/AuthContext';
import { models } from '../lib/db/models';
import { imageService } from '../lib/services/imageService';
import { generateId } from '../lib/utils';

interface UploadFormData {
  name: string;
  description: string;
  baseModel: string;
  version: string;
  tags: string;
  downloadUrl: string;
  previewImages: File[];
}

export function UploadPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState<UploadFormData>({
    name: '',
    description: '',
    baseModel: '',
    version: '',
    tags: '',
    downloadUrl: '',
    previewImages: [],
  });
  const [errors, setErrors] = useState<Partial<Record<keyof UploadFormData, string>>>({});

  const validateForm = () => {
    const newErrors: Partial<Record<keyof UploadFormData, string>> = {};

    if (formData.name.length < 3) {
      newErrors.name = 'Name must be at least 3 characters long';
    }
    if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters long';
    }
    if (!formData.baseModel) {
      newErrors.baseModel = 'Base model is required';
    }
    if (!formData.version) {
      newErrors.version = 'Version is required';
    }
    if (formData.previewImages.length === 0) {
      newErrors.previewImages = 'At least one preview image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert('Please login to upload models');
      navigate('/login');
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      setIsUploading(true);

      // Generate unique IDs for each image
      const imageIds = formData.previewImages.map(() => generateId());
      
      // Upload images and store them with their IDs
      const imageUrls = await imageService.uploadImages(formData.previewImages);

      // Create the model with image IDs and URLs
      const model = await models.create({
        name: formData.name,
        description: formData.description,
        baseModel: formData.baseModel,
        version: formData.version,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        downloadUrl: formData.downloadUrl || imageUrls[0],
        imageUrl: imageUrls[0],
        images: imageUrls.slice(1),
        imageIds,
        creator: user.username,
      });

      navigate(`/model/${model.id}`);
    } catch (error) {
      console.error('Error uploading model:', error);
      alert('Failed to upload model. Please check your input and try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Upload Model</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Model Name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                error={errors.name}
              />

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
                {errors.description && (
                  <p className="text-sm text-red-600">{errors.description}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Base Model"
                  required
                  value={formData.baseModel}
                  onChange={(e) => setFormData({ ...formData, baseModel: e.target.value })}
                  error={errors.baseModel}
                />

                <Input
                  label="Version"
                  required
                  value={formData.version}
                  onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                  error={errors.version}
                />
              </div>

              <Input
                label="Download URL (optional)"
                type="url"
                placeholder="https://example.com/model.safetensors"
                value={formData.downloadUrl}
                onChange={(e) => setFormData({ ...formData, downloadUrl: e.target.value })}
                error={errors.downloadUrl}
              />

              <Input
                label="Tags (comma separated)"
                placeholder="portrait, realistic, face"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              />

              <ImageUpload
                label="Preview Images (up to 6 images)"
                maxImages={6}
                onImagesChange={(files) => setFormData({ ...formData, previewImages: files })}
                error={errors.previewImages}
              />

              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => navigate('/')}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isUploading}>
                  {isUploading ? 'Uploading...' : 'Upload Model'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}