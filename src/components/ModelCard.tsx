import { Heart, Download, Pencil, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Model } from '../types/model';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';

interface ModelCardProps {
  model: Model;
  onDelete?: (id: string) => void;
  onEdit?: (model: Model) => void;
}

export function ModelCard({ model, onDelete, onEdit }: ModelCardProps) {
  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit?.(model);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete?.(model.id);
  };

  return (
    <Link to={`/model/${model.id}`} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="relative pb-[177.778%]"> {/* 9:16 aspect ratio (9/16 = 0.5625, 1/0.5625 = 1.77778) */}
          <img 
            src={model.imageUrl} 
            alt={model.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform hover:scale-105"
          />
          {onEdit && onDelete && (
            <div className="absolute top-2 right-2 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleEdit}
                className="bg-white/90 hover:bg-white"
              >
                <Pencil className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
                className="bg-white/90 hover:bg-white"
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600">
              {model.name}
            </h3>
            <span className="text-sm text-gray-500">by {model.creator === 'ad2989846' ? 'master' : model.creator}</span>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {model.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 text-gray-600">
                <Heart className="w-4 h-4" />
                {model.likes}
              </span>
              <span className="flex items-center gap-1 text-gray-600">
                <Download className="w-4 h-4" />
                {model.downloads}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}