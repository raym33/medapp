import { PatientData } from '../types/types';
import { CHAT_STEPS } from '../constants/chatSteps';

export function processPatientAnswer(
  step: string,
  answer: string,
  currentData: PatientData
): Partial<PatientData> {
  switch (step) {
    case CHAT_STEPS.NOMBRE:
      return { nombre: answer };
    case CHAT_STEPS.EDAD:
      return { edad: parseInt(answer) };
    case CHAT_STEPS.GENERO:
      return { genero: answer };
    case CHAT_STEPS.SINTOMAS:
      return { sintomas: answer.split(',').map(s => s.trim()) };
    case CHAT_STEPS.MEDICACION:
      return { medicacion: answer };
    case CHAT_STEPS.ALERGIAS:
      return { alergias: answer.split(',').map(a => a.trim()) };
    case CHAT_STEPS.ANTECEDENTES:
      return { antecedentes: answer };
    default:
      return {};
  }
}