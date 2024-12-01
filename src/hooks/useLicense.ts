import { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/useAuthStore';
import { licenseService } from '../services/security/licenseService';

export function useLicense() {
  const user = useAuthStore(state => state.user);
  const [licenseStatus, setLicenseStatus] = useState({
    isValid: false,
    daysLeft: 0,
    type: '',
    loading: true,
    error: null as string | null
  });

  useEffect(() => {
    async function checkLicense() {
      if (!user) {
        setLicenseStatus(prev => ({ ...prev, loading: false }));
        return;
      }

      try {
        const status = await licenseService.verifyLicense(user.uid);
        setLicenseStatus({
          isValid: status.isValid,
          daysLeft: status.daysLeft || 0,
          type: status.type || '',
          loading: false,
          error: null
        });
      } catch (error) {
        setLicenseStatus({
          isValid: false,
          daysLeft: 0,
          type: '',
          loading: false,
          error: 'Error verifying license'
        });
      }
    }

    checkLicense();
  }, [user]);

  return licenseStatus;
}