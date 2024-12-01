import React from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { getSpecialtyConfig } from '../../config/specialties';
import { SpecialtyData } from '../../types/specialty';

interface SpecialtyFormProps {
  onSubmit: (data: SpecialtyData) => void;
}

export default function SpecialtyForm({ onSubmit }: SpecialtyFormProps) {
  const { specialty = 'general' } = useParams();
  const config = getSpecialtyConfig(specialty);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const handleFormSubmit = (data: any) => {
    onSubmit({
      specialty,
      specialtyFields: data,
      patient: {} // Will be filled by the parent component
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(config.specialtyFields).map(([key, field]) => (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-700">
              {field.label}
              {field.unit && <span className="text-gray-500 ml-1">({field.unit})</span>}
            </label>

            {field.type === 'select' ? (
              <select
                {...register(key)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Seleccionar...</option>
                {field.options?.map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : field.type === 'checkbox' ? (
              <div className="mt-1">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    {...register(key)}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <span className="ml-2">{field.label}</span>
                </label>
              </div>
            ) : (
              <input
                type={field.type}
                {...register(key)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            )}

            {errors[key] && (
              <p className="mt-1 text-sm text-red-600">
                {errors[key].message}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Continuar
        </button>
      </div>
    </form>
  );
}