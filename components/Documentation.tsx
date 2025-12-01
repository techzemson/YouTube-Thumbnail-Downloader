import React from 'react';
import { X, BookOpen, CheckCircle2, Zap, BrainCircuit, Download, MousePointerClick, Image as ImageIcon, FileText } from 'lucide-react';

interface DocumentationProps {
  isOpen: boolean;
  onClose: () => void;
}

const Documentation: React.FC<DocumentationProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/80 backdrop-blur-xl rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="bg-brand-100 p-2.5 rounded-xl text-brand-600">
              <BookOpen size={24} strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800 leading-tight">Documentation</h2>
              <p className="text-sm text-slate-500 font-medium">User Guide & Features Overview</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-200/50 rounded-full transition-colors text-slate-400 hover:text-slate-700"
          >
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 md:p-8 space-y-12 custom-scrollbar">
          
          {/* Section 1: How to Use */}
          <section>
            <div className="flex items-center gap-3 mb-6">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold text-sm ring-4 ring-blue-50">1</span>
                <h3 className="text-xl font-bold text-slate-900">How to use this tool</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { 
                    icon: <MousePointerClick className="text-blue-500" />,
                    title: '1. Copy URL', 
                    desc: 'Navigate to YouTube and copy the full URL of the video you want to analyze.' 
                },
                { 
                    icon: <Zap className="text-yellow-500" />,
                    title: '2. Paste & Analyze', 
                    desc: 'Paste the link in the large search bar above and click "Get Thumbnails".' 
                },
                { 
                    icon: <Download className="text-green-500" />,
                    title: '3. Download', 
                    desc: 'Select your preferred resolution (HD/4K) and format (JPG/PNG/WebP) to save.' 
                }
              ].map((step, i) => (
                <div key={i} className="bg-slate-50 p-6 rounded-2xl border border-slate-100 hover:shadow-md transition-shadow relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                      {React.cloneElement(step.icon as React.ReactElement, { size: 64 })}
                  </div>
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-4 border border-slate-100">
                     {step.icon}
                  </div>
                  <h4 className="font-bold text-slate-800 text-lg mb-2">{step.title}</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 2: Features */}
          <section>
            <div className="flex items-center gap-3 mb-6">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-600 font-bold text-sm ring-4 ring-purple-50">2</span>
                <h3 className="text-xl font-bold text-slate-900">Powerful Features</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                <div className="shrink-0 mt-1 bg-purple-100 w-10 h-10 rounded-lg flex items-center justify-center text-purple-600">
                    <BrainCircuit size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">AI Visual Intelligence</h4>
                  <p className="text-slate-600 text-sm mt-1 leading-relaxed">
                    Powered by Gemini 2.5, our tool assigns a "Click-Through Rate" potential score (0-100) to your thumbnail. It performs a SWOT analysis to identify strengths and weaknesses.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                 <div className="shrink-0 mt-1 bg-orange-100 w-10 h-10 rounded-lg flex items-center justify-center text-orange-600">
                    <ImageIcon size={20} />
                </div>
                 <div>
                    <h4 className="font-bold text-slate-800">Smart Format Conversion</h4>
                    <p className="text-slate-600 text-sm mt-1 leading-relaxed">
                      Don't get stuck with default JPGs. We process the image in your browser to offer high-quality PNG and WebP conversions instantly.
                    </p>
                 </div>
              </div>

               <div className="flex gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                 <div className="shrink-0 mt-1 bg-pink-100 w-10 h-10 rounded-lg flex items-center justify-center text-pink-600">
                    <FileText size={20} />
                </div>
                 <div>
                    <h4 className="font-bold text-slate-800">Social Metadata Generator</h4>
                    <p className="text-slate-600 text-sm mt-1 leading-relaxed">
                      Save time on distribution. The AI automatically writes engaging captions, generates viral hashtags, and detects the emotional "vibe" of your image.
                    </p>
                 </div>
              </div>

              <div className="flex gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                 <div className="shrink-0 mt-1 bg-blue-100 w-10 h-10 rounded-lg flex items-center justify-center text-blue-600">
                    <Download size={20} />
                </div>
                 <div>
                    <h4 className="font-bold text-slate-800">Privacy First</h4>
                    <p className="text-slate-600 text-sm mt-1 leading-relaxed">
                      All conversions happen in your browser. We don't store your images on our servers. Secure, fast, and free.
                    </p>
                 </div>
              </div>
            </div>
          </section>

          {/* Section 3: Benefits */}
          <section className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-8 text-white shadow-xl shadow-indigo-200">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <CheckCircle2 className="text-green-300" />
                Why use YouTube Thumbnail Downloader?
            </h3>
            <p className="text-indigo-100 mb-6 max-w-2xl leading-relaxed">
                Whether you are a creator looking to recover lost assets, a marketer analyzing competitors, or a designer looking for inspiration, this tool provides professional-grade insights and assets in seconds.
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8 text-sm font-medium">
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-green-400 rounded-full shadow-[0_0_8px_rgba(74,222,128,0.8)]"/>Improve your YouTube SEO ranking</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-green-400 rounded-full shadow-[0_0_8px_rgba(74,222,128,0.8)]"/>Analyze successful competitor strategies</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-green-400 rounded-full shadow-[0_0_8px_rgba(74,222,128,0.8)]"/>Get high-res assets for moodboards</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-green-400 rounded-full shadow-[0_0_8px_rgba(74,222,128,0.8)]"/>Generate content for Instagram/LinkedIn</li>
            </ul>
          </section>

        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex justify-end">
            <button 
                onClick={onClose}
                className="px-6 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors font-semibold text-sm shadow-lg shadow-slate-200"
            >
                Start Using Tool
            </button>
        </div>
      </div>
    </div>
  );
};

export default Documentation;