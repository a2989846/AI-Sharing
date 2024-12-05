import { useState, useEffect } from 'react';
import { Model } from '../types/model';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { X, Plus, Trash2 } from 'lucide-react';
import { imageService } from '../lib/services/imageService';

interface EditModelModalProps {
  model: Model;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedModel: Model) => void;
}

export function EditModelModal({ model, isOpen, onClose, onSave }: EditModelModalProps) {
  const [formData, setFormData] = useState<Model>({
    ...model,
    images: model.images || []
  });
  const [newImages, setNewImages] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setFormData({
      ...model,
      images: model.images || []
    });
    setNewImages([]);
    setErrors({});
  }, [model]);

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const maxImages = 6 - (formData.images?.length || 0);
    
    if (files.length > maxImages) {
      alert(`You can only add up to ${maxImages} more images`);
      return;
    }

    setNewImages(prev => [...prev, ...files]);
  };

  const handleRemoveExistingImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== index),
    }));
  };

  const handleRemoveNewImage = (index: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsUploading(true);

      // Upload new images if any
      let uploadedImageUrls: string[] = [];
      if (newImages.length > 0) {
        uploadedImageUrls = await imageService.uploadImages(newImages);
      }

      // Combine existing and new images
      const updatedModel = {
        ...formData,
        images: [...(formData.images || []), ...uploadedImageUrls],
      };

      onSave(updatedModel);
    } catch (error) {
      console.error('Error updating model:', error);
      alert('Failed to update model. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Edit Model</h2>
          <button onClick={onClose}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name}
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
            />
            {errors.description && (
              <p className="text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Base Model"
              value={formData.baseModel}
              onChange={(e) => setFormData({ ...formData, baseModel: e.target.value })}
              error={errors.baseModel}
            />

            <Input
              label="Version"
              value={formData.version}
              onChange={(e) => setFormData({ ...formData, version: e.target.value })}
              error={errors.version}
            />
          </div>

          <Input
            label="Tags (comma separated)"
            value={formData.tags.join(', ')}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(',').map(tag => tag.trim()) })}
          />

          <Input
            label="Download URL"
            value={formData.downloadUrl || ''}
            onChange={(e) => setFormData({ ...formData, downloadUrl: e.target.value })}
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Images
            </label>
            
            <div className="grid grid-cols-3 gap-4 mb-4">
              {/* Existing Images */}
              {(formData.images || []).map((imageUrl, index) => (
                <div key={index} className="relative group">
                  <img
                    src={imageUrl}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveExistingImage(index)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {/* New Images */}
              {newImages.map((file, index) => (
                <div key={`new-${index}`} className="relative group">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`New Preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveNewImage(index)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {/* Upload Button */}
              {(formData.images?.length || 0) + newImages.length < 6 && (
                <label className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors">
                  <Plus className="w-8 h-8 text-gray-400" />
                  <span className="mt-2 text-sm text-gray-500">Add Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    multiple
                  />
                </label>
              )}
            </div>

            {errors.images && (
              <p className="text-sm text-red-600">{errors.images}</p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isUploading}>
              {isUploading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}