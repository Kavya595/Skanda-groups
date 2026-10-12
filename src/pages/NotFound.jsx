import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-white px-4 py-20">
      <div className="max-w-md w-full text-center space-y-6">
        <span className="text-6xl font-extrabold text-[#F58220] block font-mono">
          404
        </span>
        <h1 className="text-3xl font-extrabold text-[#202124]">
          Page Not Found
        </h1>
        <p className="text-sm text-[#6B7280]">
          The page or layout you are looking for has been moved or does not exist. Please return to our home page to explore our active ventures.
        </p>
        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white bg-[#F58220] hover:bg-[#E07016] transition-colors shadow"
          >
            <Home className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
