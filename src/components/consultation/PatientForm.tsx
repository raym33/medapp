import React from 'react';
import { useForm } from 'react-hook-form';
import { usePatientStore } from '../../stores/usePatientStore';

interface PatientFormData {
  name: string;
  birthDate: string;
  identification: string;
  gender: string;
  phone: string;
  email: string;
  address: string;
  hasHistory: boolean;
  firstVisit: boolean;
  hasAllergies: boolean;
  allergies: string;
  onMedication: boolean;
  currentMedication: string;
  familyHistory: string;
  chronicDiseases: string;
  previousSurgeries: string;
  habits: string;
}

export default function PatientForm() {
  const { register, handleSubmit, watch } = useForm<PatientFormData>();
  const { savePatient, setCurrentPatient } = usePatientStore();

  const hasAllergies = watch('hasAllergies');
  const onMedication = watch('onMedication');

  const onSubmit = async (data: PatientFormData) => {
    const patientData = {
      name: data.name,
      age: calculateAge(data.birthDate),
      gender: data.gender,
      symptoms: [],
      medication: data.onMedication ? data.currentMedication : '',
      allergies: data.hasAllergies ? data.allergies.split(',').map(a => a.trim()) : [],
      medicalHistory: formatMedicalHistory(data)
    };

    const id = await savePatient(patientData);
    setCurrentPatient({ ...patientData, id });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nombre completo</label>
          <input
            type="text"
            {...register('name')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Fecha de nacimiento</label>
          <input
            type="date"
            {...register('birthDate')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">DNI/Identificación</label>
          <input
            type="text"
            {...register('identification')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Género</label>
          <select
            {...register('gender')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Seleccionar...</option>
            <option value="masculino">Masculino</option>
            <option value="femenino">Femenino</option>
            <option value="otro">Otro</option>
          </select>
        </div>

        {/* Contact Information */}
        <div className="col-span-2">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Información de contacto</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Teléfono</label>
              <input
                type="tel"
                {...register('phone')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                {...register('email')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Medical History */}
        <div className="col-span-2">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Historia Clínica</h3>
          
          <div className="space-y-4">
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  {...register('hasAllergies')}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <span className="ml-2">¿Tiene alergias conocidas?</span>
              </label>
              {hasAllergies && (
                <input
                  type="text"
                  {...register('allergies')}
                  placeholder="Describa sus alergias"
                  className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              )}
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  {...register('onMedication')}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <span className="ml-2">¿Toma medicación actualmente?</span>
              </label>
              {onMedication && (
                <input
                  type="text"
                  {...register('currentMedication')}
                  placeholder="Describa su medicación actual"
                  className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Antecedentes familiares</label>
              <textarea
                {...register('familyHistory')}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Enfermedades crónicas</label>
              <textarea
                {...register('chronicDiseases')}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Continuar
        </button>
      </div>
    </form>
  );
}

function calculateAge(birthDate: string): number {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
}

function formatMedicalHistory(data: PatientFormData): string {
  return `
Antecedentes familiares: ${data.familyHistory}
Enfermedades crónicas: ${data.chronicDiseases}
Cirugías previas: ${data.previousSurgeries}
Hábitos: ${data.habits}
  `.trim();
}