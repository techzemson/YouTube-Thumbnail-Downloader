import React, { useState, useEffect, useRef } from 'react';
import { Youtube, Search, AlertCircle, Link, ShieldCheck, Download, Zap, Sparkles } from 'lucide-react';
import { extractVideoId, generateThumbnails } from './services/youtubeService';
import { VideoData, AppState } from './types';
import ProgressBar from './components/ProgressBar';
import ThumbnailCard from './components/ThumbnailCard';
import HistoryList from './components/HistoryList';
import AIAnalyzer from './components/AIAnalyzer';

function App() {
  const [url, setUrl] = useState('');
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [progress, setProgress] = useState(0);
  const [currentVideo, setCurrentVideo] = useState<VideoData | null>(null);
  const [history, setHistory] = useState<VideoData[]>([]);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Progress Interval Ref
  const progressInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Load history from local storage
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
    const newHistory = [videoData, ...history.filter(h => h.id !== videoData.id)].slice(0, 9); // Keep last 9
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

    // Simulate analysis progress for UX
    let currentProgress = 0;
    if (progressInterval.current) clearInterval(progressInterval.current);

    progressInterval.current = setInterval(() => {
      currentProgress += Math.random() * 15;
      if (currentProgress > 90) {
         currentProgress = 90; // Wait for finalization
      }
      setProgress(currentProgress);
    }, 200);

    // Artificial delay to show the progress bar (feeling of "work" being done)
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
    }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startAnalysis(url);
  };

  const handleDownload = (imageUrl: string, filename: string) => {
    // Basic download handler creating a link element
    // Note: For cross-origin images, this might open in a new tab instead of force downloading
    // unless proxying is used. We use target="_blank" fallback in component if needed, 
    // but here we try the blob method.
    
    fetch(imageUrl)
      .then(response => response.blob())
      .then(blob => {
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      })
      .catch(() => {
        // Fallback: just open in new tab
        window.open(imageUrl, '_blank');
      });
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => {setAppState(AppState.IDLE); setUrl('');}}>
            <div className="bg-brand-600 p-2 rounded-lg text-white">
              <Youtube size={24} fill="currentColor" strokeWidth={0} />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-700 to-brand-500">
              TubeThumb Pro
            </span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a href="#" className="hover:text-brand-600 transition-colors">Features</a>
            <a href="#" className="hover:text-brand-600 transition-colors">How to Use</a>
            <button className="bg-slate-900 text-white px-4 py-2 rounded-full hover:bg-slate-800 transition-colors">
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-start py-12 px-4 sm:px-6 relative overflow-hidden">
        
        {/* Background decorative elements */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

        {/* Hero Section */}
        <div className="relative z-10 w-full max-w-3xl text-center mb-10">
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-4">
            Download <span className="text-brand-600">HD Thumbnails</span>
            <br /> from YouTube Instantly.
          </h1>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
            Extract high-quality images from any YouTube video in seconds. 
            Analyze visuals with AI to maximize your click-through rates.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSubmit} className="relative w-full max-w-2xl mx-auto">
            <div className="relative flex items-center">
              <div className="absolute left-4 text-slate-400 pointer-events-none">
                <Link size={20} />
              </div>
              <input
                type="text"
                placeholder="Paste YouTube Video URL here..."
                className="w-full pl-12 pr-36 py-4 rounded-2xl border-2 border-slate-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-100 outline-none transition-all shadow-xl shadow-slate-200/50 text-lg"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-2 top-2 bottom-2 bg-brand-600 hover:bg-brand-700 text-white font-bold px-6 rounded-xl transition-all active:scale-95 flex items-center gap-2"
                disabled={appState === AppState.ANALYZING}
              >
                {appState === AppState.ANALYZING ? (
                    <span className="flex items-center gap-2">
                        <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                        Working
                    </span>
                ) : (
                    <>
                        <Search size={20} />
                        <span className="hidden sm:inline">Get Thumbnail</span>
                    </>
                )}
              </button>
            </div>
            {errorMsg && (
              <div className="absolute -bottom-8 left-0 right-0 flex items-center justify-center text-red-500 text-sm font-medium animate-bounce">
                <AlertCircle size={16} className="mr-1" />
                {errorMsg}
              </div>
            )}
          </form>
        </div>

        {/* Progress State */}
        {appState === AppState.ANALYZING && (
          <ProgressBar progress={progress} />
        )}

        {/* Results State */}
        {appState === AppState.READY && currentVideo && (
          <div className="w-full max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
            
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Results Found</h2>
                <div className="flex gap-2 text-sm">
                   <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium flex items-center gap-1">
                     <ShieldCheck size={14} /> Safe to download
                   </span>
                </div>
            </div>

            {/* Grid for Thumbnails */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
               {/* Main (Max Res) Card takes larger space on mobile or first slot */}
               <div className="lg:col-span-2 row-span-2">
                  <ThumbnailCard 
                    variant={currentVideo.thumbnails[0]} 
                    onDownload={handleDownload} 
                  />
               </div>
               
               {/* Other variants */}
               <div className="grid grid-cols-1 gap-6 h-full">
                  <ThumbnailCard variant={currentVideo.thumbnails[1]} onDownload={handleDownload} />
                  <ThumbnailCard variant={currentVideo.thumbnails[2]} onDownload={handleDownload} />
               </div>
            </div>

            {/* AI Analysis Section */}
            <AIAnalyzer bestThumbnail={currentVideo.thumbnails[0]} />

            {/* Additional Standard Qualities (Bottom Row) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
               {currentVideo.thumbnails.slice(3).map((thumb) => (
                   <div key={thumb.key} className="bg-white p-3 rounded-lg border border-slate-200 flex flex-col items-center text-center">
                       <p className="text-xs font-bold text-slate-500 mb-2">{thumb.label}</p>
                       <img src={thumb.url} alt={thumb.label} className="w-full rounded mb-2 opacity-80" />
                       <button 
                         onClick={() => handleDownload(thumb.url, `thumb-${thumb.key}.jpg`)}
                         className="text-xs text-brand-600 hover:underline flex items-center gap-1"
                       >
                           <Download size={12} /> Download
                       </button>
                   </div>
               ))}
            </div>
          </div>
        )}

        {/* History Section */}
        {appState !== AppState.ANALYZING && (
          <HistoryList 
            history={history} 
            onSelect={(histUrl) => { setUrl(histUrl); startAnalysis(histUrl); }}
            onClear={clearHistory}
          />
        )}

        {/* Features Grid (SEO/Info) */}
        {appState === AppState.IDLE && (
           <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
              <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-shadow">
                 <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-4">
                    <Zap size={24} />
                 </div>
                 <h3 className="text-xl font-bold text-slate-800 mb-2">Lightning Fast</h3>
                 <p className="text-slate-600">Extracts thumbnails instantly using advanced parsing logic without page reloads.</p>
              </div>
              <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-shadow">
                 <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-4">
                    <Sparkles size={24} />
                 </div>
                 <h3 className="text-xl font-bold text-slate-800 mb-2">AI Powered</h3>
                 <p className="text-slate-600">Get insights on your thumbnail's emotional impact and readability using Gemini AI.</p>
              </div>
              <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-shadow">
                 <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mb-4">
                    <Download size={24} />
                 </div>
                 <h3 className="text-xl font-bold text-slate-800 mb-2">4K Downloads</h3>
                 <p className="text-slate-600">Access the maximum resolution image stored on YouTube servers (where available).</p>
              </div>
           </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between text-slate-500 text-sm">
          <p>&copy; {new Date().getFullYear()} TubeThumb Pro. Free Tool.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
             <a href="#" className="hover:text-brand-600">Privacy Policy</a>
             <a href="#" className="hover:text-brand-600">Terms of Service</a>
             <a href="#" className="hover:text-brand-600">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;