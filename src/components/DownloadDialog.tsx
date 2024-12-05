import { X } from 'lucide-react';
import { Button } from './ui/Button';

interface DownloadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  downloadUrl: string;
}

export function DownloadDialog({ isOpen, onClose, downloadUrl }: DownloadDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Download Model</h2>
          <button onClick={onClose}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <p className="text-gray-600">Your download link is ready:</p>
          <div className="p-3 bg-gray-50 rounded-lg break-all">
            <a 
              href={downloadUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800"
            >
              {downloadUrl}
            </a>
          </div>
          <div className="flex justify-end">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}