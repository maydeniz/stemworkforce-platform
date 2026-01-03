import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/common/Button';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center py-12 px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-700">404</h1>
        <h2 className="text-3xl font-bold text-white mt-4">Page Not Found</h2>
        <p className="text-gray-400 mt-2 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="inline-block mt-8">
          <Button>Go Home</Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
