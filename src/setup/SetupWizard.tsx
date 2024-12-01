```typescript
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface APIKeys {
  openai: string;
  emailjs_service: string;
  emailjs_template: string;
  emailjs_public: string;
}

export default function SetupWizard() {
  const [step, setStep] = useState(1);
  const [keys, setKeys] = useState<APIKeys>({
    openai: '',
    emailjs_service: '',
    emailjs_template: '',
    emailjs_public: ''
  });
  const [testing, setTesting] = useState(false);
  const [status, setStatus] = useState<Record<string, boolean>>({});

  const handleKeyChange = (key: keyof APIKeys, value: string) => {
    setKeys(prev => ({ ...prev, [key]: value }));
  };

  const testConnections = async () => {
    setTesting(true);
    try {
      const connectionStatus = await window.electron.testConnections(keys);
      setStatus(connectionStatus);
      
      if (Object.values(connectionStatus).every(status => status)) {
        await window.electron.saveConfig(keys);
        setStep(3);
      }
    } catch (error) {
      console.error('Connection test failed:', error);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Medical Consultation Setup</CardTitle>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">OpenAI Configuration</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Enter your OpenAI API key to enable AI-powered features
                </p>
                <Input
                  type="password"
                  placeholder="OpenAI API Key"
                  value={keys.openai}
                  onChange={(e) => handleKeyChange('openai', e.target.value)}
                />
              </div>
              <Button 
                onClick={() => setStep(2)}
                disabled={!keys.openai}
                className="w-full"
              >
                Next
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">EmailJS Configuration</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Configure EmailJS to enable sending reports to doctors
                </p>
                <div className="space-y-2">
                  <Input
                    placeholder="Service ID"
                    value={keys.emailjs_service}
                    onChange={(e) => handleKeyChange('emailjs_service', e.target.value)}
                  />
                  <Input
                    placeholder="Template ID"
                    value={keys.emailjs_template}
                    onChange={(e) => handleKeyChange('emailjs_template', e.target.value)}
                  />
                  <Input
                    placeholder="Public Key"
                    value={keys.emailjs_public}
                    onChange={(e) => handleKeyChange('emailjs_public', e.target.value)}
                  />
                </div>
              </div>
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button 
                  onClick={testConnections} 
                  disabled={testing || !Object.values(keys).every(Boolean)}
                >
                  {testing ? 'Testing Connections...' : 'Test & Save'}
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="text-center">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-green-600 mb-2">
                  Setup Complete!
                </h3>
                <p className="text-gray-600">
                  All configurations have been saved successfully.
                </p>
              </div>
              <Button 
                onClick={() => window.electron.startApp()}
                className="w-full"
              >
                Launch Application
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
```