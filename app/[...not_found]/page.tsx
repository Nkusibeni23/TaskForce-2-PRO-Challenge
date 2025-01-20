"use client";

import Link from "next/link";

export default function CatchAll() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 text-center">
      <div className="max-w-lg p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-gray-800">404</h1>
        <p className="mt-4 text-xl text-gray-600">
          Oops! The page you were looking for doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="mt-6 px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 inline-block"
        >
          Go Back to Home
        </Link>
      </div>
    </div>
  );
}
