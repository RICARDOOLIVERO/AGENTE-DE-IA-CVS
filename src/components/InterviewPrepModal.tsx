import React, { useState } from 'react';
import { X, HelpCircle, CheckCircle2, ChevronRight, Sparkles, BookOpen, Lightbulb } from 'lucide-react';
import { JobRecommendation } from '../types';

interface InterviewPrepModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: JobRecommendation | null;
}

export const InterviewPrepModal: React.FC<InterviewPrepModalProps> = ({
  isOpen,
  onClose,
  job,
}) => {
  const [selectedQuestion, setSelectedQuestion] = useState<number>(0);

  if (!isOpen || !job) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-5 my-8">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5" />
              Simulador de Preguntas Técnicas
            </span>
            <h3 className="text-lg font-bold text-white mt-0.5">
              Preparación para <span className="text-cyan-300">{job.title}</span> ({job.company})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tip banner */}
        <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-xs text-cyan-200 flex items-start gap-2.5">
          <Lightbulb className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <strong>Consejo de Headhunter: </strong>
            Estructura tus respuestas con el método STAR (Situación, Tarea, Acción, Resultado) y menciona ejemplos reales de tus proyectos (YOLOv8, pipelines PyTorch, flujos n8n y LLMs).
          </div>
        </div>

        {/* Questions list */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
            Preguntas Probables en la Prueba Técnica
          </h4>

          <div className="space-y-2">
            {job.interviewPrep?.map((q, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedQuestion(idx)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  selectedQuestion === idx
                    ? 'bg-slate-950 border-cyan-500/40 text-white shadow-md'
                    : 'bg-slate-950/50 border-slate-800/80 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <div className="flex-1 text-xs sm:text-sm font-medium leading-snug">
                    {q}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Strategy Box */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
          <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Estrategia de Respuesta Recomendada
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">
            {job.applicationInfo.applicationStrategy}
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
