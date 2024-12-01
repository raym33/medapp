import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import { sendEmailToDoctor } from '../services/email';
import { PatientData } from '../types/types';

interface EmailFormProps {
  patientData: PatientData;
  onEmailSent: () => void;
}

export default function EmailForm({ patientData, onEmailSent }: EmailFormProps) {
  const [doctorEmail, setDoctorEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setError(null);

    try {
      const reportContent = JSON.stringify(patientData, null, 2);
      await sendEmailToDoctor({
        doctorEmail,
        patientName: patientData.nombre,
        reportContent,
      });
      onEmailSent();
    } catch (err) {
      setError('Error al enviar el email. Por favor, intente nuevamente.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
      <div>
        <label htmlFor="doctorEmail" className="block text-sm font-medium text-gray-700">
          Email del Doctor
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <input
            type="email"
            id="doctorEmail"
            value={doctorEmail}
            onChange={(e) => setDoctorEmail(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="doctor@ejemplo.com"
            required
          />
        </div>
      </div>

      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}

      <button
        type="submit"
        disabled={isSending}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        <Mail className="mr-2 h-4 w-4" />
        {isSending ? 'Enviando...' : 'Enviar al Doctor'}
      </button>
    </form>
  );
}