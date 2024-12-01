import { db } from '../db/database';
import { transcribeAudio, analyzeTranscription } from './openai';
import { logAuditEvent } from './auditService';

export async function processAudioRecording(audioBlob: Blob, patientId: number) {
  try {
    // Save initial audio record
    const audioRecord = {
      patientId,
      audioBlob,
      createdAt: new Date()
    };
    
    const audioId = await db.audioRecords.add(audioRecord);
    
    // Log audio recording start
    await logAuditEvent('system', 'audio_processing_start', {
      patientId,
      audioId,
      timestamp: new Date()
    });

    // Process with OpenAI
    const transcription = await transcribeAudio(audioBlob);
    const analysis = await analyzeTranscription(transcription);
    
    // Update record with results
    await db.audioRecords.update(audioId, {
      transcription,
      analysis
    });

    // Log successful processing
    await logAuditEvent('system', 'audio_processing_complete', {
      patientId,
      audioId,
      timestamp: new Date()
    });
    
    return { transcription, analysis };
  } catch (error) {
    // Log error
    await logAuditEvent('system', 'audio_processing_error', {
      patientId,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date()
    });

    console.error('Error processing audio:', error);
    throw new Error('Failed to process audio recording. Please try again or contact support.');
  }
}

export async function getPatientAudioRecords(patientId: number) {
  try {
    return await db.audioRecords
      .where('patientId')
      .equals(patientId)
      .reverse()
      .sortBy('createdAt');
  } catch (error) {
    console.error('Error fetching audio records:', error);
    throw new Error('Failed to retrieve audio records');
  }
}