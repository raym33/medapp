import { config } from '../config/env';
import { aiOrchestrator } from './ai/AIOrchestrator';
import { logAuditEvent } from './auditService';

export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('file', audioBlob);
    formData.append('model', 'whisper-1');
    formData.append('language', 'es');

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.openai.apiKey}`
      },
      body: formData
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Transcription failed');
    }

    const data = await response.json();
    return data.text;
  } catch (error) {
    await logAuditEvent('system', 'transcription_error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date()
    });

    console.error('Error in transcribeAudio:', error);
    throw new Error('Failed to transcribe audio. Please try again or speak more clearly.');
  }
}

export async function analyzeTranscription(transcription: string): Promise<string> {
  try {
    return await aiOrchestrator.processRequest(
      { transcription },
      'medical_analysis'
    );
  } catch (error) {
    await logAuditEvent('system', 'analysis_error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date()
    });

    console.error('Error in analyzeTranscription:', error);
    throw new Error('Failed to analyze transcription. Please try again.');
  }
}