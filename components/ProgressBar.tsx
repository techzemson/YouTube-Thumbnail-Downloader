import React from 'react';

interface ProgressBarProps {
  progress: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  return (
    <div className="w-full max-w-md mx-auto my-8">
      <div className="flex justify-between text-xs font-semibold text-slate-500 mb-1">
        <span>Analyzing URL...</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-brand-500 to-orange-500 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-center text-slate-400 text-xs mt-2 animate-pulse">
        Fetching metadata and generating resolutions...
      </p>
    </div>
  );
};

export default ProgressBar;