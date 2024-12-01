import React, { useState, useEffect } from 'react';
import { FileText, Mail, Loader } from 'lucide-react';
import { PatientData } from '../types/types';
import EmailForm from './EmailForm';
import { generateMedicalSummary } from '../services/openai';

interface PatientReportProps {
  data: PatientData;
}

export default function PatientReport({ data }: PatientReportProps) {
  const [emailSent, setEmailSent] = useState(false);
  const [aiSummary, setAiSummary] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function generateSummary() {
      try {
        const summary = await generateMedicalSummary(data);
        setAiSummary(summary);
      } catch (error) {
        console.error('Error generating summary:', error);
      } finally {
        setIsLoading(false);
      }
    }
    generateSummary();
  }, [data]);

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <Loader className="animate-spin mr-2" />
        <span>Generando informe médico...</span>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white border-t">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="text-blue-600" />
        <h2 className="text-xl font-semibold">Informe Médico</h2>
      </div>
      
      <div className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">Resumen AI</h3>
          <div className="text-blue-900 whitespace-pre-wrap">{aiSummary}</div>
        </div>

        <div>
          <h3 className="font-semibold text-gray-700">Datos Personales</h3>
          <p>Nombre: {data.nombre}</p>
          <p>Edad: {data.edad} años</p>
          <p>Género: {data.genero}</p>
        </div>

        <div>
          <h3 className="font-semibold text-gray-700">Síntomas Actuales</h3>
          <ul className="list-disc list-inside">
            {data.sintomas.map((sintoma, index) => (
              <li key={index}>{sintoma}</li>
            ))}
          </ul>
          
          {data.audioTranscription && (
            <div className="mt-2 bg-gray-50 p-3 rounded">
              <h4 className="font-medium text-gray-600">Transcripción del Audio</h4>
              <p className="text-sm mt-1">{data.audioTranscription}</p>
            </div>
          )}
          
          {data.aiAnalysis && (
            <div className="mt-2 bg-gray-50 p-3 rounded">
              <h4 className="font-medium text-gray-600">Análisis AI</h4>
              <p className="text-sm mt-1">{data.aiAnalysis}</p>
            </div>
          )}
        </div>

        <div>
          <h3 className="font-semibold text-gray-700">Medicación Actual</h3>
          <p>{data.medicacion || 'No toma medicación'}</p>
        </div>

        <div>
          <h3 className="font-semibold text-gray-700">Alergias</h3>
          {data.alergias.length > 0 ? (
            <ul className="list-disc list-inside">
              {data.alergias.map((alergia, index) => (
                <li key={index}>{alergia}</li>
              ))}
            </ul>
          ) : (
            <p>No presenta alergias</p>
          )}
        </div>

        <div>
          <h3 className="font-semibold text-gray-700">Antecedentes Médicos</h3>
          <p>{data.antecedentes || 'Sin antecedentes relevantes'}</p>
        </div>

        {!emailSent ? (
          <EmailForm 
            patientData={{
              ...data,
              aiSummary
            }}
            onEmailSent={() => setEmailSent(true)} 
          />
        ) : (
          <div className="mt-4 p-4 bg-green-50 text-green-700 rounded-md flex items-center gap-2">
            <Mail className="h-5 w-5" />
            <span>¡Informe enviado exitosamente al doctor!</span>
          </div>
        )}
      </div>
    </div>
  );
}