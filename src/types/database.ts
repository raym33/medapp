export interface PatientRecord {
  id?: number;
  name: string;
  age: number;
  gender: string;
  symptoms: string[];
  medication: string;
  allergies: string[];
  medicalHistory: string;
  createdAt: Date;
}

export interface AudioRecord {
  id?: number;
  patientId: number;
  audioBlob: Blob;
  transcription?: string;
  analysis?: string;
  createdAt: Date;
}