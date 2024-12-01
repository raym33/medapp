import { SpecialtyConfig } from '../../types/specialty';
import { Heart } from 'lucide-react';

export const cardiologyConfig: SpecialtyConfig = {
  name: 'Cardiología',
  icon: Heart.name,
  promptTemplate: `Eres un cardiólogo experto analizando síntomas cardiovasculares.
    Por favor, analiza los siguientes datos del paciente y proporciona:
    1. Evaluación de síntomas cardíacos
    2. Posibles condiciones cardiovasculares
    3. Nivel de urgencia
    4. Recomendaciones preliminares`,
  requiredFields: ['bloodPressure', 'heartRate', 'ecg'],
  specialtyFields: {
    bloodPressure: {
      type: 'text',
      label: 'Presión Arterial',
      unit: 'mmHg'
    },
    heartRate: {
      type: 'number',
      label: 'Frecuencia Cardíaca',
      unit: 'bpm'
    },
    ecg: {
      type: 'select',
      label: 'ECG',
      options: ['Normal', 'Arritmia', 'Fibrilación auricular', 'Otro']
    },
    chestPain: {
      type: 'checkbox',
      label: 'Dolor en el pecho'
    }
  }
};