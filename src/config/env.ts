import { initializeApp } from 'firebase/app';

export const config = {
  openai: {
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  },
  anthropic: {
    apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
  },
  emailjs: {
    serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
    templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
    publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
  },
  firebase: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
  }
};

export function validateEnvVariables() {
  const missingVars = [];
  
  // OpenAI
  if (!import.meta.env.VITE_OPENAI_API_KEY) {
    missingVars.push('OpenAI API Key (VITE_OPENAI_API_KEY)');
  }

  // EmailJS
  if (!import.meta.env.VITE_EMAILJS_SERVICE_ID) {
    missingVars.push('EmailJS Service ID (VITE_EMAILJS_SERVICE_ID)');
  }
  if (!import.meta.env.VITE_EMAILJS_TEMPLATE_ID) {
    missingVars.push('EmailJS Template ID (VITE_EMAILJS_TEMPLATE_ID)');
  }
  if (!import.meta.env.VITE_EMAILJS_PUBLIC_KEY) {
    missingVars.push('EmailJS Public Key (VITE_EMAILJS_PUBLIC_KEY)');
  }

  // Firebase
  if (!import.meta.env.VITE_FIREBASE_API_KEY) {
    missingVars.push('Firebase API Key (VITE_FIREBASE_API_KEY)');
  }
  if (!import.meta.env.VITE_FIREBASE_AUTH_DOMAIN) {
    missingVars.push('Firebase Auth Domain (VITE_FIREBASE_AUTH_DOMAIN)');
  }
  if (!import.meta.env.VITE_FIREBASE_PROJECT_ID) {
    missingVars.push('Firebase Project ID (VITE_FIREBASE_PROJECT_ID)');
  }

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables:\n${missingVars.join('\n')}\n\n` +
      'Please add these to your .env file.'
    );
  }
}

// Initialize Firebase
export const firebaseApp = initializeApp(config.firebase);