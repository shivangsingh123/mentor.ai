import React, { useState, useEffect } from 'react';
import HeaderNav from './components/HeaderNav';
import ParticlesBackground from './components/ParticlesBackground';
import AdvisorPanel from './components/AdvisorPanel';
import { CODE_SNIPPETS } from './data/snippets';
import { MentorAnalysis } from './types';
import Editor from '@monaco-editor/react';
import { Sparkles, RefreshCw, Layers, Terminal, BookOpen, AlertCircle } from 'lucide-react';

export default function App() {
  const [editorValue, setEditorValue] = useState<string>(`// Write, paste, or select code snippets above...
function calculateSquare(num) {
  // Felix: Try dropping a memory leak or injection to analyze!
  return num * num;
}`);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('javascript');
  const [customApiKey, setCustomApiKey] = useState<string>('');
  const [analysis, setAnalysis] = useState<MentorAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [charCount, setCharCount] = useState<number>(0);
  const [lineCount, setLineCount] = useState<number>(1);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load preferences from localStorage on mount
  useEffect(() => {
    const savedKey = localStorage.getItem('mentor_custom_api_key');
    if (savedKey) setCustomApiKey(savedKey);

    const savedCode = localStorage.getItem('mentor_saved_code');
    const savedLang = localStorage.getItem('mentor_saved_lang');
    if (savedCode) setEditorValue(savedCode);
    if (savedLang) setSelectedLanguage(savedLang);
  }, []);

  // Sync statistics on code value edits
  useEffect(() => {
    setCharCount(editorValue.length);
    setLineCount(editorValue.split('\n').length);
    localStorage.setItem('mentor_saved_code', editorValue);
  }, [editorValue]);

  // Sync language selection changes
  const handleLanguageChange = (lang: string) => {
    setSelectedLanguage(lang);
    localStorage.setItem('mentor_saved_lang', lang);
  };

  // Sync custom key settings update
  const handleKeyChange = (key: string) => {
    setCustomApiKey(key);
    localStorage.setItem('mentor_custom_api_key', key);
  };

  // Apply a premade sub-optimal demo snippet to the workspace
  const handleApplySnippet = (snippetCode: string, lang: string) => {
    setEditorValue(snippetCode);
    setSelectedLanguage(lang);
    setErrorMessage(null);
  };

  // Trigger server-side proxy code reviews
  const handleAnalyzeCode = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          code: editorValue,
          language: selectedLanguage,
          customApiKey
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Server error identified.');
      }

      setAnalysis(data);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Connecting to Felix crashed. Try again or check details.');
    } finally {
      setIsLoading(false);
    }
  };

  // Reset editor text space
  const handleResetWorkspace = () => {
    setEditorValue('');
    setErrorMessage(null);
  };

  // Copy code current editor copy status
  const handleCopyCode = () => {
    navigator.clipboard.writeText(editorValue);
    alert('Code copied to clipboard!');
  };

  return (
    <div className="relative min-h-screen bg-slate-950 font-sans text-slate-100 antialiased selection:bg-indigo-500/30 selection:text-white">
      {/* Dynamic neural link interactive particles background */}
      <ParticlesBackground />

      {/* Modern navigation section */}
      <HeaderNav customKey={customApiKey} onKeyChange={handleKeyChange} />

      {/* Main Container */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        
        {/* Modern reveal hero headers */}
        <header className="relative flex flex-col items-center text-center space-y-4 max-w-2xl mx-auto py-2">
          <div className="inline-flex items-center space-x-2 rounded-full border border-indigo-500/10 bg-indigo-500/5 px-3.5 py-1 text-xs font-semibold tracking-wide text-indigo-400">
            <Sparkles className="h-3.5 w-3.5 animate-spin-slow text-indigo-400" />
            <span>Interactive Dynamic Code Review Platform</span>
          </div>
          <h1 className="font-sans text-4xl font-extrabold tracking-tight text-white sm:text-5.5xl">
            Upgrade Your Logic With{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text font-black text-transparent">
              AI Code Mentor
            </span>
          </h1>
          <p className="text-sm font-medium text-slate-400 leading-relaxed">
            Eliminate complex performance costs, uncover thread deadlocks, audit security leakages, and improve candidate readiness values in real-time.
          </p>
        </header>

        {/* Dashboard Panels layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main workspace (Monaco editor pane) */}
          <div className="lg:col-span-12 xl:col-span-7 flex flex-col rounded-3xl border border-white/10 bg-black/40 backdrop-blur-2xl shadow-2xl overflow-hidden min-h-[660px]">
            
            {/* Top Workspace controls tools */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 bg-white/5 px-5 py-3.5">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1.5 font-mono text-[11px] font-semibold text-slate-400 tracking-wider uppercase">
                  <Terminal className="h-3.5 w-3.5 text-indigo-400" />
                  <span>main.{selectedLanguage === 'python' ? 'py' : selectedLanguage === 'rust' ? 'rs' : selectedLanguage === 'go' ? 'go' : 'js'}</span>
                </div>
                <span className="h-4 w-[1px] bg-white/10" />
                
                {/* Custom language picker */}
                <select
                  value={selectedLanguage}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-slate-300 outline-none cursor-pointer hover:text-white transition"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                  <option value="go">Go</option>
                  <option value="rust">Rust</option>
                </select>
              </div>

              {/* Demo Pre-load Quick Selector */}
              <div className="flex items-center space-x-2">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider hidden sm:inline">Demos:</span>
                <div className="flex space-x-1">
                  {CODE_SNIPPETS.map((snippet) => (
                    <button
                      key={snippet.id}
                      type="button"
                      onClick={() => handleApplySnippet(snippet.code, snippet.language)}
                      title={snippet.description}
                      className="rounded bg-white/5 border border-white/10 px-2.5 py-1 text-[10px] font-medium text-slate-300 hover:bg-indigo-600/20 hover:border-indigo-500/30 hover:text-indigo-400 transition cursor-pointer"
                    >
                      {snippet.name.split(':')[0]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Injected Monaco Editor Component workspace */}
            <div className="flex-1 min-h-[460px] bg-black/25 p-1 relative border-b border-white/5">
              <Editor
                height="460px"
                theme="vs-dark"
                language={selectedLanguage}
                value={editorValue}
                onChange={(val) => setEditorValue(val || '')}
                options={{
                  fontFamily: 'JetBrains Mono',
                  fontSize: 13.5,
                  minimap: { enabled: false },
                  automaticLayout: true,
                  lineHeight: 20,
                  scrollBeyondLastLine: false,
                  wordWrap: 'on',
                  padding: { top: 15 },
                  cursorBlinking: 'smooth',
                  cursorSmoothCaretAnimation: 'on',
                  smoothScrolling: true,
                  roundedSelection: true,
                  border: 'none'
                }}
              />
            </div>

            {/* Bottom editor info bar and main triggers */}
            <div className="flex items-center justify-between border-t border-white/5 bg-white/5 px-5 py-4">
              <div className="flex items-center space-x-4 text-xs font-mono text-slate-500 font-semibold">
                <span>Lines: {lineCount}</span>
                <span>Chars: {charCount}</span>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={handleResetWorkspace}
                  className="rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 active:scale-95 transition-all px-4 py-2.5 text-xs font-semibold text-slate-300 cursor-pointer"
                >
                  Reset Workspace
                </button>
                <button
                  type="button"
                  onClick={handleAnalyzeCode}
                  disabled={isLoading}
                  className={`flex items-center space-x-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold shadow-lg shadow-indigo-500/20 hover:scale-[1.03] active:scale-95 transition-all px-6 py-2.5 cursor-pointer ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin text-white" />
                      <span>Auditing Block...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 text-white" />
                      <span>Request Audit Review</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right workspace (AI Reviews results panel) */}
          <div className="lg:col-span-12 xl:col-span-5 flex flex-col space-y-6">
            
            {/* Display error notifications safely if API fails */}
            {errorMessage && (
              <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-rose-300 uppercase tracking-wide">Audit Execution Interrupted</h4>
                  <p className="mt-1 text-xs text-rose-200 leading-relaxed">{errorMessage}</p>
                </div>
              </div>
            )}

            {/* AI Advisor results wrapper */}
            <AdvisorPanel 
              analysis={analysis} 
              isLoading={isLoading} 
              onCopyOriginal={handleCopyCode} 
            />

            {/* Educational check-item summary */}
            <div className="rounded-3xl border border-white/10 bg-white/5 shadow-xl backdrop-blur-xl p-5 space-y-4">
              <div className="flex items-center space-x-2 text-indigo-400">
                <BookOpen className="h-4 w-4" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300">Curriculum Scope Index</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                The coding mentor uses advanced AST context checks configured directly for standard syntax structures across competitive coding and production pipelines. Write code to test or click any of our diagnostic templates in the heading triggers.
              </p>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 font-mono">
                <div className="flex items-center space-x-1.5 bg-black/20 p-2.5 rounded-xl border border-white/5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <span>Big-O Bounds</span>
                </div>
                <div className="flex items-center space-x-1.5 bg-black/20 p-2.5 rounded-xl border border-white/5">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                  <span>Buffer Auditing</span>
                </div>
                <div className="flex items-center space-x-1.5 bg-black/20 p-2.5 rounded-xl border border-white/5">
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
                  <span>Heap Allocators</span>
                </div>
                <div className="flex items-center space-x-1.5 bg-black/20 p-2.5 rounded-xl border border-white/5">
                  <span className="h-1.5 w-1.5 rounded-full bg-pink-400" />
                  <span>Thread Tracing</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Styled Footer */}
      <footer className="mt-20 border-t border-white/5 py-8 text-center text-[11px] font-semibold text-slate-500 uppercase tracking-widest bg-slate-950/45">
        <p>&copy; 2026 AI Coding Mentor Pro. Built for developers worldwide.</p>
      </footer>
    </div>
  );
}
