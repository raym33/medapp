import { encryptData, decryptData } from '../security/encryptionService';
import { logAuditEvent } from '../auditService';
import { storage } from '../../config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export interface FileValidationRules {
  maxSize: number;
  allowedTypes: string[];
}

export class FileManager {
  private readonly validationRules: Record<string, FileValidationRules> = {
    medical_image: {
      maxSize: 10 * 1024 * 1024, // 10MB
      allowedTypes: ['image/jpeg', 'image/png', 'image/dicom']
    },
    audio: {
      maxSize: 50 * 1024 * 1024, // 50MB
      allowedTypes: ['audio/wav', 'audio/mp3']
    },
    document: {
      maxSize: 20 * 1024 * 1024, // 20MB
      allowedTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    }
  };

  async processFile(file: File, type: keyof typeof this.validationRules, patientId: string): Promise<string> {
    try {
      // Validate file
      this.validateFile(file, type);

      // Encrypt file data
      const fileBuffer = await file.arrayBuffer();
      const encryptedData = await encryptData(fileBuffer);

      // Generate secure filename
      const secureFilename = this.generateSecureFilename(file.name, patientId);

      // Upload to Firebase Storage
      const storageRef = ref(storage, `patients/${patientId}/${secureFilename}`);
      await uploadBytes(storageRef, new Blob([encryptedData]));

      // Get download URL
      const downloadUrl = await getDownloadURL(storageRef);

      // Log audit event
      await logAuditEvent(patientId, 'file_upload', {
        fileType: type,
        filename: secureFilename,
        timestamp: new Date()
      });

      return downloadUrl;
    } catch (error) {
      console.error('Error processing file:', error);
      throw new Error('Failed to process file');
    }
  }

  private validateFile(file: File, type: keyof typeof this.validationRules): void {
    const rules = this.validationRules[type];

    if (!rules) {
      throw new Error('Invalid file type category');
    }

    if (file.size > rules.maxSize) {
      throw new Error(`File size exceeds maximum allowed size of ${rules.maxSize / (1024 * 1024)}MB`);
    }

    if (!rules.allowedTypes.includes(file.type)) {
      throw new Error(`File type ${file.type} is not allowed. Allowed types: ${rules.allowedTypes.join(', ')}`);
    }
  }

  private generateSecureFilename(originalName: string, patientId: string): string {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);
    const extension = originalName.split('.').pop();
    return `${patientId}_${timestamp}_${randomString}.${extension}`;
  }
}

export const fileManager = new FileManager();