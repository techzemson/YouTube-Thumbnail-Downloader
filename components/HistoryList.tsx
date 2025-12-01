import React from 'react';
import { VideoData } from '../types';
import { Clock, ArrowRight } from 'lucide-react';

interface HistoryListProps {
  history: VideoData[];
  onSelect: (url: string) => void;
  onClear: () => void;
}

const HistoryList: React.FC<HistoryListProps> = ({ history, onSelect, onClear }) => {
  if (history.length === 0) return null;

  return (
    <div className="mt-12 w-full max-w-4xl mx-auto px-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Clock size={20} className="text-brand-500" />
          Recent Downloads
        </h3>
        <button 
          onClick={onClear}
          className="text-xs text-slate-400 hover:text-brand-600 transition-colors"
        >
          Clear History
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {history.map((item) => (
          <div 
            key={`${item.id}-${item.timestamp}`} 
            onClick={() => onSelect(item.originalUrl)}
            className="group flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg hover:border-brand-300 hover:shadow-md cursor-pointer transition-all"
          >
            <img 
              src={item.thumbnails[4].url} // Default thumb
              alt="History thumbnail"
              className="w-16 h-12 object-cover rounded bg-slate-100" 
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-700 truncate">{item.originalUrl}</p>
              <p className="text-xs text-slate-400">{new Date(item.timestamp).toLocaleDateString()}</p>
            </div>
            <ArrowRight size={16} className="text-slate-300 group-hover:text-brand-500 transform group-hover:translate-x-1 transition-all" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryList;