import { useState } from 'react';
import { PatientData } from '../types/types';

type Step = 'nombre' | 'edad' | 'genero' | 'sintomas' | 'medicacion' | 'alergias' | 'antecedentes' | 'complete';

const initialData: PatientData = {
  nombre: '',
  edad: 0,
  genero: '',
  sintomas: [],
  medicacion: '',
  alergias: [],
  antecedentes: ''
};

export function usePatientData() {
  const [patientData, setPatientData] = useState<PatientData>(initialData);
  const [currentStep, setCurrentStep] = useState<Step>('nombre');

  const updatePatientData = (update: Partial<PatientData>) => {
    setPatientData(prev => ({ ...prev, ...update }));
  };

  const moveToNextStep = () => {
    const steps: Step[] = ['nombre', 'edad', 'genero', 'sintomas', 'medicacion', 'alergias', 'antecedentes', 'complete'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  return {
    patientData,
    updatePatientData,
    currentStep,
    moveToNextStep
  };
}