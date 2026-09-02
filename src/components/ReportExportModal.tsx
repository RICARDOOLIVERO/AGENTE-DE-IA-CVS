import React, { useState } from 'react';
import { X, Copy, Check, Printer, FileDown, CheckCircle2 } from 'lucide-react';
import { CVAnalysisResult } from '../types';

interface ReportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: CVAnalysisResult | null;
}

export const ReportExportModal: React.FC<ReportExportModalProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !data) return null;

  const generateMarkdownReport = () => {
    const { candidateInfo, techStack, specializations, experience, education, gapsAndAdvice, recommendations } = data;
    
    let md = `# INFORME DE CAZATALENTOS: EVALUACIÓN DE CV & VACANTES EN IA\n\n`;
    md += `## 1. Perfil del Candidato\n`;
    md += `- **Nombre:** ${candidateInfo.name}\n`;
    md += `- **Titular:** ${candidateInfo.headline}\n`;
    md += `- **Ubicación:** ${candidateInfo.location || 'No especificada'}\n`;
    md += `- **Nivel de Seniority:** ${candidateInfo.seniorityLevel}\n`;
    md += `- **Justificación:** ${candidateInfo.seniorityRationale}\n\n`;

    md += `## 2. Stack Tecnológico & Especialización\n`;
    md += `- **Especializaciones:** ${specializations.join(', ')}\n`;
    md += `- **Lenguajes:** ${techStack.languages.join(', ')}\n`;
    md += `- **IA / Machine Learning / CV:** ${techStack.aiAndMl.join(', ')}\n`;
    md += `- **Herramientas & Automatización:** ${techStack.toolsAndAutomation.join(', ')}\n\n`;

    md += `## 3. Diagnóstico de CV & Áreas de Mejora\n`;
    md += `### Aspectos a clarificar:\n`;
    gapsAndAdvice.missingOrVagueDetails.forEach(m => md += `- ${m}\n`);
    md += `\n### Consejos de Optimización:\n`;
    gapsAndAdvice.cvOptimizationTips.forEach(tip => md += `- ${tip}\n`);
    md += `\n`;

    md += `## 4. Oportunidades de Empleo Recomendadas (Ordenadas por Match)\n\n`;
    recommendations.forEach((job, idx) => {
      md += `### #${idx + 1} ${job.title} — ${job.company} (${job.matchScore}% Match)\n`;
      md += `- **Modalidad:** ${job.workplaceType} | **Ubicación:** ${job.location}\n`;
      md += `- **Rango Salarial:** ${job.salaryRange}\n`;
      md += `- **Descripción:** ${job.roleSummary}\n`;
      md += `- **Por qué encaja:** ${job.whyItFits.matchingExperience}\n`;
      md += `- **Tecnologías afines:** ${job.whyItFits.technologiesInCommon.join(', ')}\n`;
      md += `- **Brechas a tener en cuenta:** ${job.partialGapsOrChallenges}\n`;
      md += `- **Estrategia de aplicación:** ${job.applicationInfo.applicationStrategy}\n\n`;
    });

    return md;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateMarkdownReport());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-5 my-8">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-white">
              Exportar Informe de Análisis & Puestos
            </h3>
            <p className="text-xs text-slate-400">
              Dossier completo en Markdown o formato imprimible/PDF
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action bar */}
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" /> Copiado al portapapeles
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" /> Copiar Markdown
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" /> Imprimir / Guardar PDF
          </button>
        </div>

        {/* Markdown preview */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 max-h-96 overflow-y-auto font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
          {generateMarkdownReport()}
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
