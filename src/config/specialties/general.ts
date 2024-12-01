import { SpecialtyConfig } from '../../types/specialty';
import { Stethoscope } from 'lucide-react';

export const generalConfig: SpecialtyConfig = {
  name: 'Medicina General',
  icon: Stethoscope.name,
  promptTemplate: `Eres un médico general experto analizando síntomas.
    Por favor, analiza los siguientes datos del paciente y proporciona:
    1. Evaluación general de síntomas
    2. Posibles diagnósticos
    3. Nivel de urgencia
    4. Recomendaciones preliminares`,
  requiredFields: ['temperature', 'bloodPressure', 'heartRate', 'oxygenSaturation'],
  specialtyFields: {
    temperature: {
      type: 'number',
      label: 'Temperatura',
      unit: '°C'
    },
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
    oxygenSaturation: {
      type: 'number',
      label: 'Saturación de Oxígeno',
      unit: '%'
    }
  }
};