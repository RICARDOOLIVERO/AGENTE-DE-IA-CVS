import React from 'react';
import { Filter, Search, SlidersHorizontal } from 'lucide-react';

interface JobFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedModality: string;
  onModalityChange: (modality: string) => void;
  minMatchScore: number;
  onMinMatchScoreChange: (score: number) => void;
  sortBy: 'score' | 'salary' | 'title';
  onSortChange: (sort: 'score' | 'salary' | 'title') => void;
  totalJobs: number;
  filteredCount: number;
}

export const JobFilters: React.FC<JobFiltersProps> = ({
  searchTerm,
  onSearchChange,
  selectedModality,
  onModalityChange,
  minMatchScore,
  onMinMatchScoreChange,
  sortBy,
  onSortChange,
  totalJobs,
  filteredCount,
}) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
            Oportunidades de Empleo Recomendadas
          </h3>
          <p className="text-xs text-slate-400">
            Mostrando {filteredCount} de {totalJobs} vacantes seleccionadas para tu perfil
          </p>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por rol, empresa, tecnología..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
        {/* Modality Chips */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-slate-400 font-medium mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Modalidad:
          </span>
          {['Todas', 'Remoto', 'Híbrido', 'Presencial'].map((mod) => (
            <button
              key={mod}
              type="button"
              onClick={() => onModalityChange(mod)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                selectedModality === mod
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {mod}
            </button>
          ))}
        </div>

        {/* Sort and Match Filter */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Match mín:</span>
            <select
              value={minMatchScore}
              onChange={(e) => onMinMatchScoreChange(Number(e.target.value))}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value={0}>Cualquiera</option>
              <option value={70}>≥ 70% (Alto)</option>
              <option value={80}>≥ 80% (Muy Alto)</option>
              <option value={90}>≥ 90% (Excelente)</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Ordenar por:</span>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as any)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="score">Calidad de Match (Recomendado)</option>
              <option value="title">Título de Puesto</option>
              <option value="salary">Rango Salarial</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
