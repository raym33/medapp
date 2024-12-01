import React from 'react';
import { useLicense } from '../../hooks/useLicense';
import { AlertTriangle } from 'lucide-react';

interface LicenseGuardProps {
  children: React.ReactNode;
  requiredFeature?: string;
}

export default function LicenseGuard({ children, requiredFeature }: LicenseGuardProps) {
  const { isValid, daysLeft, type, loading, error } = useLicense();

  if (loading) {
    return <div className="p-4">Verificando licencia...</div>;
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-md">
        <AlertTriangle className="inline-block mr-2" size={20} />
        Error al verificar la licencia
      </div>
    );
  }

  if (!isValid) {
    return (
      <div className="p-4 bg-yellow-50 text-yellow-700 rounded-md">
        <AlertTriangle className="inline-block mr-2" size={20} />
        Tu licencia ha expirado o no es válida
      </div>
    );
  }

  if (daysLeft <= 7) {
    return (
      <>
        <div className="p-4 mb-4 bg-yellow-50 text-yellow-700 rounded-md">
          <AlertTriangle className="inline-block mr-2" size={20} />
          Tu licencia expirará en {daysLeft} días
        </div>
        {children}
      </>
    );
  }

  return <>{children}</>;
}