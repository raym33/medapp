import { generateMedicalSummary } from './openai';
import { sendEmailToDoctor } from './email';
import { PatientRecord, AudioRecord } from '../types/database';

export async function generateAndSendReport(
  patient: PatientRecord,
  audioRecords: AudioRecord[],
  doctorEmail: string
) {
  try {
    // Prepare data for summary
    const reportData = {
      ...patient,
      audioRecords: audioRecords.map(record => ({
        transcription: record.transcription,
        analysis: record.analysis
      }))
    };

    // Generate AI summary
    const aiSummary = await generateMedicalSummary(reportData);

    // Prepare final report
    const report = {
      patientInfo: patient,
      audioAnalysis: audioRecords,
      aiSummary,
      generatedAt: new Date().toISOString()
    };

    // Send email
    await sendEmailToDoctor({
      doctorEmail,
      patientName: patient.name,
      reportContent: JSON.stringify(report, null, 2)
    });

    return report;
  } catch (error) {
    console.error('Error generating report:', error);
    throw new Error('Failed to generate and send medical report');
  }
}