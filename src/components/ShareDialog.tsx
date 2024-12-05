import { X } from 'lucide-react';
import { Button } from './ui/Button';

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
}

export function ShareDialog({ isOpen, onClose, url }: ShareDialogProps) {
  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
      onClose();
    } catch (error) {
      console.error('Failed to copy:', error);
      alert('Failed to copy link. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Share Model</h2>
          <button onClick={onClose}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <p className="text-gray-600">Share this model with others:</p>
          <div className="p-3 bg-gray-50 rounded-lg break-all">
            {url}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleCopy}>
              Copy Link
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}