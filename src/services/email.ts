import emailjs from '@emailjs/browser';
import { config } from '../config/env';

interface EmailParams {
  doctorEmail: string;
  patientName: string;
  reportContent: string;
}

export const sendEmailToDoctor = async ({ doctorEmail, patientName, reportContent }: EmailParams): Promise<void> => {
  try {
    await emailjs.send(
      config.emailjs.serviceId,
      config.emailjs.templateId,
      {
        to_email: doctorEmail,
        patient_name: patientName,
        report_content: reportContent,
      },
      config.emailjs.publicKey
    );
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email to doctor');
  }
};