import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  FileText, 
  Sparkles, 
  Zap, 
  MapPin, 
  Briefcase, 
  CheckCircle2, 
  AlertCircle,
  FileCode2,
  RefreshCw,
  X
} from 'lucide-react';
import { SAMPLE_CV_TEXT } from '../data/sampleCV';

interface UploadSectionProps {
  onAnalyze: (payload: {
    cvText?: string;
    fileData?: string;
    mimeType?: string;
    fileName?: string;
    preferences: {
      location: string;
      modality: string;
    };
  }) => void;
  isLoading: boolean;
}

export const UploadSection: React.FC<UploadSectionProps> = ({ onAnalyze, isLoading }) => {
  const [activeTab, setActiveTab] = useState<'file' | 'text'>('file');
  const [cvText, setCvText] = useState<string>('');
  const [uploadedFile, setUploadedFile] = useState<{
    name: string;
    size: string;
    mimeType: string;
    base64: string;
  } | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [locationPref, setLocationPref] = useState('España / Remoto Global');
  const [modalityPref, setModalityPref] = useState('Todas (Remoto, Híbrido, Presencial)');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    setErrorMsg(null);
    const validTypes = ['application/pdf', 'text/plain', 'image/png', 'image/jpeg', 'image/webp'];
    
    // Fallback if mimeType is empty for .txt
    const isTxt = file.name.endsWith('.txt') || file.name.endsWith('.md');
    const mimeType = isTxt ? 'text/plain' : file.type;

    if (!validTypes.includes(mimeType) && !isTxt) {
      setErrorMsg('Por favor sube un archivo PDF, documento de texto (.txt, .md) o imagen (PNG, JPG).');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setErrorMsg('El archivo es demasiado grande (máximo 20MB).');
      return;
    }

    const reader = new FileReader();
    if (mimeType === 'text/plain' || isTxt) {
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setCvText(content);
        setActiveTab('text');
        setUploadedFile({
          name: file.name,
          size: `${(file.size / 1024).toFixed(1)} KB`,
          mimeType: 'text/plain',
          base64: '',
        });
      };
      reader.readAsText(file);
    } else {
      reader.onload = (event) => {
        const result = event.target?.result as string;
        const base64Data = result.split(',')[1];
        setUploadedFile({
          name: file.name,
          size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
          mimeType: mimeType || 'application/pdf',
          base64: base64Data,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleLoadSample = () => {
    setCvText(SAMPLE_CV_TEXT);
    setActiveTab('text');
    setUploadedFile({
      name: 'CV_Ricardo_Olivero_IA.txt',
      size: '3.8 KB',
      mimeType: 'text/plain',
      base64: '',
    });
    setErrorMsg(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (activeTab === 'file' && uploadedFile?.base64) {
      onAnalyze({
        fileData: uploadedFile.base64,
        mimeType: uploadedFile.mimeType,
        fileName: uploadedFile.name,
        preferences: {
          location: locationPref,
          modality: modalityPref,
        },
      });
    } else if (cvText.trim().length > 30) {
      onAnalyze({
        cvText: cvText.trim(),
        fileName: uploadedFile?.name || 'CV_Texto.txt',
        preferences: {
          location: locationPref,
          modality: modalityPref,
        },
      });
    } else {
      setErrorMsg('Por favor adjunta un archivo de CV (PDF/Texto/Imagen) o pega el texto del currículum con al menos 30 caracteres.');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Intro Banner */}
      <div className="text-center space-y-3 pt-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          Agente de Empleo & Headhunting Especializado
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Caza de Oportunidades & Análisis Integral de CV
        </h2>
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Sube tu CV en PDF o texto para que el agente extraiga tu stack técnico, calibre tu seniority, identifique competencias y localice ofertas de trabajo en IA y desarrollo con un match real y accionable.
        </p>
      </div>

      {/* Quick Sample Action */}
      <div className="bg-gradient-to-r from-indigo-950/70 via-slate-900 to-indigo-950/70 border border-indigo-500/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shrink-0">
            <Zap className="w-5 h-5 text-indigo-300" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white flex items-center gap-2">
              Probar con el CV adjunto
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                Ricardo Olivero (Ing. IA & CV)
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Graduado en Ing. Informática (Sevilla), especialista en IA/ML, YOLOv8, PyTorch, LLMs locales y n8n.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleLoadSample}
          className="w-full sm:w-auto px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/30 shrink-0 flex items-center justify-center gap-2"
        >
          <FileCode2 className="w-4 h-4" />
          Cargar CV de Ricardo
        </button>
      </div>

      {/* Main Upload Box */}
      <form onSubmit={handleSubmit} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-2xl backdrop-blur-xl space-y-6">
        {/* Tab Selector */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('file')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 ${
                activeTab === 'file'
                  ? 'bg-slate-800 text-indigo-400 border border-slate-700 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <UploadCloud className="w-4 h-4" />
              Adjuntar Archivo (PDF / Imagen)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('text')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 ${
                activeTab === 'text'
                  ? 'bg-slate-800 text-indigo-400 border border-slate-700 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-4 h-4" />
              Pegar / Editar Texto del CV
            </button>
          </div>
          {cvText && activeTab === 'text' && (
            <button
              type="button"
              onClick={() => setCvText('')}
              className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" /> Limpiar
            </button>
          )}
        </div>

        {/* Tab 1: File Dropzone */}
        {activeTab === 'file' && (
          <div className="space-y-4">
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
                dragActive
                  ? 'border-indigo-500 bg-indigo-500/10 scale-[0.99]'
                  : uploadedFile
                  ? 'border-emerald-500/40 bg-emerald-500/5'
                  : 'border-slate-700 hover:border-slate-600 bg-slate-950/40'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.png,.jpg,.jpeg,.webp,.txt"
                onChange={handleFileInputChange}
                className="hidden"
              />

              {uploadedFile ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div className="text-sm font-semibold text-white">{uploadedFile.name}</div>
                  <div className="text-xs text-slate-400">{uploadedFile.size} • Listo para analizar</div>
                  <span className="mt-2 text-xs text-indigo-400 hover:underline">Haz clic para cambiar de archivo</span>
                </div>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400 border border-slate-700">
                    <UploadCloud className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      Arrastra y suelta tu CV aquí, o <span className="text-indigo-400 hover:underline">examina tus archivos</span>
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Formatos soportados: PDF, TXT, PNG, JPG (Máx. 20MB)
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Raw Text Editor */}
        {activeTab === 'text' && (
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300">
              Contenido del Currículum Vitae (Texto plano)
            </label>
            <textarea
              value={cvText}
              onChange={(e) => setCvText(e.target.value)}
              placeholder="Pega aquí el contenido de tu CV (Experiencia, educación, proyectos, stack tecnológico, idiomas...)"
              rows={10}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors resize-y leading-relaxed"
            />
            <div className="flex justify-between text-[11px] text-slate-500">
              <span>{cvText.length} caracteres introducidos</span>
              <span>Incluye detalles de proyectos y tecnologías para un mejor match</span>
            </div>
          </div>
        )}

        {/* Target Preferences */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800/80">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-indigo-400" />
              Preferencia de Ubicación
            </label>
            <input
              type="text"
              value={locationPref}
              onChange={(e) => setLocationPref(e.target.value)}
              placeholder="Ej: Sevilla, España, Remoto Europa..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
              Modalidad de Trabajo
            </label>
            <select
              value={modalityPref}
              onChange={(e) => setModalityPref(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="Todas (Remoto, Híbrido, Presencial)">Todas las modalidades</option>
              <option value="100% Remoto">100% Remoto</option>
              <option value="Híbrido o Remoto">Híbrido o Remoto</option>
              <option value="Presencial">Presencial</option>
            </select>
          </div>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Submit Action */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-semibold text-sm shadow-xl shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                <span>Analizando CV y buscando vacantes en IA & Informática...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>Analizar CV & Descubrir Puestos con Match Real</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
