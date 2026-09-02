import React from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Linkedin, 
  Award, 
  GraduationCap, 
  Cpu, 
  Layers, 
  Sparkles, 
  Briefcase, 
  Lightbulb, 
  CheckCircle, 
  Globe2 
} from 'lucide-react';
import { CVAnalysisResult } from '../types';

interface CandidateProfileCardProps {
  data: CVAnalysisResult;
}

export const CandidateProfileCard: React.FC<CandidateProfileCardProps> = ({ data }) => {
  const { candidateInfo, techStack, specializations, experience, education, inferredCompetencies, languagesSpoken } = data;

  const getSeniorityBadgeStyle = (level: string) => {
    switch (level) {
      case 'Senior':
      case 'Lead':
        return 'bg-purple-500/10 text-purple-300 border-purple-500/30';
      case 'Mid-level':
        return 'bg-blue-500/10 text-blue-300 border-blue-500/30';
      case 'Junior':
      default:
        return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Top Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="text-2xl font-bold text-white tracking-tight">{candidateInfo.name}</h2>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getSeniorityBadgeStyle(candidateInfo.seniorityLevel)}`}>
              Nivel: {candidateInfo.seniorityLevel}
            </span>
          </div>
          <p className="text-sm font-medium text-indigo-400">{candidateInfo.headline}</p>
          
          {/* Contact Bar */}
          <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs text-slate-400 pt-1">
            {candidateInfo.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                {candidateInfo.location}
              </span>
            )}
            {candidateInfo.email && (
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                <a href={`mailto:${candidateInfo.email}`} className="hover:text-indigo-300 transition-colors">
                  {candidateInfo.email}
                </a>
              </span>
            )}
            {candidateInfo.phone && (
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                {candidateInfo.phone}
              </span>
            )}
            {candidateInfo.linkedin && (
              <span className="flex items-center gap-1">
                <Linkedin className="w-3.5 h-3.5 text-slate-500" />
                {candidateInfo.linkedin}
              </span>
            )}
          </div>
        </div>

        {/* Specializations Pills */}
        <div className="flex flex-wrap md:flex-col items-start md:items-end gap-1.5">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Especializaciones Clave</span>
          <div className="flex flex-wrap gap-1.5 justify-start md:justify-end">
            {specializations.map((spec, idx) => (
              <span 
                key={idx} 
                className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-medium"
              >
                {spec}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Seniority & Profile Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 space-y-2">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-indigo-400" />
            Perfil & Resumen Profesional
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {candidateInfo.summary}
          </p>
        </div>

        <div className="bg-indigo-950/30 border border-indigo-500/20 rounded-xl p-4 space-y-2">
          <h3 className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-indigo-400" />
            Calibración de Seniority
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            {candidateInfo.seniorityRationale}
          </p>
        </div>
      </div>

      {/* Tech Stack Breakdown */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          Stack Tecnológico Extraído
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* AI & ML */}
          {techStack.aiAndMl?.length > 0 && (
            <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-3 space-y-2">
              <span className="text-xs font-semibold text-cyan-300 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" /> IA, ML & Computer Vision
              </span>
              <div className="flex flex-wrap gap-1.5">
                {techStack.aiAndMl.map((item, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded-md bg-cyan-950/60 text-cyan-200 border border-cyan-500/30 text-[11px] font-mono">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {techStack.languages?.length > 0 && (
            <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-3 space-y-2">
              <span className="text-xs font-semibold text-indigo-300 flex items-center gap-1.5">
                <Layers className="w-3 h-3" /> Lenguajes de Programación
              </span>
              <div className="flex flex-wrap gap-1.5">
                {techStack.languages.map((item, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded-md bg-indigo-950/60 text-indigo-200 border border-indigo-500/30 text-[11px] font-mono font-medium">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tools & Automation */}
          {techStack.toolsAndAutomation?.length > 0 && (
            <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-3 space-y-2">
              <span className="text-xs font-semibold text-emerald-300 flex items-center gap-1.5">
                <Layers className="w-3 h-3" /> Automatización, LLMs & DevOps
              </span>
              <div className="flex flex-wrap gap-1.5">
                {techStack.toolsAndAutomation.map((item, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded-md bg-emerald-950/60 text-emerald-200 border border-emerald-500/30 text-[11px] font-mono">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Frameworks */}
          {techStack.frameworksAndLibraries?.length > 0 && (
            <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-3 space-y-2">
              <span className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
                <Layers className="w-3 h-3" /> Frameworks & Bibliotecas
              </span>
              <div className="flex flex-wrap gap-1.5">
                {techStack.frameworksAndLibraries.map((item, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded-md bg-amber-950/60 text-amber-200 border border-amber-500/30 text-[11px] font-mono">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Databases & Data */}
          {techStack.dataAndDatabases?.length > 0 && (
            <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-3 space-y-2">
              <span className="text-xs font-semibold text-violet-300 flex items-center gap-1.5">
                <Layers className="w-3 h-3" /> Datos & Almacenamiento
              </span>
              <div className="flex flex-wrap gap-1.5">
                {techStack.dataAndDatabases.map((item, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded-md bg-violet-950/60 text-violet-200 border border-violet-500/30 text-[11px] font-mono">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Languages spoken */}
          {languagesSpoken?.length > 0 && (
            <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-3 space-y-2">
              <span className="text-xs font-semibold text-rose-300 flex items-center gap-1.5">
                <Globe2 className="w-3 h-3" /> Idiomas
              </span>
              <div className="flex flex-wrap gap-1.5">
                {languagesSpoken.map((item, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded-md bg-rose-950/60 text-rose-200 border border-rose-500/30 text-[11px]">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Inferred Competencies */}
      {inferredCompetencies?.length > 0 && (
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              Competencias Deducidas (Análisis de Señales Implícitas)
            </h3>
            <span className="text-[11px] text-slate-500">Evaluación cualitativa del cazatalentos</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {inferredCompetencies.map((comp, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-slate-900/80 border border-slate-800/80 space-y-1">
                <div className="text-xs font-semibold text-indigo-300 flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  {comp.competency}
                </div>
                <p className="text-[11px] text-slate-400 leading-normal pl-5">
                  {comp.deductionReason}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Experience & Education 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2 border-t border-slate-800">
        {/* Experience */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
            Experiencia & Proyectos Clave
          </h3>
          <div className="space-y-3">
            {experience.map((exp, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xs font-bold text-white">{exp.role}</h4>
                    <p className="text-xs text-indigo-400">{exp.company}</p>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                    {exp.period}
                  </span>
                </div>
                <ul className="space-y-1">
                  {exp.highlights.map((hl, hIdx) => (
                    <li key={hIdx} className="text-xs text-slate-300 flex items-start gap-1.5">
                      <span className="text-indigo-400 shrink-0">•</span>
                      <span>{hl}</span>
                    </li>
                  ))}
                </ul>
                {exp.keyTechnologies?.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {exp.keyTechnologies.map((tech, tIdx) => (
                      <span key={tIdx} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-400 border border-slate-700/60">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Education */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
            Formación Académica & Certificaciones
          </h3>
          <div className="space-y-3">
            {education.map((edu, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xs font-bold text-white">{edu.title}</h4>
                    <p className="text-xs text-cyan-400">{edu.institution}</p>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                    {edu.periodOrYear}
                  </span>
                </div>
                {edu.details && (
                  <p className="text-xs text-slate-400">{edu.details}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
