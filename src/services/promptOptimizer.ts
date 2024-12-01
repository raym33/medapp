import { SpecialtyConfig } from '../types/specialty';
import { specialtyConfigs } from '../config/specialties';

export class PromptOptimizer {
  private readonly abbreviations: Record<string, string> = {
    "hipertensión arterial": "HTA",
    "diabetes mellitus": "DM",
    "insuficiencia cardíaca": "IC",
    "enfermedad pulmonar obstructiva crónica": "EPOC",
    "accidente cerebrovascular": "ACV"
  };

  optimizePrompt(data: any, specialty: string): string {
    const config = specialtyConfigs[specialty];
    const optimizedData = this.optimizeData(data, config);
    
    return `
${this.createSystemPrompt(specialty)}

DATOS PACIENTE:
${this.formatPatientData(optimizedData)}

EVALUACIÓN:
${this.formatEvaluation(optimizedData, config)}

INSTRUCCIONES:
1. Analiza hallazgos críticos
2. Lista diagnósticos diferenciales (máx 3)
3. Recomienda estudios específicos
4. Propón plan terapéutico
5. Indica criterios de alarma`;
  }

  private createSystemPrompt(specialty: string): string {
    const config = specialtyConfigs[specialty];
    return `Eres un ${config.name} experto. 
    Utiliza terminología médica precisa.
    Prioriza: hallazgos críticos, diagnósticos diferenciales, plan terapéutico.
    Incluye: códigos CIE-10 relevantes.`;
  }

  private optimizeData(data: any, config: SpecialtyConfig) {
    return {
      ...data,
      symptoms: this.abbreviateText(data.symptoms || []),
      medicalHistory: this.abbreviateText(data.medicalHistory || ''),
      specialtyData: this.extractSpecialtyData(data, config)
    };
  }

  private abbreviateText(text: string | string[]): string | string[] {
    if (Array.isArray(text)) {
      return text.map(item => this.applySingleAbbreviation(item));
    }
    return this.applySingleAbbreviation(text);
  }

  private applySingleAbbreviation(text: string): string {
    let abbreviated = text;
    for (const [full, abbr] of Object.entries(this.abbreviations)) {
      const regex = new RegExp(full, 'gi');
      abbreviated = abbreviated.replace(regex, abbr);
    }
    return abbreviated;
  }

  private extractSpecialtyData(data: any, config: SpecialtyConfig): Record<string, any> {
    return config.requiredFields.reduce((acc: Record<string, any>, field: string) => {
      if (data[field]) {
        acc[field] = data[field];
      }
      return acc;
    }, {});
  }

  private formatPatientData(data: any): string {
    return `Edad: ${data.age}|Sexo: ${data.gender}|MC: ${data.chiefComplaint}`;
  }

  private formatEvaluation(data: any, config: SpecialtyConfig): string {
    const specialtyData = Object.entries(data.specialtyData)
      .map(([key, value]) => `${key}:${value}`)
      .join('|');

    const symptoms = Array.isArray(data.symptoms) 
      ? data.symptoms.join('|')
      : data.symptoms;

    return `
DATOS ESPECÍFICOS:
${specialtyData}

SÍNTOMAS:
${symptoms}

ANTECEDENTES:
${data.medicalHistory}`;
  }
}

export const promptOptimizer = new PromptOptimizer();