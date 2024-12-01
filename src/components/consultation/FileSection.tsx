import React from 'react';
import FileUploadZone from '../fileUpload/FileUploadZone';
import FileList from '../fileUpload/FileList';
import { usePatientStore } from '../../stores/usePatientStore';
import { db } from '../../config/firebase';
import { collection, addDoc, deleteDoc, doc } from 'firebase/firestore';

interface FileSectionProps {
  fileType: 'medical_image' | 'audio' | 'document';
  title: string;
  description: string;
}

export default function FileSection({ fileType, title, description }: FileSectionProps) {
  const [files, setFiles] = React.useState<Array<{ id: string; name: string; url: string; type: string }>>([]);
  const { currentPatient } = usePatientStore();

  const handleUploadComplete = async (url: string) => {
    if (!currentPatient?.id) return;

    try {
      const fileDoc = await addDoc(collection(db, 'patient_files'), {
        patientId: currentPatient.id,
        url,
        type: fileType,
        name: url.split('/').pop(),
        uploadedAt: new Date()
      });

      setFiles(prev => [...prev, {
        id: fileDoc.id,
        url,
        type: fileType,
        name: url.split('/').pop() || 'Unnamed file'
      }]);
    } catch (error) {
      console.error('Error saving file record:', error);
    }
  };

  const handleDelete = async (fileId: string) => {
    try {
      await deleteDoc(doc(db, 'patient_files', fileId));
      setFiles(prev => prev.filter(f => f.id !== fileId));
    } catch (error) {
      console.error('Error deleting file record:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      </div>

      <FileUploadZone
        fileType={fileType}
        onUploadComplete={handleUploadComplete}
      />

      {files.length > 0 && (
        <FileList
          files={files}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}