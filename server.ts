import express from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";

dotenv.config();

function getGenAI(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is missing. Please configure it in the Secrets panel.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for large payload handling (e.g., base64 PDF/image)
  app.use(express.json({ limit: "30mb" }));
  app.use(express.urlencoded({ extended: true, limit: "30mb" }));

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      hasKey: Boolean(process.env.GEMINI_API_KEY),
    });
  });

  // CV Analysis Endpoint
  app.post("/api/analyze-cv", async (req, res) => {
    try {
      const { cvText, fileData, mimeType, preferences } = req.body;

      if (!cvText && !fileData) {
        return res.status(400).json({ error: "Debes proporcionar el texto del CV o un archivo adjunto (PDF/Imagen)." });
      }

      const ai = getGenAI();

      const systemPrompt = `Eres un cazatalentos senior y headhunter técnico de élite especializado en ingeniería informática, Inteligencia Artificial, Machine Learning, Data Science y desarrollo de software.
Tu labor es automatizar por completo el análisis exhaustivo del CV de un candidato y generar recomendaciones de empleo hiper-relevantes, realistas y accionables.

Instrucciones de análisis y recomendación:
1. EXTRACCIÓN Y DIAGNÓSTICO RIGUROSO:
   - Extrae nombre, contacto, ubicación y resumen.
   - Determina el nivel de seniority real (Junior, Mid-level, Senior, etc.) con justificación objetiva basada en proyectos, titulación y años de experiencia.
   - Desglosa el stack tecnológico por categorías precisas (lenguajes, frameworks, IA/ML, automatización, bases de datos).
   - Identifica competencias implícitas/deducibles (arquitectura de pipelines, orquestación de agentes locales, habilidades de comunicación interdisciplinar).
   - Analiza la información incompleta o vacíos en el CV (por ejemplo: falta de métricas cuantificables, certificaciones oficiales por certificar, etc.) y aporta recomendaciones constructivas para optimizar el perfil.

2. BÚSQUEDA Y GENERACIÓN DE OFERTAS DE EMPLEO DE ALTO VALOR (MÍNIMO 5-7 PUESTOS):
   - Cada puesto debe ajustarse estrictamente a la especialización del candidato (por ejemplo: Ingeniero de IA y Automatización, Computer Vision Engineer, Machine Learning Engineer, Python & LLM Developer, AI Solutions Engineer).
   - Calibra el nivel de experiencia: si el candidato es graduado reciente o perfil Junior/Mid con proyectos aplicados de alto impacto (YOLOv8, PyTorch, n8n, Ollama, LangChain, etc.), ofrece puestos de Junior a Mid-level o Graduate/Associate AI Engineer, NUNCA puestos de entrada desconectados ni puestos de Director/Staff fuera de rango.
   - Cubre diferentes modalidades: Remoto 100% (nacional/internacional), Híbrido y Presencial (priorizando España/Sevilla/Madrid/Barcelona y empresas internacionales con contratación remota).
   - Ordena las recomendaciones por matchScore descendente (el mejor match primero).
   - Para cada oferta incluye:
     * Título y empresa (empresas reconocidas, startups tecnológicas o consultoras de innovación punteras en IA/Tech).
     * Modalidad y ubicación exacta.
     * Rango salarial realista del mercado en EUR o USD anuales.
     * Justificación técnica detallada: por qué encaja, qué tecnologías comparte, qué proyectos del CV respaldan la candidatura.
     * Brechas parciales o retos técnicos que deberá afrontar en ese puesto (honestidad técnica).
     * Estrategia de postulación y enlaces de búsqueda directa a portales oficiales (LinkedIn, InfoJobs, Tecnoempleo, Indeed, Google Jobs).
     * Pitch personalizado ("Elevator Pitch") listo para enviar al recruiter.
     * 3-4 preguntas técnicas típicas de entrevista para preparar la prueba de selección.`;

      const contentsPayload: any[] = [];

      if (fileData && mimeType) {
        contentsPayload.push({
          inlineData: {
            data: fileData,
            mimeType: mimeType,
          },
        });
      }

      const userInstruction = `Analiza en profundidad el siguiente CV adjunto y genera el reporte completo en formato JSON estructurado según el schema especificado.
${preferences?.location ? `Preferencia de ubicación del candidato: ${preferences.location}` : ""}
${preferences?.modality ? `Preferencia de modalidad: ${preferences.modality}` : ""}
${cvText ? `\n--- CONTENIDO DEL CV ---\n${cvText}\n--- FIN DEL CV ---` : ""}
`;

      contentsPayload.push({ text: userInstruction });

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: contentsPayload,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              candidateInfo: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  email: { type: Type.STRING },
                  phone: { type: Type.STRING },
                  location: { type: Type.STRING },
                  linkedin: { type: Type.STRING },
                  headline: { type: Type.STRING },
                  summary: { type: Type.STRING },
                  seniorityLevel: { type: Type.STRING },
                  seniorityRationale: { type: Type.STRING },
                },
                required: ["name", "headline", "summary", "seniorityLevel", "seniorityRationale"],
              },
              techStack: {
                type: Type.OBJECT,
                properties: {
                  languages: { type: Type.ARRAY, items: { type: Type.STRING } },
                  frameworksAndLibraries: { type: Type.ARRAY, items: { type: Type.STRING } },
                  aiAndMl: { type: Type.ARRAY, items: { type: Type.STRING } },
                  toolsAndAutomation: { type: Type.ARRAY, items: { type: Type.STRING } },
                  dataAndDatabases: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ["languages", "frameworksAndLibraries", "aiAndMl", "toolsAndAutomation", "dataAndDatabases"],
              },
              specializations: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              experience: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    role: { type: Type.STRING },
                    company: { type: Type.STRING },
                    period: { type: Type.STRING },
                    highlights: { type: Type.ARRAY, items: { type: Type.STRING } },
                    keyTechnologies: { type: Type.ARRAY, items: { type: Type.STRING } },
                  },
                  required: ["role", "company", "period", "highlights", "keyTechnologies"],
                },
              },
              education: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    institution: { type: Type.STRING },
                    periodOrYear: { type: Type.STRING },
                    details: { type: Type.STRING },
                  },
                  required: ["title", "institution", "periodOrYear"],
                },
              },
              inferredCompetencies: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    competency: { type: Type.STRING },
                    deductionReason: { type: Type.STRING },
                  },
                  required: ["competency", "deductionReason"],
                },
              },
              languagesSpoken: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              gapsAndAdvice: {
                type: Type.OBJECT,
                properties: {
                  missingOrVagueDetails: { type: Type.ARRAY, items: { type: Type.STRING } },
                  cvOptimizationTips: { type: Type.ARRAY, items: { type: Type.STRING } },
                  recommendedCertificationsOrNextSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
                  marketDemandSummary: { type: Type.STRING },
                },
                required: ["missingOrVagueDetails", "cvOptimizationTips", "recommendedCertificationsOrNextSkills", "marketDemandSummary"],
              },
              recommendations: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    title: { type: Type.STRING },
                    company: { type: Type.STRING },
                    location: { type: Type.STRING },
                    workplaceType: { type: Type.STRING },
                    matchScore: { type: Type.NUMBER },
                    matchLevel: { type: Type.STRING },
                    salaryRange: { type: Type.STRING },
                    industry: { type: Type.STRING },
                    roleSummary: { type: Type.STRING },
                    keyResponsibilities: { type: Type.ARRAY, items: { type: Type.STRING } },
                    whyItFits: {
                      type: Type.OBJECT,
                      properties: {
                        matchingSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
                        matchingExperience: { type: Type.STRING },
                        technologiesInCommon: { type: Type.ARRAY, items: { type: Type.STRING } },
                      },
                      required: ["matchingSkills", "matchingExperience", "technologiesInCommon"],
                    },
                    partialGapsOrChallenges: { type: Type.STRING },
                    applicationInfo: {
                      type: Type.OBJECT,
                      properties: {
                        portalName: { type: Type.STRING },
                        searchQuery: { type: Type.STRING },
                        searchUrl: { type: Type.STRING },
                        applicationStrategy: { type: Type.STRING },
                      },
                      required: ["portalName", "searchQuery", "searchUrl", "applicationStrategy"],
                    },
                    tailoredPitch: { type: Type.STRING },
                    interviewPrep: { type: Type.ARRAY, items: { type: Type.STRING } },
                  },
                  required: [
                    "id", "title", "company", "location", "workplaceType", "matchScore",
                    "matchLevel", "salaryRange", "industry", "roleSummary", "keyResponsibilities",
                    "whyItFits", "partialGapsOrChallenges", "applicationInfo", "tailoredPitch", "interviewPrep"
                  ],
                },
              },
              overallMatchSummary: { type: Type.STRING },
            },
            required: [
              "candidateInfo",
              "techStack",
              "specializations",
              "experience",
              "education",
              "inferredCompetencies",
              "languagesSpoken",
              "gapsAndAdvice",
              "recommendations",
              "overallMatchSummary"
            ],
          },
        },
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("No se recibió respuesta del modelo de IA.");
      }

      const parsedData = JSON.parse(responseText);

      // Enhance search URLs if needed to guarantee functioning external links
      if (parsedData.recommendations && Array.isArray(parsedData.recommendations)) {
        parsedData.recommendations = parsedData.recommendations.map((rec: any, index: number) => {
          const query = encodeURIComponent(`${rec.title} ${rec.company} ${rec.location}`);
          const linkedinQuery = encodeURIComponent(`${rec.title} ${rec.location}`);
          return {
            ...rec,
            id: rec.id || `rec-${index + 1}`,
            applicationInfo: {
              ...rec.applicationInfo,
              linkedinSearchUrl: `https://www.linkedin.com/jobs/search/?keywords=${linkedinQuery}`,
              googleJobsUrl: `https://www.google.com/search?q=empleo+${query}`,
              infoJobsUrl: `https://www.infojobs.net/jobsearch/search-results/list.xhtml?keyword=${encodeURIComponent(rec.title)}`,
              tecnoempleoUrl: `https://www.tecnoempleo.com/ofertas-trabajo/?te=${encodeURIComponent(rec.title)}`,
            },
          };
        });
      }

      res.json(parsedData);
    } catch (error: any) {
      console.error("Error analyzing CV:", error);
      res.status(500).json({
        error: error?.message || "Ocurrió un error al procesar el CV con Gemini.",
      });
    }
  });

  // Custom Cover Letter / Tailored Application Generator
  app.post("/api/generate-application-letter", async (req, res) => {
    try {
      const { candidate, job, tone } = req.body;
      if (!candidate || !job) {
        return res.status(400).json({ error: "Faltan datos del candidato o del puesto." });
      }

      const ai = getGenAI();
      const prompt = `Actúa como un redactor profesional de candidaturas técnicas de alto impacto para ingenieros de software e IA.
Escribe una carta de presentación y un mensaje directo para recruiter en LinkedIn personalizados para:

CANDIDATO:
- Nombre: ${candidate.name}
- Titulación: ${candidate.headline}
- Experiencia clave: ${candidate.summary}
- Nivel: ${candidate.seniorityLevel}

PUESTO AL QUE SE POSTULA:
- Puesto: ${job.title} en ${job.company} (${job.location}, modalidad ${job.workplaceType})
- Requisitos y encaje: ${job.roleSummary}
- Tecnologías afines: ${job.whyItFits?.technologiesInCommon?.join(", ")}

Tono solicitado: ${tone || "Profesional, seguro y apasionado por la innovación técnica"}.

Genera un JSON con:
1. "coverLetter": Carta de presentación formal en Markdown lista para enviar por email o portal de empleo.
2. "linkedinMessage": Mensaje conciso de máximo 280 caracteres para conectar con el Headhunter/Engineering Lead en LinkedIn.
3. "keySellingPoints": 3 viñetas destacando por qué este candidato es la mejor contratación para este rol en concreto.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              coverLetter: { type: Type.STRING },
              linkedinMessage: { type: Type.STRING },
              keySellingPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["coverLetter", "linkedinMessage", "keySellingPoints"],
          },
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      res.json(parsed);
    } catch (error: any) {
      console.error("Error generating letter:", error);
      res.status(500).json({ error: error.message || "Error al generar la carta." });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
