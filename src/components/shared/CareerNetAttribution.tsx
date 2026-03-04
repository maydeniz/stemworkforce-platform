// ===========================================
// CareerNet Attribution Component
// Required by CC BY 4.0 license on all CareerNet data renders
// ===========================================

import React from 'react';

interface CareerNetAttributionProps {
  compact?: boolean;
  className?: string;
}

const CareerNetAttribution: React.FC<CareerNetAttributionProps> = ({ compact = false, className = '' }) => {
  if (compact) {
    return (
      <p className={`text-xs text-gray-500 ${className}`}>
        Career Q&amp;A from{' '}
        <a
          href="https://www.careervillage.org"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:underline"
        >
          CareerVillage.org
        </a>{' '}
        via CareerNet (CC BY 4.0)
      </p>
    );
  }

  return (
    <div className={`bg-gray-900/50 border border-white/5 rounded-lg p-3 ${className}`}>
      <p className="text-xs text-gray-400">
        Career Q&amp;A data provided by{' '}
        <a
          href="https://www.careervillage.org"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:underline"
        >
          CareerVillage.org
        </a>{' '}
        via the{' '}
        <a
          href="https://github.com/RenaissancePhilanthropy/careernet-data"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:underline"
        >
          CareerNet dataset
        </a>{' '}
        under{' '}
        <a
          href="https://creativecommons.org/licenses/by/4.0/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:underline"
        >
          CC BY 4.0
        </a>{' '}
        license.
      </p>
    </div>
  );
};

export default CareerNetAttribution;
