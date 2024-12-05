import { Model } from '../types/model';
import { ModelCard } from './ModelCard';

interface ModelGridProps {
  models: Model[];
  onDelete?: (id: string) => void;
  onEdit?: (model: Model) => void;
}

export function ModelGrid({ models, onDelete, onEdit }: ModelGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {models.map((model) => (
        <ModelCard 
          key={model.id} 
          model={model}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}