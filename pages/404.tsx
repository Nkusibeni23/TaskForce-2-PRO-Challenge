import React from "react";
import { useRouter } from "next/router";

const NotFoundPage = () => {
  const router = useRouter();

  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 text-center">
      <div className="max-w-lg p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-gray-800">404</h1>
        <p className="mt-4 text-xl text-gray-600">
          Oops! The page you were looking for doesn&apos;t exist.
        </p>
        <button
          onClick={handleGoHome}
          className="mt-6 px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Go Back to Home
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
