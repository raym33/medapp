import Dexie, { Table } from 'dexie';
import { PatientRecord, AudioRecord } from '../types/database';

export class MedicalDatabase extends Dexie {
  patients!: Table<PatientRecord>;
  audioRecords!: Table<AudioRecord>;

  constructor() {
    super('MedicalDB');
    this.version(1).stores({
      patients: '++id, name, createdAt',
      audioRecords: '++id, patientId, audioBlob, transcription, createdAt'
    });
  }
}

export const db = new MedicalDatabase();