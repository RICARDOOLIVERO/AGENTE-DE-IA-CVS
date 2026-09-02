import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { UploadSection } from './components/UploadSection';
import { CandidateProfileCard } from './components/CandidateProfileCard';
import { GapsAndAdvicePanel } from './components/GapsAndAdvicePanel';
import { JobFilters } from './components/JobFilters';
import { JobCard } from './components/JobCard';
import { ApplicationModal } from './components/ApplicationModal';
import { InterviewPrepModal } from './components/InterviewPrepModal';
import { ReportExportModal } from './components/ReportExportModal';
import { CVAnalysisResult, JobRecommendation } from './types';
import { Sparkles, FileDown, ArrowLeft, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [analysisResult, setAnalysisResult] = useState<CVAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Filter and Sort states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModality, setSelectedModality] = useState('Todas');
  const [minMatchScore, setMinMatchScore] = useState(0);
  const [sortBy, setSortBy] = useState<'score' | 'salary' | 'title'>('score');

  // Modal states
  const [selectedJobForLetter, setSelectedJobForLetter] = useState<JobRecommendation | null>(null);
  const [selectedJobForInterview, setSelectedJobForInterview] = useState<JobRecommendation | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const loadingSteps = [
    'Extrayendo datos de contacto, proyectos y formación académica...',
    'Categorizando stack tecnológico e identificando competencias implícitas...',
    'Calibrando nivel de seniority y diagnosticando áreas de mejora...',
    'Buscando ofertas de empleo en IA e informática y calculando % de match...',
    'Generando justificaciones técnicas y estrategias de postulación...',
  ];

  const handleAnalyze = async (payload: {
    cvText?: string;
    fileData?: string;
    mimeType?: string;
    fileName?: string;
    preferences: {
      location: string;
      modality: string;
    };
  }) => {
    setIsLoading(true);
    setErrorMsg(null);
    setLoadingStep(0);

    // Simulate animated step progression while waiting for Gemini
    const stepInterval = setInterval(() => {
      setLoadingStep((prev) => (prev < loadingSteps.length - 1 ? prev + 1 : prev));
    }, 2500);

    try {
      const response = await fetch('/api/analyze-cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Error en el servidor (${response.status})`);
      }

      const data: CVAnalysisResult = await response.json();
      setAnalysisResult(data);
    } catch (err: any) {
      console.error('Analysis error:', err);
      setErrorMsg(err.message || 'Ocurrió un error al analizar el CV. Verifica la conexión o intenta con otro archivo.');
    } finally {
      clearInterval(stepInterval);
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setErrorMsg(null);
    setSearchTerm('');
    setSelectedModality('Todas');
    setMinMatchScore(0);
  };

  // Filter and sort recommendations
  const filteredAndSortedJobs = useMemo(() => {
    if (!analysisResult?.recommendations) return [];

    return analysisResult.recommendations
      .filter((job) => {
        // Modality filter
        if (selectedModality !== 'Todas') {
          if (selectedModality === 'Remoto' && !job.workplaceType.includes('Remoto')) return false;
          if (selectedModality === 'Híbrido' && !job.workplaceType.includes('Híbrido')) return false;
          if (selectedModality === 'Presencial' && !job.workplaceType.includes('Presencial')) return false;
        }

        // Min match score filter
        if (job.matchScore < minMatchScore) return false;

        // Search text filter
        if (searchTerm.trim()) {
          const term = searchTerm.toLowerCase();
          const matchTitle = job.title.toLowerCase().includes(term);
          const matchCompany = job.company.toLowerCase().includes(term);
          const matchLocation = job.location.toLowerCase().includes(term);
          const matchTech = job.whyItFits.technologiesInCommon.some((t) => t.toLowerCase().includes(term));
          if (!matchTitle && !matchCompany && !matchLocation && !matchTech) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'score') return b.matchScore - a.matchScore;
        if (sortBy === 'title') return a.title.localeCompare(b.title);
        if (sortBy === 'salary') return b.salaryRange.localeCompare(a.salaryRange);
        return 0;
      });
  }, [analysisResult, selectedModality, minMatchScore, searchTerm, sortBy]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      <Header onReset={handleReset} hasResults={Boolean(analysisResult)} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Error Alert */}
        {errorMsg && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs sm:text-sm flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
              <span>{errorMsg}</span>
            </div>
            <button
              onClick={() => setErrorMsg(null)}
              className="px-2.5 py-1 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-200 text-xs font-semibold"
            >
              Cerrar
            </button>
          </div>
        )}

        {/* Loading Overlay */}
        {isLoading && (
          <div className="py-20 flex flex-col items-center justify-center text-center space-y-6 max-w-lg mx-auto">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-1 animate-pulse shadow-2xl shadow-indigo-500/30 flex items-center justify-center">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white tracking-tight">
                Analizando Perfil & Buscando Oportunidades
              </h3>
              <p className="text-sm text-indigo-300 font-medium">
                {loadingSteps[loadingStep]}
              </p>
            </div>

            {/* Step Indicators */}
            <div className="w-full space-y-2 pt-2">
              {loadingSteps.map((step, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-2.5 text-xs text-left p-2 rounded-lg transition-all ${
                    idx === loadingStep
                      ? 'bg-indigo-500/10 text-indigo-300 font-semibold border border-indigo-500/30'
                      : idx < loadingStep
                      ? 'text-emerald-400 opacity-80'
                      : 'text-slate-600'
                  }`}
                >
                  {idx < loadingStep ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  ) : idx === loadingStep ? (
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin shrink-0" />
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-full border border-slate-700 shrink-0" />
                  )}
                  <span className="truncate">{step}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* State 1: Upload / Input View */}
        {!analysisResult && !isLoading && (
          <UploadSection onAnalyze={handleAnalyze} isLoading={isLoading} />
        )}

        {/* State 2: Results View */}
        {analysisResult && !isLoading && (
          <div className="space-y-8 animate-fade-in">
            {/* Top Results Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleReset}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Cargar otro CV
                </button>
                <div className="text-xs text-slate-400">
                  Análisis completado para <strong className="text-white">{analysisResult.candidateInfo.name}</strong>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsExportModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-600/25 transition-all"
                >
                  <FileDown className="w-3.5 h-3.5" />
                  Exportar Informe Completo
                </button>
              </div>
            </div>

            {/* Overall Match Summary Alert */}
            {analysisResult.overallMatchSummary && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-slate-900 to-indigo-950/60 border border-indigo-500/30 text-xs sm:text-sm text-slate-200 leading-relaxed shadow-lg flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-indigo-300 font-semibold block mb-0.5">Veredicto del Cazatalentos:</strong>
                  {analysisResult.overallMatchSummary}
                </div>
              </div>
            )}

            {/* Candidate Profile Details */}
            <CandidateProfileCard data={analysisResult} />

            {/* CV Diagnostic & Advice (Handling incomplete info / gaps) */}
            <GapsAndAdvicePanel advice={analysisResult.gapsAndAdvice} />

            {/* Recommendations Section Header & Filters */}
            <div className="space-y-6 pt-4">
              <JobFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                selectedModality={selectedModality}
                onModalityChange={setSelectedModality}
                minMatchScore={minMatchScore}
                onMinMatchScoreChange={setMinMatchScore}
                sortBy={sortBy}
                onSortChange={setSortBy}
                totalJobs={analysisResult.recommendations.length}
                filteredCount={filteredAndSortedJobs.length}
              />

              {/* Job Cards Grid */}
              {filteredAndSortedJobs.length > 0 ? (
                <div className="grid grid-cols-1 gap-6">
                  {filteredAndSortedJobs.map((job, idx) => (
                    <JobCard
                      key={job.id || idx}
                      job={job}
                      rank={idx + 1}
                      onOpenLetterModal={(selected) => setSelectedJobForLetter(selected)}
                      onOpenInterviewModal={(selected) => setSelectedJobForInterview(selected)}
                    />
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center bg-slate-900/50 border border-slate-800 rounded-2xl space-y-2">
                  <p className="text-sm font-semibold text-slate-300">
                    No se encontraron puestos con los filtros seleccionados.
                  </p>
                  <p className="text-xs text-slate-500">
                    Prueba a seleccionar &quot;Todas las modalidades&quot; o reducir el filtro de match mínimo.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedModality('Todas');
                      setMinMatchScore(0);
                      setSearchTerm('');
                    }}
                    className="mt-3 px-3 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold"
                  >
                    Restablecer Filtros
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <ApplicationModal
        isOpen={Boolean(selectedJobForLetter)}
        onClose={() => setSelectedJobForLetter(null)}
        job={selectedJobForLetter}
        candidate={analysisResult?.candidateInfo || null}
      />

      <InterviewPrepModal
        isOpen={Boolean(selectedJobForInterview)}
        onClose={() => setSelectedJobForInterview(null)}
        job={selectedJobForInterview}
      />

      <ReportExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        data={analysisResult}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>TalentAI • Headhunter Automatizado para Ingeniería Informática & IA</span>
          <span>Impulsado por Google Gemini 3.7 Flash</span>
        </div>
      </footer>
    </div>
  );
}
