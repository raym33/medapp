import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, AlertCircle } from 'lucide-react';
import { fileManager } from '../../services/fileManagement/FileManager';
import { usePatientStore } from '../../stores/usePatientStore';

interface FileUploadZoneProps {
  fileType: 'medical_image' | 'audio' | 'document';
  onUploadComplete: (url: string) => void;
}

export default function FileUploadZone({ fileType, onUploadComplete }: FileUploadZoneProps) {
  const [uploading, setUploading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const { currentPatient } = usePatientStore();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!currentPatient?.id) {
      setError('No patient selected');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const file = acceptedFiles[0];
      const url = await fileManager.processFile(file, fileType, currentPatient.id.toString());
      onUploadComplete(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error uploading file');
    } finally {
      setUploading(false);
    }
  }, [fileType, currentPatient, onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': fileType === 'medical_image' ? ['.jpg', '.jpeg', '.png', '.dicom'] : [],
      'audio/*': fileType === 'audio' ? ['.wav', '.mp3'] : [],
      'application/pdf': fileType === 'document' ? ['.pdf'] : [],
      'application/msword': fileType === 'document' ? ['.doc'] : [],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': fileType === 'document' ? ['.docx'] : []
    },
    maxSize: fileType === 'audio' ? 50 * 1024 * 1024 : 20 * 1024 * 1024,
    multiple: false
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}
          ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} disabled={uploading} />
        
        <div className="flex flex-col items-center space-y-2">
          {uploading ? (
            <>
              <Upload className="h-12 w-12 text-blue-500 animate-bounce" />
              <p className="text-sm text-gray-600">Subiendo archivo...</p>
            </>
          ) : (
            <>
              <File className="h-12 w-12 text-gray-400" />
              <p className="text-sm text-gray-600">
                {isDragActive
                  ? 'Suelta el archivo aquí'
                  : 'Arrastra un archivo o haz clic para seleccionarlo'}
              </p>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}