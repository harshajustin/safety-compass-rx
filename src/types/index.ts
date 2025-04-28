
// Types for the Drug Interaction Analysis and Safety System

export type Drug = {
  id: string;
  name: string;
  genericName?: string;
  brandName?: string;
  description?: string;
};

export type PatientData = {
  age?: number;
  sex?: 'male' | 'female' | 'other';
  weight?: number; // in kg
  height?: number; // in cm
  clinicalParameters?: {
    eGFR?: number;
    liverEnzymes?: {
      alt?: number;
      ast?: number;
    };
    bloodPressure?: {
      systolic?: number;
      diastolic?: number;
    };
  };
  medicalHistory?: {
    conditions?: string[];
    allergies?: string[];
    adverseReactions?: string[];
  };
  currentMedications?: string[];
  supplements?: string[];
};

export type DrugEntry = {
  drugId: string;
  drugName: string;
  dosage: string;
  route: string;
  frequency: string;
};

export type RiskLevel = 'none' | 'low' | 'moderate' | 'high' | 'critical';
export type TimeToOnset = 'immediate' | 'short-term' | 'delayed';

export type InteractionResult = {
  drugPair: [string, string];
  compatibilityStatus: 'compatible' | 'incompatible';
  riskLevel: RiskLevel;
  timeToOnset: TimeToOnset;
  confidenceScore: 1 | 2 | 3 | 4 | 5;
  mechanism: string;
  effects: string[];
  doseModification?: string;
  monitoringParameters?: string[];
  alternatives?: string[];
  evidence: {
    literatureCitations: Array<{
      title: string;
      authors: string;
      journal: string;
      year: number;
      url?: string;
    }>;
    guidelines?: Array<{
      organization: string;
      recommendation: string;
      year: number;
    }>;
    regulatoryWarnings?: Array<{
      organization: string;
      warning: string;
      date: string;
    }>;
  };
};

export type SafetyAssessmentResult = {
  interactionResults: InteractionResult[];
  databaseVersion: string;
  lastUpdated: string;
  overallRiskLevel: RiskLevel;
  overallCompatibilityStatus: 'compatible' | 'incompatible';
};

export type AnalysisRequest = {
  drugs: DrugEntry[];
  patientData?: PatientData;
};
