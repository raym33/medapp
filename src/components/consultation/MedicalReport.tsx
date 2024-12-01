import React from 'react';
import { usePatientStore } from '../../stores/usePatientStore';
import { generateAndSendReport } from '../../services/reportService';
import { getPatientAudioRecords } from '../../services/audioService';
import { FileText, Mail } from 'lucide-react';

export default function MedicalReport() {
  const { currentPatient } = usePatientStore();
  const [sending, setSending] = React.useState(false);
  const [doctorEmail, setDoctorEmail] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);

  const handleSendReport = async () => {
    if (!currentPatient) return;

    setSending(true);
    setError(null);

    try {
      const audioRecords = await getPatientAudioRecords(currentPatient.id!);
      await generateAndSendReport(currentPatient, audioRecords, doctorEmail);
    } catch (err) {
      setError('Error al enviar el informe. Por favor, intente nuevamente.');
    } finally {
      setSending(false);
    }
  };

  if (!currentPatient) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-800">Informe Médico</h2>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="font-medium text-gray-700">Datos del Paciente</h3>
          <div className="mt-2 space-y-2">
            <p>Nombre: {currentPatient.name}</p>
            <p>Edad: {currentPatient.age} años</p>
            <p>Género: {currentPatient.gender}</p>
          </div>
        </div>

        <div>
          <h3 className="font-medium text-gray-700">Medicación Actual</h3>
          <p>{currentPatient.medication || 'No toma medicación'}</p>
        </div>

        <div>
          <h3 className="font-medium text-gray-700">Alergias</h3>
          {currentPatient.allergies.length > 0 ? (
            <ul className="list-disc list-inside">
              {currentPatient.allergies.map((allergy, index) => (
                <li key={index}>{allergy}</li>
              ))}
            </ul>
          ) : (
            <p>No presenta alergias</p>
          )}
        </div>

        <div>
          <h3 className="font-medium text-gray-700">Historia Médica</h3>
          <p className="whitespace-pre-wrap">{currentPatient.medicalHistory}</p>
        </div>

        <div className="pt-4 border-t">
          <h3 className="font-medium text-gray-700 mb-2">Enviar al Doctor</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Email del Doctor
              </label>
              <input
                type="email"
                value={doctorEmail}
                onChange={(e) => setDoctorEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="doctor@ejemplo.com"
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm">{error}</div>
            )}

            <button
              onClick={handleSendReport}
              disabled={sending || !doctorEmail}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <Mail className="mr-2 h-4 w-4" />
              {sending ? 'Enviando...' : 'Enviar Informe'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}