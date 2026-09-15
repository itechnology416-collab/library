import React, { useState, useRef } from 'react';
import { UploadCloud, File, X, CheckCircle2, AlertCircle } from 'lucide-react';

export interface FileUploaderProps {
  label?: string;
  helperText?: string;
  accept?: string;
  maxSizeMB?: number;
  multiple?: boolean;
  onFilesSelected: (files: File[]) => void;
  selectedFiles?: File[];
  className?: string;
  error?: string;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  label,
  helperText = 'Drag & drop your files here, or click to browse',
  accept,
  maxSizeMB = 50,
  multiple = false,
  onFilesSelected,
  selectedFiles = [],
  className = '',
  error,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const validateAndProcessFiles = (rawFiles: FileList | null) => {
    if (!rawFiles || rawFiles.length === 0) return;
    setUploadError(null);

    const validFiles: File[] = [];
    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    for (let i = 0; i < rawFiles.length; i++) {
      const file = rawFiles[i];
      if (file.size > maxSizeBytes) {
        setUploadError(`File "${file.name}" exceeds the ${maxSizeMB}MB limit.`);
        return;
      }
      validFiles.push(file);
      if (!multiple) break;
    }

    if (validFiles.length > 0) {
      onFilesSelected(validFiles);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    validateAndProcessFiles(e.dataTransfer.files);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    validateAndProcessFiles(e.target.files);
  };

  const removeFile = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = selectedFiles.filter((_, i) => i !== index);
    onFilesSelected(updated);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className={`w-full flex flex-col gap-2 ${className}`}>
      {label && (
        <label className="text-xs font-semibold text-on-surface select-none tracking-wide">
          {label}
        </label>
      )}

      {/* Dropzone Container - both drag-and-drop AND click supported */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer text-center
          ${
            isDragging
              ? 'border-secondary bg-secondary/10 scale-[1.01]'
              : 'border-outline-variant/40 bg-surface-container-low hover:bg-surface-container hover:border-secondary/60'
          }
          ${error || uploadError ? 'border-error bg-error/5' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleInputChange}
          className="hidden"
        />

        <div className="w-12 h-12 rounded-2xl bg-secondary/15 text-secondary flex items-center justify-center mb-3">
          <UploadCloud className="w-6 h-6" />
        </div>

        <p className="text-sm font-semibold text-on-surface mb-1">
          {isDragging ? 'Drop files now' : 'Click to select or drag and drop'}
        </p>
        <p className="text-xs text-on-surface-variant max-w-sm">
          {helperText} {accept ? `(${accept})` : ''} • Max {maxSizeMB}MB
        </p>
      </div>

      {/* Error Message */}
      {(error || uploadError) && (
        <div className="flex items-center gap-1.5 text-xs text-error font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error || uploadError}</span>
        </div>
      )}

      {/* Selected Files List */}
      {selectedFiles.length > 0 && (
        <div className="flex flex-col gap-2 mt-1">
          {selectedFiles.map((file, idx) => (
            <div
              key={`${file.name}-${idx}`}
              className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container border border-outline-variant/30 text-xs text-on-surface"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <File className="w-4 h-4 text-secondary shrink-0" />
                <div className="truncate">
                  <span className="font-semibold block truncate">{file.name}</span>
                  <span className="text-on-surface-variant text-[11px]">
                    {formatFileSize(file.size)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <button
                  type="button"
                  onClick={(e) => removeFile(idx, e)}
                  className="p-1 rounded-lg hover:bg-surface-container-high text-on-surface-variant hover:text-error transition-colors"
                  aria-label={`Remove file ${file.name}`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
