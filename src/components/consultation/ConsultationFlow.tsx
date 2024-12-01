import React from 'react';
import AudioRecorder from '../AudioRecorder';
import PatientForm from './PatientForm';
import { usePatientStore } from '../../stores/usePatientStore';

export default function ConsultationFlow() {
  const { currentPatient } = usePatientStore();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Consulta Médica
        </h1>

        {!currentPatient ? (
          <PatientForm />
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Grabación de Síntomas
            </h2>
            <p className="text-gray-600 mb-4">
              Por favor, describa sus síntomas y motivo de consulta. 
              Tiene hasta 5 minutos para grabar su mensaje.
            </p>
            <AudioRecorder />
          </div>
        )}
      </div>
    </div>
  );
}