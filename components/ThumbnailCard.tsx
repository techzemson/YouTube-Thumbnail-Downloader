import React, { useState } from 'react';
import { Download, ExternalLink, Image as ImageIcon, Check } from 'lucide-react';
import { ThumbnailVariant } from '../types';

interface ThumbnailCardProps {
  variant: ThumbnailVariant;
  onDownload: (url: string, filename: string, format: 'jpg' | 'png' | 'webp') => void;
}

const ThumbnailCard: React.FC<ThumbnailCardProps> = ({ variant, onDownload }) => {
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleDownload = (format: 'jpg' | 'png' | 'webp') => {
    setDownloading(format);
    const filename = `thumbnail-${variant.key}.${format}`;
    onDownload(variant.url, filename, format);
    setTimeout(() => setDownloading(null), 1500);
  };

  return (
    <div 
      className={`group relative bg-white border rounded-2xl overflow-hidden transition-all duration-300 flex flex-col ${variant.isBest ? 'border-brand-500 shadow-xl ring-2 ring-brand-100 col-span-1 md:col-span-2 lg:col-span-2' : 'border-slate-200 shadow-sm hover:shadow-md'}`}
    >
      {variant.isBest && (
        <div className="absolute top-0 left-0 bg-brand-600 text-white text-xs font-bold px-4 py-1.5 rounded-br-xl z-10 shadow-md">
          RECOMMENDED
        </div>
      )}

      {/* Image Area */}
      <div className={`w-full relative bg-slate-100 overflow-hidden ${variant.isBest ? 'aspect-video' : 'aspect-video'}`}>
        <img 
          src={variant.url} 
          alt={variant.label} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4">
           <a 
            href={variant.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-white hover:text-brand-400 text-sm font-medium flex items-center gap-1"
           >
             <ExternalLink size={16} /> Open in Tab
           </a>
           <span className="text-white/80 text-xs font-mono">{variant.resolution}</span>
        </div>
      </div>

      {/* Details & Actions */}
      <div className="p-5 flex flex-col gap-4 flex-grow">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-800 text-lg">{variant.label}</h3>
          <div className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-mono border border-slate-200">
            {variant.key.toUpperCase()}
          </div>
        </div>

        <div className="mt-auto grid grid-cols-3 gap-2">
            {/* JPG Button */}
            <button 
                onClick={() => handleDownload('jpg')}
                className="flex items-center justify-center gap-1 py-2 px-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold transition-all active:scale-95"
            >
                {downloading === 'jpg' ? <Check size={14} /> : <Download size={14} />}
                JPG
            </button>

            {/* PNG Button */}
            <button 
                onClick={() => handleDownload('png')}
                className="flex items-center justify-center gap-1 py-2 px-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 text-xs font-bold transition-all active:scale-95"
            >
                {downloading === 'png' ? <Check size={14} /> : <Download size={14} />}
                PNG
            </button>

             {/* WebP Button */}
             <button 
                onClick={() => handleDownload('webp')}
                className="flex items-center justify-center gap-1 py-2 px-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 text-xs font-bold transition-all active:scale-95"
            >
                {downloading === 'webp' ? <Check size={14} /> : <Download size={14} />}
                WebP
            </button>
        </div>
      </div>
    </div>
  );
};

export default ThumbnailCard;