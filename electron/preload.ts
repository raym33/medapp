```typescript
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  saveConfig: (config: Record<string, string>) => 
    ipcRenderer.invoke('save-config', config),
  startApp: () => 
    ipcRenderer.invoke('start-app')
});
```