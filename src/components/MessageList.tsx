import React from 'react';
import { ChatMessage } from '../types/types';

interface MessageListProps {
  messages: ChatMessage[];
}

export default function MessageList({ messages }: MessageListProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`flex ${message.type === 'bot' ? 'justify-start' : 'justify-end'}`}
        >
          <div
            className={`max-w-[80%] p-3 rounded-lg ${
              message.type === 'bot'
                ? 'bg-gray-100'
                : 'bg-blue-500 text-white'
            }`}
          >
            {message.content}
          </div>
        </div>
      ))}
    </div>
  );
}