import { ChangeEvent, useState } from 'react';
import { cn } from '../../utils/cn';
import { Upload, X } from 'lucide-react';

interface ImageUploadProps {
  label?: string;
  error?: string;
  maxImages?: number;
  onImagesChange: (files: File[]) => void;
  className?: string;
  initialImages?: string[];
}

export function ImageUpload({
  label,
  error,
  maxImages = 6,
  onImagesChange,
  className,
  initialImages = [],
}: ImageUploadProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>(initialImages);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const totalImages = selectedFiles.length + files.length;
    
    if (totalImages > maxImages) {
      alert(`You can only upload up to ${maxImages} images`);
      return;
    }

    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
    setSelectedFiles(prev => [...prev, ...files]);
    onImagesChange([...selectedFiles, ...files]);
  };

  const removeImage = (index: number) => {
    // Revoke object URL to prevent memory leaks
    if (!initialImages.includes(previewUrls[index])) {
      URL.revokeObjectURL(previewUrls[index]);
    }

    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newPreviewUrls = previewUrls.filter((_, i) => i !== index);
    
    setSelectedFiles(newFiles);
    setPreviewUrls(newPreviewUrls);
    onImagesChange(newFiles);
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {previewUrls.map((url, index) => (
          <div key={url} className="relative group">
            <img
              src={url}
              alt={`Preview ${index + 1}`}
              className="w-full h-32 object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
        
        {previewUrls.length < maxImages && (
          <div
            className={cn(
              'flex justify-center items-center rounded-lg border-2 border-dashed border-gray-300 p-4 cursor-pointer hover:border-blue-500 transition-colors',
              className
            )}
          >
            <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
              <Upload className="w-8 h-8 text-gray-400" />
              <span className="mt-2 text-sm text-gray-500">Add Image</span>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                multiple
                onChange={handleFileChange}
              />
            </label>
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}