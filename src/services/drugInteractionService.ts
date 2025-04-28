
import { DrugEntry, PatientData, SafetyAssessmentResult, InteractionResult, RiskLevel } from '../types';

// This is a mock service to simulate drug interaction analysis
// In a real implementation, this would call an actual API or database

// Sample drug database
const drugDatabase = {
  "warfarin": {
    id: "warfarin",
    name: "Warfarin",
    genericName: "Warfarin",
    brandName: "Coumadin",
    description: "Anticoagulant used to prevent blood clots"
  },
  "aspirin": {
    id: "aspirin",
    name: "Aspirin",
    genericName: "Acetylsalicylic acid",
    brandName: "Bayer, Ecotrin",
    description: "Analgesic, anti-inflammatory, and antiplatelet medication"
  },
  "lisinopril": {
    id: "lisinopril",
    name: "Lisinopril",
    genericName: "Lisinopril",
    brandName: "Prinivil, Zestril",
    description: "ACE inhibitor used to treat high blood pressure"
  },
  "ibuprofen": {
    id: "ibuprofen",
    name: "Ibuprofen",
    genericName: "Ibuprofen",
    brandName: "Advil, Motrin",
    description: "NSAID used to treat pain and inflammation"
  },
  "metformin": {
    id: "metformin",
    name: "Metformin",
    genericName: "Metformin",
    brandName: "Glucophage",
    description: "Oral diabetes medication that helps control blood sugar levels"
  },
  "amiodarone": {
    id: "amiodarone",
    name: "Amiodarone",
    genericName: "Amiodarone",
    brandName: "Pacerone, Cordarone",
    description: "Antiarrhythmic medication used to treat irregular heartbeats"
  },
  "levothyroxine": {
    id: "levothyroxine",
    name: "Levothyroxine",
    genericName: "Levothyroxine",
    brandName: "Synthroid, Levoxyl",
    description: "Thyroid hormone replacement therapy"
  },
  "simvastatin": {
    id: "simvastatin",
    name: "Simvastatin",
    genericName: "Simvastatin",
    brandName: "Zocor",
    description: "HMG-CoA reductase inhibitor used to lower cholesterol"
  },
  "omeprazole": {
    id: "omeprazole", 
    name: "Omeprazole",
    genericName: "Omeprazole",
    brandName: "Prilosec",
    description: "Proton pump inhibitor used to reduce stomach acid"
  },
  "fluoxetine": {
    id: "fluoxetine",
    name: "Fluoxetine",
    genericName: "Fluoxetine",
    brandName: "Prozac",
    description: "Selective serotonin reuptake inhibitor (SSRI) antidepressant"
  }
};

// Sample interaction database (simplified)
const knownInteractions: Record<string, Record<string, InteractionResult>> = {
  "warfarin": {
    "aspirin": {
      drugPair: ["warfarin", "aspirin"],
      compatibilityStatus: "incompatible",
      riskLevel: "high",
      timeToOnset: "short-term",
      confidenceScore: 5,
      mechanism: "Additive antiplatelet and anticoagulant effects",
      effects: ["Increased bleeding risk", "Gastrointestinal bleeding", "Intracranial hemorrhage"],
      doseModification: "Consider reducing warfarin dose and monitor INR closely",
      monitoringParameters: ["INR", "Signs of bleeding", "Hemoglobin/hematocrit"],
      alternatives: ["Consider acetaminophen instead of aspirin for pain relief"],
      evidence: {
        literatureCitations: [
          {
            title: "Risk of bleeding with combined use of anticoagulants and antiplatelet agents: A systematic review and meta-analysis",
            authors: "Johnson A, et al.",
            journal: "Journal of Thrombosis and Hemostasis",
            year: 2023,
            url: "https://example.com/citation1"
          },
          {
            title: "Clinical outcomes associated with combined anticoagulant-antiplatelet therapy",
            authors: "Smith B, et al.",
            journal: "American Journal of Medicine",
            year: 2022,
            url: "https://example.com/citation2"
          }
        ],
        guidelines: [
          {
            organization: "American College of Cardiology",
            recommendation: "Use with caution; consider alternative pain relievers",
            year: 2024
          }
        ],
        regulatoryWarnings: [
          {
            organization: "FDA",
            warning: "Increased risk of serious bleeding when used in combination",
            date: "2024-01-15"
          }
        ]
      }
    },
    "amiodarone": {
      drugPair: ["warfarin", "amiodarone"],
      compatibilityStatus: "incompatible",
      riskLevel: "high",
      timeToOnset: "delayed",
      confidenceScore: 5,
      mechanism: "Amiodarone inhibits the metabolism of warfarin via CYP2C9 inhibition",
      effects: ["Prolonged PT/INR", "Increased bleeding risk"],
      doseModification: "Reduce warfarin dose by 30-50% and monitor INR closely",
      monitoringParameters: ["INR", "Signs of bleeding"],
      alternatives: ["Consider alternative antiarrhythmic therapy if appropriate"],
      evidence: {
        literatureCitations: [
          {
            title: "Amiodarone potentiates warfarin anticoagulation: Clinical implications",
            authors: "Zhang C, et al.",
            journal: "Circulation",
            year: 2022,
            url: "https://example.com/citation3"
          }
        ],
        guidelines: [
          {
            organization: "American Heart Association",
            recommendation: "Reduce warfarin dose when initiating amiodarone",
            year: 2023
          }
        ],
        regulatoryWarnings: [
          {
            organization: "FDA",
            warning: "Dose adjustment required for warfarin when used with amiodarone",
            date: "2023-08-12"
          }
        ]
      }
    }
  },
  "lisinopril": {
    "ibuprofen": {
      drugPair: ["lisinopril", "ibuprofen"],
      compatibilityStatus: "incompatible",
      riskLevel: "moderate",
      timeToOnset: "short-term",
      confidenceScore: 4,
      mechanism: "NSAIDs may reduce the antihypertensive and natriuretic effects of ACE inhibitors",
      effects: ["Reduced blood pressure control", "Increased risk of acute kidney injury", "Fluid retention"],
      doseModification: "Consider using the lowest effective dose of ibuprofen for the shortest duration",
      monitoringParameters: ["Blood pressure", "Renal function", "Signs of fluid retention"],
      alternatives: ["Acetaminophen may be a safer alternative for pain relief"],
      evidence: {
        literatureCitations: [
          {
            title: "NSAID and antihypertensive drug interactions: Clinical implications",
            authors: "Wilson D, et al.",
            journal: "Hypertension",
            year: 2023,
            url: "https://example.com/citation4"
          }
        ],
        guidelines: [
          {
            organization: "American Heart Association",
            recommendation: "Use NSAIDs cautiously with ACE inhibitors; monitor BP closely",
            year: 2024
          }
        ],
        regulatoryWarnings: []
      }
    }
  },
  "aspirin": {
    "warfarin": {
      drugPair: ["aspirin", "warfarin"],
      compatibilityStatus: "incompatible",
      riskLevel: "high",
      timeToOnset: "short-term",
      confidenceScore: 5,
      mechanism: "Additive antiplatelet and anticoagulant effects",
      effects: ["Increased bleeding risk", "Gastrointestinal bleeding", "Intracranial hemorrhage"],
      doseModification: "Consider reducing warfarin dose and monitor INR closely",
      monitoringParameters: ["INR", "Signs of bleeding", "Hemoglobin/hematocrit"],
      alternatives: ["Consider acetaminophen instead of aspirin for pain relief"],
      evidence: {
        literatureCitations: [
          {
            title: "Risk of bleeding with combined use of anticoagulants and antiplatelet agents: A systematic review and meta-analysis",
            authors: "Johnson A, et al.",
            journal: "Journal of Thrombosis and Hemostasis",
            year: 2023,
            url: "https://example.com/citation1"
          }
        ],
        guidelines: [
          {
            organization: "American College of Cardiology",
            recommendation: "Use with caution; consider alternative pain relievers",
            year: 2024
          }
        ],
        regulatoryWarnings: [
          {
            organization: "FDA",
            warning: "Increased risk of serious bleeding when used in combination",
            date: "2024-01-15"
          }
        ]
      }
    },
    "ibuprofen": {
      drugPair: ["aspirin", "ibuprofen"],
      compatibilityStatus: "incompatible",
      riskLevel: "moderate",
      timeToOnset: "short-term",
      confidenceScore: 4,
      mechanism: "Ibuprofen may interfere with the antiplatelet effects of low-dose aspirin",
      effects: ["Reduced cardioprotective effects of aspirin", "Increased risk of cardiovascular events"],
      doseModification: "Take aspirin at least 2 hours before ibuprofen",
      monitoringParameters: ["Cardiovascular status"],
      alternatives: ["Acetaminophen may be preferable for pain relief in patients taking low-dose aspirin"],
      evidence: {
        literatureCitations: [
          {
            title: "Effect of ibuprofen on cardioprotective effect of aspirin",
            authors: "Miller R, et al.",
            journal: "Clinical Pharmacology & Therapeutics",
            year: 2022,
            url: "https://example.com/citation5"
          }
        ],
        guidelines: [
          {
            organization: "American Heart Association",
            recommendation: "Separate administration times to minimize interference",
            year: 2023
          }
        ],
        regulatoryWarnings: [
          {
            organization: "FDA",
            warning: "Ibuprofen may diminish the cardioprotective effects of aspirin",
            date: "2023-05-20"
          }
        ]
      }
    }
  },
  "ibuprofen": {
    "aspirin": {
      drugPair: ["ibuprofen", "aspirin"],
      compatibilityStatus: "incompatible",
      riskLevel: "moderate",
      timeToOnset: "short-term",
      confidenceScore: 4,
      mechanism: "Ibuprofen may interfere with the antiplatelet effects of low-dose aspirin",
      effects: ["Reduced cardioprotective effects of aspirin", "Increased risk of cardiovascular events"],
      doseModification: "Take aspirin at least 2 hours before ibuprofen",
      monitoringParameters: ["Cardiovascular status"],
      alternatives: ["Acetaminophen may be preferable for pain relief in patients taking low-dose aspirin"],
      evidence: {
        literatureCitations: [
          {
            title: "Effect of ibuprofen on cardioprotective effect of aspirin",
            authors: "Miller R, et al.",
            journal: "Clinical Pharmacology & Therapeutics",
            year: 2022,
            url: "https://example.com/citation5"
          }
        ],
        guidelines: [
          {
            organization: "American Heart Association",
            recommendation: "Separate administration times to minimize interference",
            year: 2023
          }
        ],
        regulatoryWarnings: [
          {
            organization: "FDA",
            warning: "Ibuprofen may diminish the cardioprotective effects of aspirin",
            date: "2023-05-20"
          }
        ]
      }
    },
    "lisinopril": {
      drugPair: ["ibuprofen", "lisinopril"],
      compatibilityStatus: "incompatible",
      riskLevel: "moderate",
      timeToOnset: "short-term",
      confidenceScore: 4,
      mechanism: "NSAIDs may reduce the antihypertensive and natriuretic effects of ACE inhibitors",
      effects: ["Reduced blood pressure control", "Increased risk of acute kidney injury", "Fluid retention"],
      doseModification: "Consider using the lowest effective dose of ibuprofen for the shortest duration",
      monitoringParameters: ["Blood pressure", "Renal function", "Signs of fluid retention"],
      alternatives: ["Acetaminophen may be a safer alternative for pain relief"],
      evidence: {
        literatureCitations: [
          {
            title: "NSAID and antihypertensive drug interactions: Clinical implications",
            authors: "Wilson D, et al.",
            journal: "Hypertension",
            year: 2023,
            url: "https://example.com/citation4"
          }
        ],
        guidelines: [
          {
            organization: "American Heart Association",
            recommendation: "Use NSAIDs cautiously with ACE inhibitors; monitor BP closely",
            year: 2024
          }
        ],
        regulatoryWarnings: []
      }
    }
  },
  "amiodarone": {
    "warfarin": {
      drugPair: ["amiodarone", "warfarin"],
      compatibilityStatus: "incompatible",
      riskLevel: "high",
      timeToOnset: "delayed",
      confidenceScore: 5,
      mechanism: "Amiodarone inhibits the metabolism of warfarin via CYP2C9 inhibition",
      effects: ["Prolonged PT/INR", "Increased bleeding risk"],
      doseModification: "Reduce warfarin dose by 30-50% and monitor INR closely",
      monitoringParameters: ["INR", "Signs of bleeding"],
      alternatives: ["Consider alternative antiarrhythmic therapy if appropriate"],
      evidence: {
        literatureCitations: [
          {
            title: "Amiodarone potentiates warfarin anticoagulation: Clinical implications",
            authors: "Zhang C, et al.",
            journal: "Circulation",
            year: 2022,
            url: "https://example.com/citation3"
          }
        ],
        guidelines: [
          {
            organization: "American Heart Association",
            recommendation: "Reduce warfarin dose when initiating amiodarone",
            year: 2023
          }
        ],
        regulatoryWarnings: [
          {
            organization: "FDA",
            warning: "Dose adjustment required for warfarin when used with amiodarone",
            date: "2023-08-12"
          }
        ]
      }
    },
    "simvastatin": {
      drugPair: ["amiodarone", "simvastatin"],
      compatibilityStatus: "incompatible",
      riskLevel: "high",
      timeToOnset: "delayed",
      confidenceScore: 5,
      mechanism: "Amiodarone inhibits CYP3A4, increasing simvastatin plasma concentrations",
      effects: ["Increased risk of myopathy and rhabdomyolysis"],
      doseModification: "Limit simvastatin to 20mg daily when used with amiodarone",
      monitoringParameters: ["Muscle pain/weakness", "Creatine kinase", "Liver enzymes"],
      alternatives: ["Consider pravastatin or rosuvastatin, which are less affected by this interaction"],
      evidence: {
        literatureCitations: [
          {
            title: "Drug-drug interactions with statins: Clinical significance and management",
            authors: "Brown T, et al.",
            journal: "Clinical Pharmacokinetics",
            year: 2024,
            url: "https://example.com/citation6"
          }
        ],
        guidelines: [
          {
            organization: "American College of Cardiology",
            recommendation: "Limit simvastatin dosage with amiodarone coadministration",
            year: 2023
          }
        ],
        regulatoryWarnings: [
          {
            organization: "FDA",
            warning: "Dose limitations for simvastatin when used with amiodarone",
            date: "2022-11-18"
          }
        ]
      }
    }
  },
  "simvastatin": {
    "amiodarone": {
      drugPair: ["simvastatin", "amiodarone"],
      compatibilityStatus: "incompatible",
      riskLevel: "high",
      timeToOnset: "delayed",
      confidenceScore: 5,
      mechanism: "Amiodarone inhibits CYP3A4, increasing simvastatin plasma concentrations",
      effects: ["Increased risk of myopathy and rhabdomyolysis"],
      doseModification: "Limit simvastatin to 20mg daily when used with amiodarone",
      monitoringParameters: ["Muscle pain/weakness", "Creatine kinase", "Liver enzymes"],
      alternatives: ["Consider pravastatin or rosuvastatin, which are less affected by this interaction"],
      evidence: {
        literatureCitations: [
          {
            title: "Drug-drug interactions with statins: Clinical significance and management",
            authors: "Brown T, et al.",
            journal: "Clinical Pharmacokinetics",
            year: 2024,
            url: "https://example.com/citation6"
          }
        ],
        guidelines: [
          {
            organization: "American College of Cardiology",
            recommendation: "Limit simvastatin dosage with amiodarone coadministration",
            year: 2023
          }
        ],
        regulatoryWarnings: [
          {
            organization: "FDA",
            warning: "Dose limitations for simvastatin when used with amiodarone",
            date: "2022-11-18"
          }
        ]
      }
    }
  }
};

// Function to determine risk level priority
const getRiskPriority = (risk: RiskLevel): number => {
  const priorities: Record<RiskLevel, number> = {
    'none': 0,
    'low': 1,
    'moderate': 2,
    'high': 3,
    'critical': 4
  };
  return priorities[risk];
};

export const analyzeDrugInteractions = (
  drugs: DrugEntry[], 
  patientData?: PatientData
): SafetyAssessmentResult => {
  // Validate minimum of 2 drugs
  if (drugs.length < 2) {
    throw new Error("At least 2 drugs are required for interaction analysis");
  }

  // Check for interactions between all drug pairs
  const interactionResults: InteractionResult[] = [];
  let highestRiskLevel: RiskLevel = 'none';
  let isCompatible = true;

  for (let i = 0; i < drugs.length; i++) {
    for (let j = i + 1; j < drugs.length; j++) {
      const drug1 = drugs[i];
      const drug2 = drugs[j];

      // Normalize drug names (lowercase to match keys)
      const drug1Key = drug1.drugId.toLowerCase();
      const drug2Key = drug2.drugId.toLowerCase();

      // Check if interaction exists in our database
      let interaction: InteractionResult | undefined;
      
      if (knownInteractions[drug1Key]?.[drug2Key]) {
        interaction = knownInteractions[drug1Key][drug2Key];
      } else if (knownInteractions[drug2Key]?.[drug1Key]) {
        interaction = knownInteractions[drug2Key][drug1Key];
      }

      if (interaction) {
        // Add interaction to results
        interactionResults.push(interaction);
        
        // Check compatibility and risk
        if (interaction.compatibilityStatus === 'incompatible') {
          isCompatible = false;
        }

        // Update highest risk level
        if (getRiskPriority(interaction.riskLevel) > getRiskPriority(highestRiskLevel)) {
          highestRiskLevel = interaction.riskLevel;
        }
      } else {
        // No known interaction - add a compatible result
        interactionResults.push({
          drugPair: [drug1.drugName, drug2.drugName],
          compatibilityStatus: 'compatible',
          riskLevel: 'none',
          timeToOnset: 'immediate',
          confidenceScore: 3,
          mechanism: "No known interaction mechanism",
          effects: ["No known adverse interaction effects"],
          evidence: {
            literatureCitations: [
              {
                title: "Database of drug interactions",
                authors: "National Formulary",
                journal: "National Drug Database",
                year: 2024,
              }
            ]
          }
        });
      }
    }
  }

  // Consider patient data if provided (simplified implementation)
  // In a real system, this would apply more complex clinical logic
  if (patientData) {
    // Example: Adjust risk for elderly patients
    if (patientData.age && patientData.age > 65) {
      if (highestRiskLevel === 'moderate') {
        highestRiskLevel = 'high';
      } else if (highestRiskLevel === 'low') {
        highestRiskLevel = 'moderate';
      }
    }
    
    // Example: Adjust for renal impairment
    if (patientData.clinicalParameters?.eGFR && patientData.clinicalParameters.eGFR < 60) {
      if (highestRiskLevel === 'moderate') {
        highestRiskLevel = 'high';
      } else if (highestRiskLevel === 'low') {
        highestRiskLevel = 'moderate';
      }
    }
  }

  return {
    interactionResults,
    overallCompatibilityStatus: isCompatible ? 'compatible' : 'incompatible',
    overallRiskLevel: highestRiskLevel,
    databaseVersion: "1.0.0",
    lastUpdated: "2025-04-28" // Current date set in the role
  };
};

export const getDrugSuggestions = (query: string) => {
  // Simplified implementation: return filtered drugs based on the query
  query = query.toLowerCase();
  return Object.values(drugDatabase).filter(drug => 
    drug.name.toLowerCase().includes(query) || 
    (drug.genericName && drug.genericName.toLowerCase().includes(query)) ||
    (drug.brandName && drug.brandName.toLowerCase().includes(query))
  );
};

export const getAllDrugs = () => {
  return Object.values(drugDatabase);
};

export const getDrugById = (id: string) => {
  return drugDatabase[id.toLowerCase()];
};
