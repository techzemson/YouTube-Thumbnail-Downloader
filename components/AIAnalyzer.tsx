import React, { useState } from 'react';
import { Sparkles, BrainCircuit, CheckCircle, AlertTriangle, Lightbulb, Hash, MessageCircle, Palette, Activity, Copy } from 'lucide-react';
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
  const [copied, setCopied] = useState(false);

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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!process.env.API_KEY) return null;

  return (
    <div className="mt-12 bg-white rounded-3xl shadow-xl shadow-indigo-100/50 border border-indigo-50 overflow-hidden">
      
      {/* Header Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-6 md:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold flex items-center gap-3">
              <Sparkles className="text-yellow-300" fill="currentColor" />
              AI Thumbnail Intelligence
            </h3>
            <p className="text-indigo-100 mt-2 max-w-xl">
              Unlock the secrets of your thumbnail. Get a predictive performance score, generated tags, social captions, and expert design advice.
            </p>
          </div>
          
          {!analysis && !loading && (
            <button
              onClick={handleAnalyze}
              className="bg-white text-indigo-600 hover:bg-indigo-50 px-8 py-4 rounded-xl font-bold shadow-lg transition-all active:scale-95 flex items-center gap-2 whitespace-nowrap text-lg"
            >
              <BrainCircuit size={24} />
              Analyze Now
            </button>
          )}
      </div>

      <div className="p-6 md:p-8">
        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-6"></div>
            <p className="text-lg text-indigo-900 font-medium animate-pulse">Gemini 2.5 is analyzing pixels...</p>
            <p className="text-sm text-slate-500 mt-2">Extracting colors, sentiment, and SEO tags.</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-700 p-6 rounded-xl border border-red-100 text-center">
            <AlertTriangle size={32} className="mx-auto mb-2" />
            <p className="font-bold">{error}</p>
          </div>
        )}

        {analysis && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-8">
            
            {/* Top Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Score Card */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                     <div className="relative w-24 h-24 mb-3">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 96 96">
                            <circle cx="48" cy="48" r="40" stroke="#e2e8f0" strokeWidth="8" fill="transparent" />
                            <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" 
                                    strokeDasharray={40 * 2 * Math.PI} 
                                    strokeDashoffset={40 * 2 * Math.PI - (analysis.score / 100) * 40 * 2 * Math.PI} 
                                    className={`${analysis.score > 75 ? 'text-green-500' : analysis.score > 50 ? 'text-yellow-500' : 'text-red-500'} transition-all duration-1000`} />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center font-black text-2xl text-slate-800">
                        {analysis.score}
                        </span>
                     </div>
                     <span className="text-sm font-bold text-slate-500 uppercase tracking-wide">AI CTR Score</span>
                </div>

                {/* Sentiment */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 flex flex-col justify-between">
                    <div className="flex items-center gap-2 text-indigo-600 mb-2">
                        <Activity size={20} />
                        <span className="font-bold">Vibe & Sentiment</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-800 capitalize">{analysis.sentiment}</p>
                    <p className="text-xs text-slate-500 mt-2">Detected emotional tone</p>
                </div>

                {/* Colors */}
                <div className="md:col-span-2 bg-slate-50 border border-slate-100 rounded-2xl p-6 flex flex-col justify-between">
                     <div className="flex items-center gap-2 text-indigo-600 mb-4">
                        <Palette size={20} />
                        <span className="font-bold">Dominant Palette</span>
                    </div>
                    <div className="flex gap-3">
                        {analysis.dominantColors.map((color, i) => (
                            <div key={i} className="flex-1 h-12 rounded-lg shadow-sm flex items-end justify-center pb-1 group cursor-pointer relative" style={{ backgroundColor: color }} title={color}>
                                <span className="bg-black/50 text-white text-[10px] px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity absolute top-[-25px] whitespace-nowrap z-10">{color}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Generated Content Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Caption Generator */}
                <div className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold text-indigo-900 flex items-center gap-2">
                            <MessageCircle size={18} /> Social Caption
                        </h4>
                        <button onClick={() => copyToClipboard(analysis.caption)} className="text-xs flex items-center gap-1 text-indigo-600 hover:text-indigo-800">
                             {copied ? <CheckCircle size={14}/> : <Copy size={14}/>} {copied ? 'Copied' : 'Copy'}
                        </button>
                    </div>
                    <p className="text-slate-700 text-sm italic leading-relaxed bg-white p-4 rounded-xl border border-indigo-100 shadow-sm">
                        "{analysis.caption}"
                    </p>
                </div>

                {/* Hashtag Generator */}
                <div className="bg-gradient-to-br from-pink-50 to-white border border-pink-100 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold text-pink-900 flex items-center gap-2">
                            <Hash size={18} /> Viral Tags
                        </h4>
                        <button onClick={() => copyToClipboard(analysis.hashtags.join(' '))} className="text-xs flex items-center gap-1 text-pink-600 hover:text-pink-800">
                             {copied ? <CheckCircle size={14}/> : <Copy size={14}/>} {copied ? 'Copied' : 'Copy'}
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {analysis.hashtags.map((tag, i) => (
                            <span key={i} className="bg-white text-pink-600 px-3 py-1 rounded-full text-sm font-medium border border-pink-100 shadow-sm">
                                #{tag.replace('#', '')}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Detailed Analysis (SWOT) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-green-50 rounded-xl p-5 border border-green-100">
                 <h5 className="font-bold text-green-800 flex items-center gap-2 mb-3">
                   <CheckCircle size={16} /> Strengths
                 </h5>
                 <ul className="space-y-2 text-sm text-green-900/80">
                   {analysis.strengths.map((item, i) => <li key={i} className="flex gap-2"><span className="mt-1.5 w-1.5 h-1.5 bg-green-500 rounded-full shrink-0"/>{item}</li>)}
                 </ul>
              </div>

              <div className="bg-red-50 rounded-xl p-5 border border-red-100">
                 <h5 className="font-bold text-red-800 flex items-center gap-2 mb-3">
                   <AlertTriangle size={16} /> Weaknesses
                 </h5>
                 <ul className="space-y-2 text-sm text-red-900/80">
                   {analysis.weaknesses.map((item, i) => <li key={i} className="flex gap-2"><span className="mt-1.5 w-1.5 h-1.5 bg-red-500 rounded-full shrink-0"/>{item}</li>)}
                 </ul>
              </div>

               <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
                 <h5 className="font-bold text-blue-800 flex items-center gap-2 mb-3">
                   <Lightbulb size={16} /> Suggestions
                 </h5>
                 <ul className="space-y-2 text-sm text-blue-900/80">
                   {analysis.suggestions.map((item, i) => <li key={i} className="flex gap-2"><span className="mt-1.5 w-1.5 h-1.5 bg-blue-500 rounded-full shrink-0"/>{item}</li>)}
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