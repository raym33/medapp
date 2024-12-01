import React from 'react';
import { useNavigate } from 'react-router-dom';
import { specialtyConfigs } from '../../config/specialties';
import * as Icons from 'lucide-react';

export default function SpecialtySelector() {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      {Object.entries(specialtyConfigs).map(([key, config]) => {
        const IconComponent = Icons[config.icon as keyof typeof Icons];
        
        return (
          <button
            key={key}
            onClick={() => navigate(`/consultation/${key}`)}
            className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <IconComponent className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900">
              {config.name}
            </h3>
          </button>
        );
      })}
    </div>
  );
}