import React from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  input: string;
  isProcessing: boolean;
  onInputChange: (value: string) => void;
  onSend: () => void;
}

export default function ChatInput({ input, isProcessing, onInputChange, onSend }: ChatInputProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSend();
    }
  };

  return (
    <div className="p-4 border-t">
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Escribe tu respuesta..."
          disabled={isProcessing}
        />
        <button
          onClick={onSend}
          className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          disabled={isProcessing}
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}