import React from 'react';
import { File, Trash2, Download } from 'lucide-react';
import { storage } from '../../config/firebase';
import { ref, deleteObject } from 'firebase/storage';

interface FileListProps {
  files: Array<{
    id: string;
    name: string;
    url: string;
    type: string;
  }>;
  onDelete?: (fileId: string) => void;
}

export default function FileList({ files, onDelete }: FileListProps) {
  const handleDelete = async (fileId: string, url: string) => {
    try {
      // Delete from Firebase Storage
      const fileRef = ref(storage, url);
      await deleteObject(fileRef);
      
      // Notify parent component
      onDelete?.(fileId);
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  return (
    <div className="space-y-2">
      {files.map((file) => (
        <div
          key={file.id}
          className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm border border-gray-200"
        >
          <div className="flex items-center space-x-3">
            <File className="h-5 w-5 text-gray-400" />
            <span className="text-sm text-gray-700">{file.name}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <a
              href={file.url}
              download
              className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <Download className="h-4 w-4" />
            </a>
            
            {onDelete && (
              <button
                onClick={() => handleDelete(file.id, file.url)}
                className="p-1 text-red-500 hover:text-red-700 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}