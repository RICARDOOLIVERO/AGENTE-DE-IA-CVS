import React from 'react';
import { AlertTriangle, TrendingUp, CheckSquare, Sparkles, HelpCircle } from 'lucide-react';
import { GapsAndAdvice } from '../types';

interface GapsAndAdvicePanelProps {
  advice: GapsAndAdvice;
}

export const GapsAndAdvicePanel: React.FC<GapsAndAdvicePanelProps> = ({ advice }) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              Diagnóstico de CV & Áreas de Mejora
            </h3>
            <p className="text-xs text-slate-400">
              Observaciones de información incompleta y recomendaciones para potenciar tu empleabilidad
            </p>
          </div>
        </div>
        <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
          Auditoría de Perfil
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Missing or vague details */}
        <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300 uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Detalles a Completar / Clarificar</span>
          </div>
          <p className="text-[11px] text-amber-200/70">
            Aspectos que podrían enriquecerse con métricas o certificaciones:
          </p>
          <ul className="space-y-1.5">
            {advice.missingOrVagueDetails.map((item, idx) => (
              <li key={idx} className="text-xs text-slate-300 flex items-start gap-1.5">
                <span className="text-amber-400 shrink-0">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CV Optimization Tips */}
        <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/30 space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300 uppercase tracking-wider">
            <CheckSquare className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>Optimizaciones para ATS & Headhunters</span>
          </div>
          <p className="text-[11px] text-indigo-200/70">
            Buenas prácticas para destacar ante filtros automatizados:
          </p>
          <ul className="space-y-1.5">
            {advice.cvOptimizationTips.map((tip, idx) => (
              <li key={idx} className="text-xs text-slate-300 flex items-start gap-1.5">
                <span className="text-indigo-400 shrink-0">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Next recommended skills & certifications */}
        <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-300 uppercase tracking-wider">
            <TrendingUp className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Siguiente Salto Tecnológico</span>
          </div>
          <p className="text-[11px] text-cyan-200/70">
            Herramientas y certificaciones con alta demanda para tu perfil:
          </p>
          <ul className="space-y-1.5">
            {advice.recommendedCertificationsOrNextSkills.map((rec, idx) => (
              <li key={idx} className="text-xs text-slate-300 flex items-start gap-1.5">
                <span className="text-cyan-400 shrink-0">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Market demand summary */}
      {advice.marketDemandSummary && (
        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-emerald-300 font-semibold">Perspectiva de Mercado Actual: </strong>
            <span className="text-slate-300">{advice.marketDemandSummary}</span>
          </div>
        </div>
      )}
    </div>
  );
};
