import { useState, useCallback } from 'react';
import { ChatMessage } from '../types/types';

export function useChatMessages(initialMessage: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { type: 'bot', content: initialMessage }
  ]);

  const addMessage = useCallback((message: ChatMessage) => {
    setMessages(prev => [...prev, message]);
  }, []);

  const addBotMessage = useCallback((content: string) => {
    addMessage({ type: 'bot', content });
  }, [addMessage]);

  const addUserMessage = useCallback((content: string) => {
    addMessage({ type: 'user', content });
  }, [addMessage]);

  return {
    messages,
    addMessage,
    addBotMessage,
    addUserMessage
  };
}