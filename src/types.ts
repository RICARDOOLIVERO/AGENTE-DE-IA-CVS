export interface CandidateInfo {
  name: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  headline: string;
  summary: string;
  seniorityLevel: 'Junior' | 'Mid-level' | 'Senior' | 'Lead' | 'Specialist';
  seniorityRationale: string;
}

export interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  highlights: string[];
  keyTechnologies: string[];
}

export interface EducationItem {
  title: string;
  institution: string;
  periodOrYear: string;
  details?: string;
}

export interface InferredCompetency {
  competency: string;
  deductionReason: string;
}

export interface TechStackCategories {
  languages: string[];
  frameworksAndLibraries: string[];
  aiAndMl: string[];
  toolsAndAutomation: string[];
  dataAndDatabases: string[];
}

export interface JobRecommendation {
  id: string;
  title: string;
  company: string;
  location: string;
  workplaceType: 'Remoto' | 'Híbrido' | 'Presencial';
  matchScore: number; // 0 to 100
  matchLevel: 'Excelente (90%+)' | 'Muy Alto (80-89%)' | 'Alto (70-79%)' | 'Potencial / Transición';
  salaryRange: string;
  industry: string;
  roleSummary: string;
  keyResponsibilities: string[];
  whyItFits: {
    matchingSkills: string[];
    matchingExperience: string;
    technologiesInCommon: string[];
  };
  partialGapsOrChallenges: string;
  applicationInfo: {
    portalName: string;
    searchQuery: string;
    searchUrl: string;
    applicationStrategy: string;
  };
  tailoredPitch: string;
  interviewPrep: string[];
}

export interface GapsAndAdvice {
  missingOrVagueDetails: string[];
  cvOptimizationTips: string[];
  recommendedCertificationsOrNextSkills: string[];
  marketDemandSummary: string;
}

export interface CVAnalysisResult {
  candidateInfo: CandidateInfo;
  techStack: TechStackCategories;
  specializations: string[];
  experience: ExperienceItem[];
  education: EducationItem[];
  inferredCompetencies: InferredCompetency[];
  languagesSpoken: string[];
  gapsAndAdvice: GapsAndAdvice;
  recommendations: JobRecommendation[];
  overallMatchSummary: string;
}
