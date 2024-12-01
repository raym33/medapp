import { aiOrchestrator } from './AIOrchestrator';
import { promptOptimizer } from '../promptOptimizer';
import { SpecialtyData } from '../../types/specialty';

export class MedicalAnalyzer {
  async analyzeMedicalCase(data: SpecialtyData): Promise<string> {
    try {
      const optimizedPrompt = promptOptimizer.optimizePrompt(
        data.patient,
        data.specialty
      );

      return await aiOrchestrator.processRequest(
        { prompt: optimizedPrompt, specialty: data.specialty },
        'medical_analysis'
      );
    } catch (error) {
      console.error('Error analyzing medical case:', error);
      throw new Error('Failed to analyze medical case');
    }
  }

  async generateMedicalReport(data: SpecialtyData): Promise<string> {
    try {
      const analysis = await this.analyzeMedicalCase(data);
      
      return await aiOrchestrator.processRequest(
        {
          analysis,
          patient: data.patient,
          specialty: data.specialty,
          specialtyData: data.specialtyFields
        },
        'medical_report'
      );
    } catch (error) {
      console.error('Error generating medical report:', error);
      throw new Error('Failed to generate medical report');
    }
  }
}

export const medicalAnalyzer = new MedicalAnalyzer();