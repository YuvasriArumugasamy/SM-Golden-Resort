import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] gap-3">
      <div className="w-12 h-12 border-4 border-cream-dark border-t-primary rounded-full animate-spin"></div>
      <span className="text-xs text-navy/50 font-medium uppercase tracking-wider">Loading...</span>
    </div>
  );
};

export default LoadingSpinner;
