import { ChangeEvent, forwardRef } from 'react';
import { cn } from '../../utils/cn';
import { Upload } from 'lucide-react';

interface FileUploadProps {
  label?: string;
  accept?: string;
  error?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export const FileUpload = forwardRef<HTMLInputElement, FileUploadProps>(
  ({ label, accept, error, onChange, className }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <div
          className={cn(
            'flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10',
            className
          )}
        >
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-300" />
            <div className="mt-4 flex text-sm leading-6 text-gray-600">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer rounded-md bg-white font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500"
              >
                <span>Upload a file</span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  ref={ref}
                  accept={accept}
                  onChange={onChange}
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs leading-5 text-gray-600">
              PNG, JPG, CKPT up to 10MB
            </p>
          </div>
        </div>
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);