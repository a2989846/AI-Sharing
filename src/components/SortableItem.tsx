import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

interface SortableItemProps {
  id: string;
  children: React.ReactNode;
}

export function SortableItem({ id, children }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div className="relative">
        <div
          className="absolute top-2 left-2 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="w-4 h-4 text-gray-500" />
        </div>
        {children}
      </div>
    </div>
  );
}