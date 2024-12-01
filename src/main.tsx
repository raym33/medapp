import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { validateEnvVariables } from './config/env';

try {
  // Validate environment variables before rendering
  validateEnvVariables();

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
} catch (error) {
  const root = document.getElementById('root');
  if (root && error instanceof Error) {
    root.innerHTML = `
      <div style="padding: 20px; color: #ef4444; background: #fee2e2; border: 1px solid #ef4444; border-radius: 6px; margin: 20px;">
        <h2 style="margin: 0 0 10px 0;">Configuration Error</h2>
        <pre style="margin: 0; white-space: pre-wrap;">${error.message}</pre>
      </div>
    `;
  }
}