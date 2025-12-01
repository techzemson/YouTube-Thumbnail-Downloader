import React, { useState, useEffect, useRef } from 'react';
import { Youtube, Search, AlertCircle, Link, ShieldCheck, History as HistoryIcon, Zap, Check, BookOpen } from 'lucide-react';
import { extractVideoId, generateThumbnails, downloadImageAs } from './services/youtubeService';
import { VideoData, AppState } from './types';
import ProgressBar from './components/ProgressBar';
import ThumbnailCard from './components/ThumbnailCard';
import HistoryList from './components/HistoryList';
import AIAnalyzer from './components/AIAnalyzer';
import Documentation from './components/Documentation';

function App() {
  const [url, setUrl] = useState('');
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [progress, setProgress] = useState(0);
  const [currentVideo, setCurrentVideo] = useState<VideoData | null>(null);
  const [history, setHistory] = useState<VideoData[]>([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  
  const progressInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const savedHistory = localStorage.getItem('thumb_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history");
      }
    }
  }, []);

  const addToHistory = (videoData: VideoData) => {
    const newHistory = [videoData, ...history.filter(h => h.id !== videoData.id)].slice(0, 15);
    setHistory(newHistory);
    localStorage.setItem('thumb_history', JSON.stringify(newHistory));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('thumb_history');
  };

  const startAnalysis = (inputUrl: string) => {
    setErrorMsg('');
    const id = extractVideoId(inputUrl);

    if (!id) {
      setErrorMsg('Invalid YouTube URL. Please check and try again.');
      return;
    }

    setAppState(AppState.ANALYZING);
    setProgress(0);
    setCurrentVideo(null);

    let currentProgress = 0;
    if (progressInterval.current) clearInterval(progressInterval.current);

    progressInterval.current = setInterval(() => {
      currentProgress += Math.random() * 12;
      if (currentProgress > 95) currentProgress = 95;
      setProgress(currentProgress);
    }, 150);

    setTimeout(() => {
      if (progressInterval.current) clearInterval(progressInterval.current);
      setProgress(100);

      const thumbnails = generateThumbnails(id);
      const videoData: VideoData = {
        id,
        originalUrl: inputUrl,
        thumbnails,
        timestamp: Date.now()
      };

      setCurrentVideo(videoData);
      addToHistory(videoData);
      setAppState(AppState.READY);
    }, 1200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startAnalysis(url);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans selection:bg-brand-500 selection:text-white">
      
      {/* Documentation Modal */}
      <Documentation isOpen={isDocsOpen} onClose={() => setIsDocsOpen(false)} />

      {/* Drawer */}
      <HistoryList 
        history={history} 
        onSelect={(histUrl) => { setUrl(histUrl); startAnalysis(histUrl); }}
        onClear={clearHistory}
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
      />

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => {setAppState(AppState.IDLE); setUrl('');}}>
            <div className="bg-brand-600 p-2 rounded-xl text-white shadow-lg shadow-brand-200 group-hover:scale-105 transition-transform">
              <Youtube size={24} fill="currentColor" strokeWidth={0} />
            </div>
            <span className="text-xl font-bold text-slate-800 tracking-tight hidden sm:block">
              YouTube Thumbnail Downloader
            </span>
            <span className="text-xl font-bold text-slate-800 tracking-tight sm:hidden">
              TubeThumb
            </span>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3">
             <button 
                onClick={() => setIsDocsOpen(true)}
                className="flex items-center gap-2 px-3 py-2 text-slate-600 hover:text-brand-600 bg-white hover:bg-slate-50 rounded-xl transition-all font-semibold border border-transparent hover:border-slate-200"
                title="Documentation"
              >
                <BookOpen size={18} />
                <span className="hidden sm:inline">Documentation</span>
              </button>

              <button 
                onClick={() => setIsHistoryOpen(true)}
                className="flex items-center gap-2 px-3 py-2 text-slate-600 hover:text-brand-600 bg-slate-100 hover:bg-brand-50 rounded-xl transition-all relative font-semibold border border-transparent hover:border-brand-200"
                title="View History"
              >
                <HistoryIcon size={18} />
                <span className="hidden sm:inline">History</span>
                {history.length > 0 && <span className="absolute -top-1 -right-1 flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-brand-500"></span></span>}
              </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-start pt-16 pb-12 px-4 sm:px-6 relative overflow-hidden">
        
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-brand-500/5 rounded-full filter blur-[120px] -z-10 pointer-events-none"></div>

        {/* Hero Section */}
        <div className="w-full max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight mb-6 leading-tight">
            Download HD Thumbnails from <br className="hidden md:block"/>
            <span className="text-brand-600 relative inline-block">
                YouTube URL
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-brand-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" /></svg>
            </span> Instantly
          </h1>
          <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            The most advanced tool to grab 4K thumbnails, convert formats, and analyze visuals with AI.
          </p>

          {/* Massive Search Bar */}
          <form onSubmit={handleSubmit} className="relative w-full max-w-5xl mx-auto transform transition-all hover:-translate-y-1">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-brand-500 to-orange-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative flex items-center bg-white rounded-2xl shadow-2xl">
                <div className="absolute left-6 text-slate-400">
                  <Link size={24} />
                </div>
                <input
                  type="text"
                  placeholder="Paste YouTube Video URL here (e.g., https://www.youtube.com/watch?v=...)"
                  className="w-full pl-16 pr-44 h-20 rounded-2xl border-0 focus:ring-0 text-xl text-slate-800 placeholder:text-slate-300 font-medium"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute right-3 top-3 bottom-3 bg-brand-600 hover:bg-brand-700 text-white text-lg font-bold px-8 rounded-xl transition-all active:scale-95 flex items-center gap-2 shadow-lg shadow-brand-200"
                  disabled={appState === AppState.ANALYZING}
                >
                  {appState === AppState.ANALYZING ? (
                       <span className="animate-spin rounded-full h-6 w-6 border-4 border-white border-t-transparent"></span>
                  ) : (
                      <>
                        <Search size={22} />
                        <span className="hidden sm:inline">Get Thumbnails</span>
                      </>
                  )}
                </button>
              </div>
            </div>
            {errorMsg && (
              <div className="mt-4 flex items-center justify-center text-red-500 font-semibold bg-red-50 py-2 px-4 rounded-full inline-flex mx-auto border border-red-100">
                <AlertCircle size={18} className="mr-2" />
                {errorMsg}
              </div>
            )}
          </form>
        </div>

        {/* Progress */}
        {appState === AppState.ANALYZING && (
          <ProgressBar progress={progress} />
        )}

        {/* Results */}
        {appState === AppState.READY && currentVideo && (
          <div className="w-full max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-12">
            
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                   <h2 className="text-3xl font-bold text-slate-900">Ready to Download</h2>
                   <p className="text-slate-500 mt-1">Found 5 variants for this video.</p>
                </div>
                <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 border border-green-200">
                     <ShieldCheck size={16} /> Secure Client-Side Download
                </span>
            </div>

            {/* Thumbnails Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {/* Max Res Card */}
               <ThumbnailCard 
                 variant={currentVideo.thumbnails[0]} 
                 onDownload={downloadImageAs} 
               />
               
               {/* Standard & High */}
               <ThumbnailCard variant={currentVideo.thumbnails[1]} onDownload={downloadImageAs} />
               <ThumbnailCard variant={currentVideo.thumbnails[2]} onDownload={downloadImageAs} />
            </div>

            {/* AI Section */}
            <AIAnalyzer bestThumbnail={currentVideo.thumbnails[0]} />

            {/* Remaining Formats */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8">
                <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <Zap className="text-yellow-500" /> More Sizes & Formats
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {currentVideo.thumbnails.slice(3).map((thumb) => (
                        <div key={thumb.key} className="group bg-slate-50 hover:bg-white p-4 rounded-xl border border-slate-100 hover:border-brand-200 hover:shadow-lg transition-all text-center">
                            <div className="relative mb-3 rounded-lg overflow-hidden aspect-video">
                                <img src={thumb.url} alt={thumb.label} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <p className="font-bold text-slate-700 text-sm mb-1">{thumb.label}</p>
                            <p className="text-xs text-slate-400 mb-3">{thumb.resolution}</p>
                            <button 
                                onClick={() => downloadImageAs(thumb.url, `thumb-${thumb.key}.jpg`)}
                                className="w-full py-2 bg-white border border-slate-200 text-slate-600 hover:text-brand-600 hover:border-brand-200 rounded-lg text-xs font-bold transition-colors"
                            >
                                Download JPG
                            </button>
                        </div>
                    ))}
                </div>
            </div>

          </div>
        )}

      </main>

      {/* Simplified Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-2 mb-4 opacity-50 grayscale">
              <Youtube size={20} />
              <span className="font-bold">YouTube Thumbnail Downloader</span>
          </div>
          <p className="text-slate-400 text-sm">
             Built for creators. Not affiliated with YouTube.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;