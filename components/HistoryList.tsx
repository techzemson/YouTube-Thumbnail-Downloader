import React from 'react';
import { VideoData } from '../types';
import { Clock, ArrowRight, X, Trash2 } from 'lucide-react';

interface HistoryListProps {
  history: VideoData[];
  onSelect: (url: string) => void;
  onClear: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const HistoryList: React.FC<HistoryListProps> = ({ history, onSelect, onClear, isOpen, onClose }) => {
  return (
    <div className={`fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-2xl transform transition-transform duration-300 z-[100] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      
      <div className="h-full flex flex-col">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-brand-50">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Clock size={24} className="text-brand-600" />
              History
            </h3>
            <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                <X size={20} className="text-slate-500" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {history.length === 0 ? (
                <div className="text-center text-slate-400 mt-10">
                    <Clock size={48} className="mx-auto mb-4 opacity-20" />
                    <p>No recent downloads.</p>
                </div>
            ) : (
                history.map((item) => (
                <div 
                    key={`${item.id}-${item.timestamp}`} 
                    onClick={() => { onSelect(item.originalUrl); onClose(); }}
                    className="group flex gap-3 p-3 bg-white border border-slate-100 rounded-xl hover:border-brand-300 hover:shadow-md cursor-pointer transition-all"
                >
                    <img 
                    src={item.thumbnails[4].url} 
                    alt="thumb"
                    className="w-24 h-16 object-cover rounded-lg bg-slate-100" 
                    />
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <p className="text-sm font-semibold text-slate-700 truncate">{item.id}</p>
                    <p className="text-xs text-slate-400">{new Date(item.timestamp).toLocaleDateString()} • {new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                    </div>
                    <ArrowRight size={16} className="self-center text-slate-300 group-hover:text-brand-500" />
                </div>
                ))
            )}
          </div>

          {history.length > 0 && (
             <div className="p-4 border-t border-slate-100">
                 <button 
                  onClick={onClear}
                  className="w-full py-3 flex items-center justify-center gap-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium text-sm"
                 >
                     <Trash2 size={16} /> Clear All History
                 </button>
             </div>
          )}
      </div>
      
      {/* Backdrop */}
      {isOpen && (
         <div className="fixed inset-0 bg-black/20 -z-10" onClick={onClose}></div>
      )}
    </div>
  );
};

export default HistoryList;