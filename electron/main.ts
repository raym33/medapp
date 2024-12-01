```typescript
import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import * as path from 'path';
import * as fs from 'fs/promises';
import { encrypt } from './encryption';
import Store from 'electron-store';

const store = new Store({
  encryptionKey: 'your-encryption-key'
});

let mainWindow: BrowserWindow | null = null;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // Check if configuration exists
  const hasConfig = store.has('apiKeys');
  
  if (hasConfig) {
    mainWindow.loadFile(path.join(__dirname, '../build/index.html'));
  } else {
    mainWindow.loadFile(path.join(__dirname, '../build/setup.html'));
  }
};

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Handle API key configuration
ipcMain.handle('save-config', async (_, config) => {
  try {
    const encryptedConfig = await encrypt(JSON.stringify(config));
    store.set('apiKeys', encryptedConfig);
    
    dialog.showMessageBox(mainWindow!, {
      type: 'info',
      title: 'Configuration Saved',
      message: 'API keys have been saved successfully.'
    });

    return true;
  } catch (error) {
    dialog.showErrorBox('Error', 'Failed to save configuration');
    return false;
  }
});

// Handle test connections
ipcMain.handle('test-connections', async (_, config) => {
  try {
    // Test OpenAI connection
    const openaiResponse = await fetch('https://api.openai.com/v1/models', {
      headers: { Authorization: `Bearer ${config.openai}` }
    });
    
    // Test EmailJS connection
    const emailjsResponse = await fetch('https://api.emailjs.com/api/v1.0/email/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        publicKey: config.emailjs_public,
        serviceId: config.emailjs_service,
        templateId: config.emailjs_template
      })
    });

    return {
      openai: openaiResponse.ok,
      emailjs: emailjsResponse.ok
    };
  } catch (error) {
    console.error('Connection test failed:', error);
    return {
      openai: false,
      emailjs: false
    };
  }
});

// Start the main application
ipcMain.handle('start-app', () => {
  mainWindow?.loadFile(path.join(__dirname, '../build/index.html'));
});
```