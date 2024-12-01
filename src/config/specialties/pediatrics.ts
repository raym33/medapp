import { SpecialtyConfig } from '../../types/specialty';
import { Baby } from 'lucide-react';

export const pediatricsConfig: SpecialtyConfig = {
  name: 'Pediatría',
  icon: Baby.name,
  promptTemplate: `Eres un pediatra experto analizando síntomas en niños.
    Por favor, analiza los siguientes datos del paciente y proporciona:
    1. Evaluación de síntomas pediátricos
    2. Posibles condiciones
    3. Nivel de urgencia
    4. Recomendaciones específicas para la edad`,
  requiredFields: ['weight', 'height', 'development', 'vaccination'],
  specialtyFields: {
    weight: {
      type: 'number',
      label: 'Peso',
      unit: 'kg'
    },
    height: {
      type: 'number',
      label: 'Altura',
      unit: 'cm'
    },
    development: {
      type: 'select',
      label: 'Desarrollo',
      options: ['Normal', 'Retraso leve', 'Retraso moderado', 'Retraso severo']
    },
    vaccination: {
      type: 'select',
      label: 'Estado de Vacunación',
      options: ['Al día', 'Pendiente', 'Incompleto']
    },
    fever: {
      type: 'checkbox',
      label: 'Fiebre'
    }
  }
};