import { PatientRecord } from './database';

export type Specialty = 
  | 'general'
  | 'cardiology'
  | 'neurology'
  | 'pediatrics'
  | 'traumatology'
  | 'dermatology'
  | 'oncology'
  | 'psychiatry';

export interface SpecialtyConfig {
  name: string;
  icon: string;
  promptTemplate: string;
  requiredFields: string[];
  specialtyFields: Record<string, {
    type: 'text' | 'number' | 'select' | 'checkbox';
    label: string;
    options?: string[];
    unit?: string;
  }>;
}

export interface SpecialtyData {
  specialty: Specialty;
  specialtyFields: Record<string, any>;
  patient: PatientRecord;
}