import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  DollarSign, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  FileText, 
  MessageSquare, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Share2,
  Briefcase
} from 'lucide-react';
import { JobRecommendation } from '../types';

interface JobCardProps {
  job: JobRecommendation;
  rank: number;
  onOpenLetterModal: (job: JobRecommendation) => void;
  onOpenInterviewModal: (job: JobRecommendation) => void;
}

export const JobCard: React.FC<JobCardProps> = ({ 
  job, 
  rank, 
  onOpenLetterModal, 
  onOpenInterviewModal 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10';
    if (score >= 80) return 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10';
    if (score >= 70) return 'text-indigo-400 border-indigo-500/40 bg-indigo-500/10';
    return 'text-amber-400 border-amber-500/40 bg-amber-500/10';
  };

  const getModalityBadge = (type: string) => {
    if (type.includes('Remoto')) {
      return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';
    }
    if (type.includes('Híbrido')) {
      return 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30';
    }
    return 'bg-slate-800 text-slate-300 border-slate-700';
  };

  return (
    <div className="bg-slate-900/95 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 sm:p-6 shadow-xl transition-all space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="space-y-1.5 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 font-bold text-xs flex items-center justify-center border border-slate-700">
              #{rank}
            </span>
            <h3 className="text-lg font-bold text-white tracking-tight hover:text-indigo-300 transition-colors">
              {job.title}
            </h3>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getModalityBadge(job.workplaceType)}`}>
              {job.workplaceType}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-400">
            <span className="flex items-center gap-1 font-medium text-slate-200">
              <Building2 className="w-3.5 h-3.5 text-indigo-400" />
              {job.company}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              {job.location}
            </span>
            {job.salaryRange && (
              <span className="flex items-center gap-1 text-emerald-400 font-medium">
                <DollarSign className="w-3.5 h-3.5" />
                {job.salaryRange}
              </span>
            )}
            {job.industry && (
              <span className="text-slate-500">• {job.industry}</span>
            )}
          </div>
        </div>

        {/* Match Badge */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1 shrink-0">
          <div className={`px-3 py-1.5 rounded-xl border font-bold text-sm flex items-center gap-1.5 ${getScoreColor(job.matchScore)}`}>
            <Sparkles className="w-4 h-4" />
            <span>{job.matchScore}% Match</span>
          </div>
          <span className="text-[11px] font-medium text-slate-400">
            {job.matchLevel}
          </span>
        </div>
      </div>

      {/* Role Summary */}
      <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 space-y-1.5">
        <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
          Descripción del Puesto & Expectativas
        </h4>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          {job.roleSummary}
        </p>

        {job.keyResponsibilities?.length > 0 && (
          <div className="pt-2">
            <span className="text-[11px] font-semibold text-slate-400">Responsabilidades Principales:</span>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-1.5 pt-1">
              {job.keyResponsibilities.map((resp, idx) => (
                <li key={idx} className="text-xs text-slate-300 flex items-start gap-1.5">
                  <span className="text-indigo-400 shrink-0">›</span>
                  <span>{resp}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Why It Fits (Detailed Justification) */}
      <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/25 space-y-2.5">
        <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          Por qué encaja con tu Perfil (Justificación Técnica)
        </h4>
        
        <p className="text-xs text-slate-200 leading-relaxed">
          {job.whyItFits.matchingExperience}
        </p>

        {/* Technologies in common */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] font-semibold text-indigo-300 mr-1">Tecnologías afines:</span>
          {job.whyItFits.technologiesInCommon.map((tech, idx) => (
            <span 
              key={idx} 
              className="px-2 py-0.5 rounded-md bg-indigo-900/60 text-indigo-200 border border-indigo-500/30 text-[11px] font-mono font-medium"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Matching skills */}
        {job.whyItFits.matchingSkills?.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-semibold text-indigo-300 mr-1">Competencias coincidentes:</span>
            {job.whyItFits.matchingSkills.map((sk, idx) => (
              <span 
                key={idx} 
                className="px-2 py-0.5 rounded-md bg-slate-900/80 text-emerald-300 border border-emerald-500/20 text-[11px]"
              >
                ✓ {sk}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Partial Gaps or Technical Challenges (Honesty Requirement) */}
      {job.partialGapsOrChallenges && (
        <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/25 space-y-1">
          <h4 className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
            Aspectos a tener en cuenta / Posibles áreas no coincidentes al 100%
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            {job.partialGapsOrChallenges}
          </p>
        </div>
      )}

      {/* Action and Application Bar */}
      <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left tools: Cover letter & Interview Prep */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onOpenLetterModal(job)}
            className="px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-indigo-400" />
            Generar Carta & Pitch
          </button>

          <button
            type="button"
            onClick={() => onOpenInterviewModal(job)}
            className="px-3 py-1.5 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
            Preguntas de Entrevista
          </button>
        </div>

        {/* Right tools: Direct portal search links */}
        <div className="flex flex-wrap items-center gap-2">
          <a
            href={(job.applicationInfo as any)?.linkedinSearchUrl || `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(job.title + ' ' + job.location)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium flex items-center gap-1 transition-colors"
          >
            LinkedIn Jobs
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>

          <a
            href={(job.applicationInfo as any)?.googleJobsUrl || `https://www.google.com/search?q=empleo+${encodeURIComponent(job.title + ' ' + job.company)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all"
          >
            Buscar & Postular
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
