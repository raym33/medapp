import React, { useState } from 'react';
import { useReactMediaRecorder } from 'react-media-recorder';
import { Mic, Square, Loader } from 'lucide-react';
import { processAudioRecording } from '../services/audioService';
import { usePatientStore } from '../stores/usePatientStore';

export default function AudioRecorder() {
  const [isProcessing, setIsProcessing] = useState(false);
  const currentPatient = usePatientStore(state => state.currentPatient);

  const {
    status,
    startRecording,
    stopRecording,
    mediaBlobUrl
  } = useReactMediaRecorder({
    audio: true,
    blobPropertyBag: { type: "audio/wav" },
    onStop: async (blobUrl, blob) => {
      if (!currentPatient?.id) {
        console.error('No patient selected');
        return;
      }

      setIsProcessing(true);
      try {
        await processAudioRecording(blob, currentPatient.id);
      } catch (error) {
        console.error('Error processing audio:', error);
      } finally {
        setIsProcessing(false);
      }
    }
  });

  if (!currentPatient) {
    return null;
  }

  return (
    <div className="flex items-center gap-4 p-4 border-t">
      {status !== 'recording' && !isProcessing && (
        <button
          onClick={startRecording}
          className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
        >
          <Mic size={20} />
          Grabar Audio
        </button>
      )}
      
      {status === 'recording' && (
        <button
          onClick={stopRecording}
          className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
        >
          <Square size={20} />
          Detener
        </button>
      )}

      {isProcessing && (
        <div className="flex items-center gap-2 text-gray-600">
          <Loader className="animate-spin" size={20} />
          <span>Procesando audio...</span>
        </div>
      )}

      {mediaBlobUrl && !isProcessing && (
        <div className="flex items-center gap-2">
          <audio src={mediaBlobUrl} controls className="h-8" />
        </div>
      )}
    </div>
  );
}