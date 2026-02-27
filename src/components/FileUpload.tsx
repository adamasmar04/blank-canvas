import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, FileImage, FileVideo } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (files: File[]) => void;
  selectedFiles: File[];
  maxFiles?: number;
}

export const FileUpload = ({ onFileSelect, selectedFiles, maxFiles = 5 }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const validFiles = files.filter(isValidFile);
    
    if (validFiles.length === 0) {
      alert("Please select valid image or video files under 50MB");
      return;
    }
    
    const newFiles = [...selectedFiles, ...validFiles].slice(0, maxFiles);
    onFileSelect(newFiles);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(isValidFile);
    
    if (validFiles.length === 0) {
      alert("Please select valid image or video files under 50MB");
      return;
    }
    
    const newFiles = [...selectedFiles, ...validFiles].slice(0, maxFiles);
    onFileSelect(newFiles);
  };

  const isValidFile = (file: File): boolean => {
    const validTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
      'video/mp4', 'video/mov', 'video/avi', 'video/quicktime'
    ];
    
    if (!validTypes.includes(file.type)) {
      alert('Please select a valid image (JPG, PNG, GIF, WebP) or video (MP4, MOV, AVI) file.');
      return false;
    }
    
    if (file.size > 50 * 1024 * 1024) {
      alert('File size must be less than 50MB.');
      return false;
    }
    
    return true;
  };

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    onFileSelect(newFiles);
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('video/')) {
      return <FileVideo className="w-8 h-8 text-blue-500" />;
    }
    return <FileImage className="w-8 h-8 text-green-500" />;
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*,video/*"
        multiple
        className="hidden"
        id="file-upload"
      />

      {selectedFiles.length > 0 ? (
        <div className="space-y-4">
          <div className="text-sm text-gray-600 mb-2">
            {selectedFiles.length} of {maxFiles} files selected
          </div>
          {selectedFiles.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-3">
                {getFileIcon(file)}
                <div>
                  <p className="font-medium text-gray-900">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeFile(index)}
                className="text-red-600 hover:text-red-700"
              >
                Remove
              </Button>
            </div>
          ))}
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {selectedFiles.map((file, index) => (
              <div key={index}>
                {file.type.startsWith('image/') && (
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg border"
                  />
                )}
                {file.type.startsWith('video/') && (
                  <video
                    src={URL.createObjectURL(file)}
                    className="w-full h-24 object-cover rounded-lg border"
                    controls={false}
                    muted
                  />
                )}
              </div>
            ))}
          </div>
          
          {selectedFiles.length < maxFiles && (
            <Button
              type="button"
              variant="outline"
              onClick={handleButtonClick}
              className="w-full mt-4"
            >
              Add More Files ({selectedFiles.length}/{maxFiles})
            </Button>
          )}
        </div>
      ) : (
        <div
          className={`glass-card p-8 border-2 border-dashed ${
            isDragging ? 'border-cyan-500 bg-cyan-50' : 'border-white/30'
          } text-center transition-colors`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">
            Drag and drop your files here, or click to browse
          </p>
          <Button 
            className="glass-button text-gray-800 hover:text-gray-900" 
            type="button"
            onClick={handleButtonClick}
          >
            Choose Files
          </Button>
          <p className="text-sm text-gray-500 mt-2">
            Supports JPG, PNG, GIF, WebP images and MP4, MOV, AVI videos (max 50MB each)
          </p>
        </div>
      )}
    </div>
  );
};