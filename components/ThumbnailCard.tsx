import React, { useState } from 'react';
import { Download, ExternalLink, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { ThumbnailVariant } from '../types';

interface ThumbnailCardProps {
  variant: ThumbnailVariant;
  onDownload: (url: string, filename: string) => void;
}

const ThumbnailCard: React.FC<ThumbnailCardProps> = ({ variant, onDownload }) => {
  const [hasError, setHasError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleDownloadClick = () => {
    const filename = `thumbnail-${variant.key}.jpg`;
    onDownload(variant.url, filename);
  };

  if (hasError) {
    // Some videos don't have maxres, hide the card or show error state if strictly required.
    // We will render a fallback "Not Available" card.
    return (
      <div className="bg-slate-100 border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center h-full min-h-[200px] text-slate-400">
        <AlertCircle size={32} className="mb-2" />
        <p className="text-sm font-medium">{variant.label}</p>
        <p className="text-xs">Not available for this video</p>
      </div>
    );
  }

  return (
    <div 
      className={`group relative bg-white border rounded-xl overflow-hidden transition-all duration-300 ${variant.isBest ? 'border-brand-500 shadow-lg ring-1 ring-brand-100' : 'border-slate-200 shadow-sm hover:shadow-md'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {variant.isBest && (
        <div className="absolute top-0 right-0 bg-brand-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg z-10">
          BEST QUALITY
        </div>
      )}

      {/* Image Container */}
      <div className="aspect-video w-full relative bg-slate-100 overflow-hidden">
        <img 
          src={variant.url} 
          alt={variant.label} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={() => setHasError(true)}
        />
        
        {/* Overlay Actions (Visible on hover or mobile tap) */}
        <div className={`absolute inset-0 bg-black/40 flex items-center justify-center gap-2 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
           <a 
            href={variant.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-2 bg-white/20 backdrop-blur-sm hover:bg-white text-white hover:text-brand-600 rounded-full transition-colors"
            title="Open in new tab"
           >
             <ExternalLink size={20} />
           </a>
        </div>
      </div>

      {/* Details Footer */}
      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-bold text-slate-800 text-sm md:text-base">{variant.label}</h3>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
              <ImageIcon size={12} />
              <span>{variant.resolution}</span>
            </div>
          </div>
        </div>

        <button 
          onClick={handleDownloadClick}
          className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-semibold text-sm transition-all active:scale-95 ${
            variant.isBest 
            ? 'bg-brand-600 hover:bg-brand-700 text-white shadow-brand-200 shadow-lg' 
            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
          }`}
        >
          <Download size={16} />
          Download Image
        </button>
      </div>
    </div>
  );
};

export default ThumbnailCard;