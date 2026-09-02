import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Sparkles, Send, FileText, Linkedin, RefreshCw, Star } from 'lucide-react';
import { CandidateInfo, JobRecommendation } from '../types';

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: JobRecommendation | null;
  candidate: CandidateInfo | null;
}

export const ApplicationModal: React.FC<ApplicationModalProps> = ({
  isOpen,
  onClose,
  job,
  candidate,
}) => {
  const [activeTab, setActiveTab] = useState<'letter' | 'linkedin'>('letter');
  const [isLoading, setIsLoading] = useState(false);
  const [tone, setTone] = useState('Profesional, seguro y orientado a resultados técnicos');
  const [copiedLetter, setCopiedLetter] = useState(false);
  const [copiedLinkedin, setCopiedLinkedin] = useState(false);
  
  const [letterData, setLetterData] = useState<{
    coverLetter: string;
    linkedinMessage: string;
    keySellingPoints: string[];
  } | null>(null);

  useEffect(() => {
    if (isOpen && job && candidate) {
      // Default to the pre-generated pitch if available
      if (job.tailoredPitch && !letterData) {
        setLetterData({
          coverLetter: `Estimado equipo de selección de ${job.company},\n\nLes escribo con gran entusiasmo para presentar mi candidatura a la posición de ${job.title}.\n\nComo ${candidate.headline}, cuento con formación especializada en Inteligencia Artificial y Machine Learning. He diseñado e implementado soluciones prácticas que combinan ${job.whyItFits.technologiesInCommon.join(", ") || "visión artificial, automatización y despliegue de modelos"}.\n\nEn mis proyectos recientes, he demostrado capacidad para llevar modelos desde la conceptualización hasta la puesta en producción con altos estándares de calidad y precisión. Su vacante en ${job.company} representa el entorno ideal para aportar mi proactividad, pensamiento analítico y pasión por la IA aplicada.\n\n${job.tailoredPitch}\n\nQuedo a su completa disposición para profundizar en mi experiencia en una entrevista.\n\nAtentamente,\n${candidate.name}\n${candidate.email || ""}`,
          linkedinMessage: `Hola! He visto la vacante de ${job.title} en ${job.company}. Como ${candidate.headline} especializado en ${job.whyItFits.technologiesInCommon.slice(0, 3).join(", ") || "IA y ML"}, me encantaría conectar y explorar cómo mi experiencia en proyectos prácticos puede sumar al equipo. ¡Un saludo!`,
          keySellingPoints: [
            `Dominio práctico de ${job.whyItFits.technologiesInCommon.slice(0, 3).join(", ")} alineado con las necesidades del rol.`,
            `Experiencia comprobada en desarrollo de pipelines de IA y automatizaciones orientadas a optimización de procesos.`,
            `Capacidad de comunicación asertiva y adaptación rápida a proyectos tecnológicos complejos.`,
          ],
        });
      }
    }
  }, [isOpen, job, candidate]);

  if (!isOpen || !job || !candidate) return null;

  const handleGenerateCustom = async (selectedTone: string) => {
    setTone(selectedTone);
    setIsLoading(true);
    try {
      const res = await fetch('/api/generate-application-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidate,
          job,
          tone: selectedTone,
        }),
      });

      if (!res.ok) throw new Error('Error al generar la carta');
      const data = await res.json();
      setLetterData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, type: 'letter' | 'linkedin') => {
    navigator.clipboard.writeText(text);
    if (type === 'letter') {
      setCopiedLetter(true);
      setTimeout(() => setCopiedLetter(false), 2000);
    } else {
      setCopiedLinkedin(true);
      setTimeout(() => setCopiedLinkedin(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-5 my-8">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Kit de Postulación Personalizado
            </span>
            <h3 className="text-lg font-bold text-white mt-0.5">
              {job.title} en <span className="text-indigo-300">{job.company}</span>
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tone Selector */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400">Tono del mensaje:</span>
          {[
            'Profesional y seguro',
            'Técnico y pragmático',
            'Entusiasta e innovador',
          ].map((t) => (
            <button
              key={t}
              onClick={() => handleGenerateCustom(t)}
              disabled={isLoading}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                tone.includes(t.split(' ')[0])
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('letter')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'letter'
                ? 'bg-slate-800 text-indigo-400 border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Carta de Presentación (Email / Portal)
          </button>
          <button
            onClick={() => setActiveTab('linkedin')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'linkedin'
                ? 'bg-slate-800 text-indigo-400 border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Linkedin className="w-3.5 h-3.5 text-sky-400" />
            Mensaje Directo LinkedIn (Recruiter)
          </button>
        </div>

        {/* Content Box */}
        {isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-400">
            <RefreshCw className="w-6 h-6 animate-spin text-indigo-400" />
            <p className="text-xs">Redactando propuesta técnica adaptada...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeTab === 'letter' && letterData && (
              <div className="space-y-3">
                <div className="relative">
                  <textarea
                    readOnly
                    value={letterData.coverLetter}
                    rows={11}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-200 leading-relaxed resize-none focus:outline-none"
                  />
                  <button
                    onClick={() => copyToClipboard(letterData.coverLetter, 'letter')}
                    className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 flex items-center gap-1.5 shadow-md"
                  >
                    {copiedLetter ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">¡Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar Carta</span>
                      </>
                    )}
                  </button>
                </div>

                {letterData.keySellingPoints?.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                    <span className="text-xs font-bold text-indigo-300 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-400" />
                      Argumentos Clave de Venta (Value Pitch):
                    </span>
                    <ul className="space-y-1">
                      {letterData.keySellingPoints.map((point, idx) => (
                        <li key={idx} className="text-xs text-slate-300 flex items-start gap-1.5">
                          <span className="text-indigo-400">✓</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'linkedin' && letterData && (
              <div className="space-y-3">
                <div className="relative">
                  <textarea
                    readOnly
                    value={letterData.linkedinMessage}
                    rows={5}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-200 leading-relaxed resize-none focus:outline-none"
                  />
                  <button
                    onClick={() => copyToClipboard(letterData.linkedinMessage, 'linkedin')}
                    className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 flex items-center gap-1.5 shadow-md"
                  >
                    {copiedLinkedin ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">¡Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar Mensaje</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="text-[11px] text-slate-500 flex justify-between">
                  <span>{letterData.linkedinMessage.length} caracteres</span>
                  <span>Ideal para notas de conexión de LinkedIn</span>
                </div>
              </div>
            )}
          </div>
        )}

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
