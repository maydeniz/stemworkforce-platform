import React from 'react';
import { useParams } from 'react-router-dom';

const JobDetailPage: React.FC = () => {
  const { id } = useParams();
  
  return (
    <div className="min-h-screen bg-dark-bg py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-white mb-4">Job Details</h1>
        <p className="text-gray-400">Job ID: {id}</p>
        {/* Job details will be implemented here */}
      </div>
    </div>
  );
};

export default JobDetailPage;
