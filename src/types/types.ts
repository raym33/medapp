export interface PatientData {
  nombre: string;
  edad: number;
  genero: string;
  sintomas: string[];
  medicacion: string;
  alergias: string[];
  antecedentes: string;
  audioTranscription?: string;
  aiAnalysis?: string;
}

export interface ChatMessage {
  type: 'bot' | 'user';
  content: string;
}

export interface AudioRecordingState {
  isRecording: boolean;
  audioBlob: Blob | null;
  audioUrl: string | null;
}