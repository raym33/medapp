import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { usePatientData } from '../hooks/usePatientData';
import { useChatMessages } from '../hooks/useChatMessages';
import { transcribeAudio, analyzeTranscription } from '../services/openai';
import { processPatientAnswer } from '../utils/patientDataProcessor';
import { CHAT_STEPS, STEP_QUESTIONS } from '../constants/chatSteps';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import AudioRecorder from './AudioRecorder';
import PatientReport from './PatientReport';

export default function ChatInterface() {
  const [input, setInput] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { messages, addBotMessage, addUserMessage } = useChatMessages(
    '¡Hola! Soy el asistente médico virtual. Puedes contarme tus síntomas por escrito o grabando un mensaje de voz. Para empezar, ¿cuál es tu nombre?'
  );
  
  const { patientData, updatePatientData, currentStep, moveToNextStep } = usePatientData();

  const handleSend = () => {
    if (!input.trim()) return;

    addUserMessage(input);
    const update = processPatientAnswer(currentStep, input, patientData);
    updatePatientData(update);
    setInput('');

    if (currentStep === CHAT_STEPS.ANTECEDENTES) {
      setIsComplete(true);
      addBotMessage('¡Gracias! He generado tu informe médico.');
    } else {
      moveToNextStep();
      addBotMessage(STEP_QUESTIONS[currentStep as keyof typeof STEP_QUESTIONS]);
    }
  };

  const handleAudioRecording = async (blob: Blob) => {
    try {
      setIsProcessing(true);
      addBotMessage('Procesando tu mensaje de voz...');

      const transcription = await transcribeAudio(blob);
      const analysis = await analyzeTranscription(transcription);

      updatePatientData({ 
        audioTranscription: transcription,
        aiAnalysis: analysis
      });

      addBotMessage('He analizado tu mensaje. Esta es la transcripción:');
      addBotMessage(transcription);
      addBotMessage('Basado en tu descripción, este es mi análisis:');
      addBotMessage(analysis);

      if (currentStep === CHAT_STEPS.SINTOMAS) {
        moveToNextStep();
        addBotMessage(STEP_QUESTIONS[CHAT_STEPS.MEDICACION]);
      }
    } catch (error) {
      addBotMessage('Lo siento, hubo un error al procesar el audio. Por favor, intenta escribir tu mensaje.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="bg-blue-600 p-4 flex items-center gap-2">
          <MessageCircle className="text-white" />
          <h1 className="text-xl font-semibold text-white">Asistente Médico Virtual</h1>
        </div>
        
        <div className="h-[600px] flex flex-col">
          <MessageList messages={messages} />

          {!isComplete ? (
            <>
              <ChatInput
                input={input}
                isProcessing={isProcessing}
                onInputChange={setInput}
                onSend={handleSend}
              />
              {currentStep === CHAT_STEPS.SINTOMAS && (
                <AudioRecorder onRecordingComplete={handleAudioRecording} />
              )}
            </>
          ) : (
            <PatientReport data={patientData} />
          )}
        </div>
      </div>
    </div>
  );
}