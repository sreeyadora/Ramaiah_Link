import React, { useState } from 'react';
import { analyzeSkillGap } from '../services/geminiService';
import { SkillGapReport } from '../types';
import { BrainCircuit, Loader2, ArrowRight, BookOpen, Target } from 'lucide-react';

interface Props {
  currentSkills: string[];
}

export const SkillAnalyzer: React.FC<Props> = ({ currentSkills }) => {
  const [targetRole, setTargetRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<SkillGapReport | null>(null);

  const handleAnalyze = async () => {
    if (!targetRole.trim()) return;
    setLoading(true);
    try {
      const result = await analyzeSkillGap(currentSkills, targetRole);
      setReport(result);
    } catch (e) {
      alert("AI Analysis failed. Please ensure API Key is valid.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-indigo-100 rounded-lg">
          <BrainCircuit className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-800">AI Skill-Gap Analyzer</h2>
          <p className="text-sm text-slate-500">Powered by Gemini 2.5 Flash</p>
        </div>
      </div>

      {!report ? (
        <div className="space-y-4">
          <p className="text-slate-600">
            Enter your dream job role, and our AI will analyze your current profile against market standards to generate a personalized learning path.
          </p>
          
          <div className="flex gap-2">
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g., Full Stack Developer, Data Scientist..."
              className="flex-1 border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <button
              onClick={handleAnalyze}
              disabled={loading || !targetRole}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin w-4 h-4" /> : 'Analyze'}
            </button>
          </div>
          
          <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-100">
            <p className="text-xs font-semibold text-slate-400 uppercase mb-2">Your Current Skills</p>
            <div className="flex flex-wrap gap-2">
              {currentSkills.map(skill => (
                <span key={skill} className="bg-white border border-slate-200 px-2 py-1 rounded text-sm text-slate-600">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-slate-100">
            <h3 className="font-semibold text-lg text-slate-800">Gap Report: {report.targetRole}</h3>
            <button onClick={() => setReport(null)} className="text-sm text-indigo-600 hover:underline">
              Start Over
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
                <h4 className="flex items-center gap-2 text-sm font-bold text-red-600 mb-3">
                    <Target className="w-4 h-4" /> Missing Skills
                </h4>
                <ul className="space-y-2">
                    {report.missingSkills.map((skill, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-slate-700 bg-red-50 px-3 py-2 rounded-md border border-red-100">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                            {skill}
                        </li>
                    ))}
                </ul>
            </div>

            <div>
                <h4 className="flex items-center gap-2 text-sm font-bold text-emerald-600 mb-3">
                    <BookOpen className="w-4 h-4" /> Recommendations
                </h4>
                <ul className="space-y-2">
                    {report.recommendations.map((rec, idx) => (
                        <li key={idx} className="text-sm text-slate-600 bg-emerald-50 px-3 py-2 rounded-md border border-emerald-100">
                            {rec}
                        </li>
                    ))}
                </ul>
            </div>
          </div>

          <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
             <h4 className="flex items-center gap-2 font-bold text-indigo-800 mb-2">
                <ArrowRight className="w-4 h-4" /> 4-Week Learning Sprint
             </h4>
             <p className="text-slate-700 text-sm leading-relaxed">
                {report.learningSprintPlan}
             </p>
          </div>
        </div>
      )}
    </div>
  );
};