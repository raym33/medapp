import { SpecialtyConfig } from '../../types/specialty';
import { cardiologyConfig } from './cardiology';
import { neurologyConfig } from './neurology';
import { pediatricsConfig } from './pediatrics';
import { generalConfig } from './general';

export const specialtyConfigs: Record<string, SpecialtyConfig> = {
  general: generalConfig,
  cardiology: cardiologyConfig,
  neurology: neurologyConfig,
  pediatrics: pediatricsConfig,
  // Add other specialties as needed
};

export function getSpecialtyConfig(specialty: string): SpecialtyConfig {
  return specialtyConfigs[specialty] || specialtyConfigs.general;
}