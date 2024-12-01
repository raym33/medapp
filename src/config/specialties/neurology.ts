import { SpecialtyConfig } from '../../types/specialty';
import { Brain } from 'lucide-react';

export const neurologyConfig: SpecialtyConfig = {
  name: 'Neurología',
  icon: Brain.name,
  promptTemplate: `Eres un neurólogo experto analizando síntomas neurológicos.
    Por favor, analiza los siguientes datos del paciente y proporciona:
    1. Evaluación de síntomas neurológicos
    2. Posibles condiciones neurológicas
    3. Nivel de urgencia
    4. Recomendaciones preliminares`,
  requiredFields: ['consciousness', 'reflexes', 'cognitive', 'sleep'],
  specialtyFields: {
    consciousness: {
      type: 'select',
      label: 'Nivel de Consciencia',
      options: ['Alerta', 'Somnoliento', 'Confuso', 'Comatoso']
    },
    reflexes: {
      type: 'select',
      label: 'Reflejos',
      options: ['Normales', 'Disminuidos', 'Aumentados', 'Ausentes']
    },
    cognitive: {
      type: 'text',
      label: 'Estado Cognitivo'
    },
    sleep: {
      type: 'text',
      label: 'Patrones de Sueño'
    },
    headache: {
      type: 'checkbox',
      label: 'Dolor de cabeza'
    }
  }
};