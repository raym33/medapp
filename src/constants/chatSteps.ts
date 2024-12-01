export const CHAT_STEPS = {
  NOMBRE: 'nombre',
  EDAD: 'edad',
  GENERO: 'genero',
  SINTOMAS: 'sintomas',
  MEDICACION: 'medicacion',
  ALERGIAS: 'alergias',
  ANTECEDENTES: 'antecedentes',
  COMPLETE: 'complete'
} as const;

export const STEP_QUESTIONS = {
  [CHAT_STEPS.NOMBRE]: '¿Cuál es tu nombre?',
  [CHAT_STEPS.EDAD]: '¿Cuál es tu edad?',
  [CHAT_STEPS.GENERO]: '¿Cuál es tu género?',
  [CHAT_STEPS.SINTOMAS]: '¿Qué síntomas presentas? Puedes contármelos por escrito o usar el botón de grabación para describirlos.',
  [CHAT_STEPS.MEDICACION]: '¿Tomas alguna medicación actualmente? Si es así, ¿cuál?',
  [CHAT_STEPS.ALERGIAS]: '¿Tienes alguna alergia? Si es así, menciónalas.',
  [CHAT_STEPS.ANTECEDENTES]: '¿Tienes antecedentes médicos importantes?'
} as const;