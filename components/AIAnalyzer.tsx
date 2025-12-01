import React, { useState } from 'react';
import { Sparkles, BrainCircuit, CheckCircle, AlertTriangle, Lightbulb } from 'lucide-react';
import { ThumbnailVariant, AIAnalysisResult } from '../types';
import { convertImageToBase64 } from '../services/youtubeService';
import { analyzeThumbnail } from '../services/geminiService';

interface AIAnalyzerProps {
  bestThumbnail: ThumbnailVariant;
}

const AIAnalyzer: React.FC<AIAnalyzerProps> = ({ bestThumbnail }) => {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    try {
      const base64 = await convertImageToBase64(bestThumbnail.url);
      const result = await analyzeThumbnail(base64);
      setAnalysis(result);
    } catch (err) {
        if(err instanceof Error) {
             setError(err.message);
        } else {
             setError("An unexpected error occurred during AI analysis.");
        }
    } finally {
      setLoading(false);
    }
  };

  if (!process.env.API_KEY) {
      return null; // Don't show AI section if no key
  }

  return (
    <div className="mt-8 bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl p-6 md:p-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-indigo-200 rounded-full opacity-50 blur-xl"></div>
      
      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-xl font-bold text-indigo-900 flex items-center gap-2">
              <Sparkles className="text-indigo-500" />
              AI Thumbnail Auditor
            </h3>
            <p className="text-indigo-600/80 text-sm mt-1">
              Use Gemini AI to score your thumbnail and get actionable advice to boost CTR.
            </p>
          </div>
          
          {!analysis && !loading && (
            <button
              onClick={handleAnalyze}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all active:scale-95 flex items-center gap-2 whitespace-nowrap"
            >
              <BrainCircuit size={18} />
              Analyze with AI
            </button>
          )}
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
            <p className="text-indigo-800 font-medium animate-pulse">Gemini is studying your thumbnail...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-100 text-sm flex items-center gap-2">
            <AlertTriangle size={16} />
            {error}
          </div>
        )}

        {analysis && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
            
            {/* Score Section */}
            <div className="flex items-center gap-6 bg-white/60 backdrop-blur rounded-xl p-4 border border-indigo-100">
              <div className="relative w-20 h-20 flex-shrink-0">
                 <svg className="w-full h-full transform -rotate-90">
                   <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-200" />
                   <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" 
                           strokeDasharray={36 * 2 * Math.PI} 
                           strokeDashoffset={36 * 2 * Math.PI - (analysis.score / 100) * 36 * 2 * Math.PI} 
                           className={`${analysis.score > 75 ? 'text-green-500' : analysis.score > 50 ? 'text-yellow-500' : 'text-red-500'} transition-all duration-1000`} />
                 </svg>
                 <span className="absolute inset-0 flex items-center justify-center font-black text-xl text-slate-800">
                   {analysis.score}
                 </span>
              </div>
              <div>
                <h4 className="font-bold text-slate-900">Thumbnail Score</h4>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">{analysis.summary}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Strengths */}
              <div className="bg-green-50/50 border border-green-100 rounded-xl p-5">
                 <h5 className="font-bold text-green-800 flex items-center gap-2 mb-3">
                   <CheckCircle size={16} /> Strengths
                 </h5>
                 <ul className="space-y-2">
                   {analysis.strengths.map((item, i) => (
                     <li key={i} className="text-sm text-green-900/80 flex items-start gap-2">
                       <span className="mt-1.5 w-1 h-1 bg-green-500 rounded-full shrink-0" />
                       {item}
                     </li>
                   ))}
                 </ul>
              </div>

              {/* Weaknesses */}
              <div className="bg-red-50/50 border border-red-100 rounded-xl p-5">
                 <h5 className="font-bold text-red-800 flex items-center gap-2 mb-3">
                   <AlertTriangle size={16} /> Weaknesses
                 </h5>
                 <ul className="space-y-2">
                   {analysis.weaknesses.map((item, i) => (
                     <li key={i} className="text-sm text-red-900/80 flex items-start gap-2">
                       <span className="mt-1.5 w-1 h-1 bg-red-500 rounded-full shrink-0" />
                       {item}
                     </li>
                   ))}
                 </ul>
              </div>

               {/* Suggestions */}
               <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-5">
                 <h5 className="font-bold text-blue-800 flex items-center gap-2 mb-3">
                   <Lightbulb size={16} /> Suggestions
                 </h5>
                 <ul className="space-y-2">
                   {analysis.suggestions.map((item, i) => (
                     <li key={i} className="text-sm text-blue-900/80 flex items-start gap-2">
                       <span className="mt-1.5 w-1 h-1 bg-blue-500 rounded-full shrink-0" />
                       {item}
                     </li>
                   ))}
                 </ul>
              </div>
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAnalyzer;