'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

const ErrorPage = () => {
  const router = useRouter();

  const handleRetry = () => {
    router.refresh(); 
  };

  const handleHome = () => {
    router.push('/'); 
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      <h1 className="text-4xl font-bold mb-4 text-red-600">
        Oops! Something went wrong.
      </h1>
      <p className="text-lg mb-6">
        We&apos;re sorry, but there was an unexpected error. Please try again or
        return to the home page.
      </p>
      <div className="flex space-x-4">
        <button
          onClick={handleRetry}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
        >
          Retry
        </button>
        <button
          onClick={handleHome}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg shadow-md hover:bg-gray-600 transition"
        >
          Home
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;
