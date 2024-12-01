import { create } from 'zustand';
import { PatientRecord } from '../types/database';
import { db } from '../db/database';

interface PatientState {
  currentPatient: PatientRecord | null;
  setCurrentPatient: (patient: PatientRecord) => void;
  savePatient: (patient: Omit<PatientRecord, 'id' | 'createdAt'>) => Promise<number>;
  clearCurrentPatient: () => void;
}

export const usePatientStore = create<PatientState>((set) => ({
  currentPatient: null,
  setCurrentPatient: (patient) => set({ currentPatient: patient }),
  savePatient: async (patient) => {
    const id = await db.patients.add({
      ...patient,
      createdAt: new Date()
    });
    return id;
  },
  clearCurrentPatient: () => set({ currentPatient: null })
}));