import React, { useState } from 'react';
import { 
  Copy, 
  Download, 
  Bug, 
  ShieldAlert, 
  Zap, 
  Compass, 
  ClipboardCheck, 
  Code2, 
  GraduationCap,
  Sparkles,
  ArrowRight,
  ChevronDown
} from 'lucide-react';
import { MentorAnalysis } from '../types';
import MetricCircle from './MetricCircle';
import Editor from '@monaco-editor/react';

interface AdvisorPanelProps {
  analysis: MentorAnalysis | null;
  isLoading: boolean;
  onCopyOriginal: () => void;
}

export default function AdvisorPanel({ analysis, isLoading, onCopyOriginal }: AdvisorPanelProps) {
  const [activeTab, setActiveTab] = useState<'insights' | 'refactored'>('insights');
  const [copiedText, setCopiedText] = useState(false);

  const handleCopy = () => {
    if (!analysis) return;
    const reportText = `
=== MENTOR.AI ANALYSIS REPORT ===
Quality Score: ${analysis.qualityScore}/10
Interview Readiness: ${analysis.interviewScore}/10
Difficulty Level: ${analysis.difficultyLevel}

[BUGS & ISSUES]
${analysis.bugs.map((b, i) => `${i + 1}. ${b}`).join('\n')}

[SECURITY CONCERNS]
${analysis.security.map((s, i) => `${i + 1}. ${s}`).join('\n')}

[PERFORMANCE & COMPLEXITY]
${analysis.performance}

[OPTIMIZATIONS]
${analysis.optimizations.map((o, i) => `${i + 1}. ${o}`).join('\n')}

[BEST PRACTICES]
${analysis.bestPractices.map((bp, i) => `${i + 1}. ${bp}`).join('\n')}

[LEARNING RESOURCES]
${analysis.learningResources.map((lr) => `- ${lr.title}: ${lr.url} (${lr.description})`).join('\n')}
    `;
    navigator.clipboard.writeText(reportText);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleDownload = () => {
    if (!analysis) return;
    const reportText = `=== MENTOR.AI ANALYSIS REPORT ===
Generated: ${new Date().toLocaleString()}
Quality Score: ${analysis.qualityScore}/10
Interview Readiness: ${analysis.interviewScore}/10
Difficulty Level: ${analysis.difficultyLevel}

=================================
1. BUGS & ISSUES
=================================
${analysis.bugs.map((b, i) => `${i + 1}. ${b}`).join('\n')}

=================================
2. SECURITY CONCERNS
=================================
${analysis.security.map((s, i) => `${i + 1}. ${s}`).join('\n')}

=================================
3. PERFORMANCE & COMPLEXITY
=================================
${analysis.performance}

=================================
4. OPTIMIZATIONS
=================================
${analysis.optimizations.map((o, i) => `${i + 1}. ${o}`).join('\n')}

=================================
5. BEST PRACTICES
=================================
${analysis.bestPractices.map((bp, i) => `${i + 1}. ${bp}`).join('\n')}

=================================
6. LEARNING RESOURCES & TOPICS
=================================
${analysis.learningResources.map((lr) => `- ${lr.title} (${lr.url})\n  ${lr.description}`).join('\n\n')}

=================================
7. REFACTORED CODE SUGGESTED
=================================
${analysis.refactoredCode || 'Not provided'}
`;

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `MentorAI-Report-${analysis.difficultyLevel}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="flex h-[600px] flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-2xl shadow-2xl">
        <div className="relative mb-6 flex h-20 w-20 items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-indigo-500/10 border-t-indigo-500 animate-spin" />
          <div className="absolute h-10 w-10 text-indigo-400 animate-pulse">
            <Sparkles className="h-10 w-10" />
          </div>
        </div>
        <h3 className="text-lg font-bold text-white">Deconstructing AST Trees</h3>
        <p className="mt-2.5 max-w-xs text-xs text-slate-400">
          Running static security checks and compiling algorithmic optimization graphs with your Senior Mentor...
        </p>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="flex h-[600px] flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-2xl shadow-2xl">
        <div className="relative mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-slate-400">
          <Code2 className="h-8 w-8 text-indigo-400" />
        </div>
        <h3 className="text-base font-bold text-white">Advisor Ready for Core Analysis</h3>
        <p className="mt-2 max-w-xs text-xs text-slate-400">
          Select an example snippet or drop your own backend logic into the Monaco workspace to trace vulnerabilities and optimization paths.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col rounded-3xl border border-white/10 bg-white/5 overflow-hidden backdrop-blur-2xl shadow-2xl">
      {/* Mentor Identity */}
      <div className="border-b border-white/10 bg-white/5 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="relative h-14 w-14 rounded-2xl overflow-hidden bg-indigo-950/50 border border-indigo-400/30">
            <div className="absolute inset-0 bg-indigo-500 blur-md opacity-30 animate-pulse" />
            <img 
              src="https://api.dicebear.com/7.x/bottts-neutral/svg?seed=Felix&backgroundColor=6366f1" 
              alt="Mentor AI Avatar" 
              className="relative z-10 h-full w-full object-cover" 
            />
          </div>
          <div>
            <h4 className="font-sans text-base font-bold text-white">Mentor Felix</h4>
            <div className="flex items-center space-x-1.5 mt-0.5">
              <span className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse" />
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Senior Staff Engineer • Security Specialist</p>
            </div>
          </div>
        </div>

        {/* Action Toggles */}
        <div className="flex items-center space-x-1 rounded-xl bg-black/30 p-1 border border-white/5 shrink-0 self-start sm:self-center">
          <button
            type="button"
            onClick={() => setActiveTab('insights')}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
              activeTab === 'insights'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow shadow-indigo-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Insights Core
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('refactored')}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
              activeTab === 'refactored'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow shadow-indigo-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Refactored Code
          </button>
        </div>
      </div>

      {activeTab === 'insights' ? (
        <div className="p-6 space-y-6 max-h-[660px] overflow-y-auto">
          {/* Top Score Dashboard */}
          <div className="grid grid-cols-3 gap-4 items-center bg-white/[0.01] border border-white/5 rounded-xl p-4">
            <MetricCircle value={analysis.qualityScore} max={10} label="Quality" />
            <MetricCircle value={analysis.interviewScore} max={10} label="Interview" />
            <div className="flex flex-col items-center justify-center h-full border-l border-white/5 pl-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Lvl Target</span>
              <span className={`mt-1 font-mono text-base font-bold px-2.5 py-1.5 rounded-lg border bg-slate-950 ${
                analysis.difficultyLevel === 'Advanced' ? 'border-purple-500/20 text-purple-400' :
                analysis.difficultyLevel === 'Intermediate' ? 'border-amber-500/20 text-amber-400' :
                'border-emerald-500/20 text-emerald-400'
              }`}>
                {analysis.difficultyLevel}
              </span>
            </div>
          </div>

          {/* Interactive accordion feedback blocks */}
          <div className="space-y-4">
            {/* Bugs Section */}
            <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-5">
              <h5 className="flex items-center text-rose-400 font-medium text-sm gap-2">
                <Bug className="h-4.5 w-4.5 text-rose-400" />
                <span>Bugs & Logical Explanations ({analysis.bugs.length})</span>
              </h5>
              {analysis.bugs.length === 0 ? (
                <p className="mt-2.5 text-xs text-rose-300 italic">No direct logic bugs detected. Exceptional clean run!</p>
              ) : (
                <ul className="mt-3 space-y-2 text-xs text-rose-200 pl-4 list-disc marker:text-rose-400">
                  {analysis.bugs.map((bug, index) => (
                    <li key={index} className="leading-relaxed">{bug}</li>
                  ))}
                </ul>
              )}
            </div>

            {/* Security Section */}
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-5">
              <h5 className="flex items-center text-amber-400 font-medium text-sm gap-2">
                <ShieldAlert className="h-4.5 w-4.5 text-amber-400" />
                <span>Security Threat Audits ({analysis.security.length})</span>
              </h5>
              {analysis.security.length === 0 ? (
                <p className="mt-2.5 text-xs text-amber-300 italic">No critical security exposures or leak paths tracked.</p>
              ) : (
                <ul className="mt-3 space-y-2 text-xs text-amber-200 pl-4 list-disc marker:text-amber-400">
                  {analysis.security.map((sec, index) => (
                    <li key={index} className="leading-relaxed">{sec}</li>
                  ))}
                </ul>
              )}
            </div>

            {/* Performance Section */}
            <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-5">
              <h5 className="flex items-center text-indigo-400 font-medium text-sm gap-2">
                <Zap className="h-4.5 w-4.5 text-indigo-400" />
                <span>Complexity & Resource Limits</span>
              </h5>
              <div className="mt-3 font-mono text-xs text-indigo-200 leading-relaxed bg-black/20 p-3.5 rounded-xl border border-white/5">
                {analysis.performance}
              </div>
            </div>

            {/* Optimization Recommendations */}
            <div className="rounded-2xl border border-purple-500/20 bg-purple-500/10 p-5">
              <h5 className="flex items-center text-purple-400 font-medium text-sm gap-2">
                <Compass className="h-4.5 w-4.5 text-purple-400" />
                <span>Structural Optimization Plans</span>
              </h5>
              <ul className="mt-3 space-y-2 text-xs text-purple-200 pl-4 list-disc marker:text-purple-400">
                {analysis.optimizations.map((opt, index) => (
                  <li key={index} className="leading-relaxed">{opt}</li>
                ))}
              </ul>
            </div>

            {/* Best Practices suggestions */}
            <div className="rounded-2xl border border-teal-500/20 bg-teal-500/10 p-5">
              <h5 className="flex items-center text-teal-400 font-medium text-sm gap-2">
                <Sparkles className="h-4.5 w-4.5 text-teal-400" />
                <span>Adherence to Best Practices</span>
              </h5>
              <ul className="mt-3 space-y-2 text-xs text-teal-200 pl-4 list-disc marker:text-teal-400">
                {analysis.bestPractices.map((bp, index) => (
                  <li key={index} className="leading-relaxed">{bp}</li>
                ))}
              </ul>
            </div>

            {/* Learning Resources */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h5 className="flex items-center text-indigo-300 font-medium text-sm gap-2">
                <GraduationCap className="h-4.5 w-4.5 text-indigo-300" />
                <span>Learning Curriculums & Resources</span>
              </h5>
              <div className="mt-3 space-y-2.5">
                {analysis.learningResources.map((resource, i) => (
                  <div key={i} className="flex flex-col bg-black/25 p-3 rounded-xl border border-white/5 hover:border-indigo-500/15 transition-all">
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-indigo-300 hover:text-indigo-200 hover:underline inline-flex items-center gap-1"
                    >
                      <span>{resource.title}</span>
                      <ArrowRight className="h-3 w-3" />
                    </a>
                    <p className="mt-1 text-[11px] text-slate-400 leading-relaxed">{resource.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action buttons footer */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-white/10 bg-white/5 p-6">
            <button
              type="button"
              onClick={handleCopy}
              className="w-full sm:flex-1 flex items-center justify-center space-x-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:scale-105 active:scale-95 transition-all py-3.5 text-xs text-slate-300 font-bold cursor-pointer"
            >
              {copiedText ? (
                <>
                  <ClipboardCheck className="h-4 w-4 text-emerald-400" />
                  <span>Report Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>Copy Plain Report</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="w-full sm:flex-1 flex items-center justify-center space-x-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:scale-105 active:scale-95 transition-all py-3.5 text-xs text-white font-bold cursor-pointer shadow-lg shadow-indigo-600/15"
            >
              <Download className="h-4 w-4" />
              <span>Download File Report</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col h-[660px]">
          {/* Proposed code header context */}
          <div className="bg-black/30 p-4 px-5 flex items-center justify-between border-b border-white/10">
            <span className="text-[11px] text-slate-300 font-mono flex items-center gap-1.5 font-bold uppercase tracking-wider">
              <span className="h-2 w-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)] animate-pulse" />
              Felix Refactored Execution Path
            </span>
            <button
              type="button"
              onClick={() => {
                if (analysis.refactoredCode) {
                  navigator.clipboard.writeText(analysis.refactoredCode);
                  alert("Refactored code copied to clipboard!");
                }
              }}
              className="text-[10px] text-indigo-400 hover:text-white transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5 font-bold uppercase tracking-wide cursor-pointer"
            >
              <Copy className="h-3.5 w-3.5" />
              Copy Code Block
            </button>
          </div>

          <div className="flex-1 overflow-hidden relative">
            <Editor
              height="100%"
              theme="vs-dark"
              language="javascript"
              value={analysis.refactoredCode || '// No refactored recommendation was generated.'}
              options={{
                readOnly: true,
                fontSize: 12,
                fontFamily: 'JetBrains Mono',
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                padding: { top: 15 },
                cursorStyle: 'line',
                lineNumbersMinChars: 3,
                wordWrap: 'on'
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
