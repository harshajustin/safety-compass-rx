import { DrugEntry, PatientData } from "@/types";

// Mock database of drugs
const drugDatabase = [
  { id: "drug1", name: "Warfarin", interactions: ["drug2", "drug5"] },
  { id: "drug2", name: "Aspirin", interactions: ["drug1", "drug3"] },
  { id: "drug3", name: "Ibuprofen", interactions: ["drug2", "drug4"] },
  { id: "drug4", name: "Lisinopril", interactions: ["drug3", "drug6"] },
  { id: "drug5", name: "Simvastatin", interactions: ["drug1", "drug6"] },
  { id: "drug6", name: "Metformin", interactions: ["drug4", "drug5"] },
  { id: "drug7", name: "Levothyroxine", interactions: ["drug8"] },
  { id: "drug8", name: "Amlodipine", interactions: ["drug7"] },
  { id: "drug9", name: "Omeprazole", interactions: ["drug10"] },
  { id: "drug10", name: "Metoprolol", interactions: ["drug9"] }
];

// Mock food interactions database
const foodInteractionDatabase = {
  "drug1": ["Grapefruit", "Leafy greens"],  // Warfarin
  "drug2": ["Alcohol"],                      // Aspirin
  "drug5": ["Grapefruit"],                  // Simvastatin
  "drug7": ["High-fat foods", "Coffee"]      // Levothyroxine
};

// Mock alcohol interactions database
const alcoholInteractionDatabase = [
  "drug2",  // Aspirin
  "drug3",  // Ibuprofen
  "drug4",  // Lisinopril
  "drug10"  // Metoprolol
];

/**
 * Get all drugs from the database
 */
export const getAllDrugs = () => {
  return drugDatabase;
};

/**
 * Get a drug by ID
 * @param id - Drug ID to find
 */
export const getDrugById = (id: string) => {
  return drugDatabase.find(drug => drug.id === id);
};

/**
 * Get drug suggestions based on a search query
 * @param query - Search query
 */
export const getDrugSuggestions = (query: string) => {
  const lowerQuery = query.toLowerCase();
  return drugDatabase.filter(drug => 
    drug.name.toLowerCase().includes(lowerQuery)
  );
};

/**
 * Analyze drug interactions
 * @param drugs - List of drugs to analyze
 * @param patientData - Patient data for context
 * @param foodItems - Food items to check for interactions
 * @param alcoholData - Alcohol interaction data
 */
export const analyzeInteractions = async (
  drugs: DrugEntry[],
  patientData: PatientData = {},
  foodItems: string[] = [],
  alcohol: { hasInteraction: boolean; details?: string } = { hasInteraction: false }
) => {
  // Simplified mock API call
  // In a real app, this would be an API call to a backend service
  
  console.log("Analyzing interactions for:", { drugs, patientData, foodItems, alcohol });
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Generate interaction results
  const results = generateAnalysisResults(drugs, patientData, foodItems, alcohol);
  
  return results;
};

// Generate mock analysis results based on input data
function generateAnalysisResults(
  drugs: DrugEntry[],
  patientData: PatientData,
  foodItems: string[],
  alcohol: { hasInteraction: boolean; details?: string }
) {
  const drugPairs = generateDrugPairs(drugs);
  
  const drugInteractions = drugPairs.map(pair => generateDrugInteraction(pair, patientData));
  
  const foodInteractions = generateFoodInteractions(drugs, foodItems);
  
  const alcoholInteractions = alcohol.hasInteraction 
    ? generateAlcoholInteractions(drugs) 
    : [];
  
  const patientRisks = generatePatientRisks(drugs, patientData);
  
  // Determine overall risk level based on all interactions
  const allInteractions = [...drugInteractions, ...foodInteractions, ...alcoholInteractions, ...patientRisks];
  const overallRiskLevel = determineOverallRisk(allInteractions);
  
  return {
    drugInteractions,
    foodInteractions,
    alcoholInteractions,
    patientRisks,
    overallRisk: overallRiskLevel,
    overallCompatibilityStatus: overallRiskLevel === 'high' ? 'incompatible' : 'compatible',
    databaseVersion: '2025.4',
    lastUpdated: 'April 15, 2025',
    patientData,
    drugEntries: drugs,
    interactionResults: drugInteractions.map(interaction => ({
      drugPair: interaction.description.split(' and '),
      riskLevel: interaction.severity,
      compatibilityStatus: interaction.severity === 'high' ? 'incompatible' : 'compatible',
      timeToOnset: ['immediate', 'short-term', 'delayed'][Math.floor(Math.random() * 3)],
      confidenceScore: Math.floor(Math.random() * 3) + 3, // 3-5 score
      mechanism: interaction.mechanism || "Unknown mechanism",
      effects: interaction.effects || ["May increase risk of bleeding", "May affect drug metabolism"],
      doseModification: interaction.doseModification || "Consider dose adjustment",
      monitoringParameters: interaction.monitoringParameters || ["Regular blood tests", "Monitor for side effects"],
      alternatives: interaction.alternatives || ["Alternative therapy may be considered"],
      evidence: {
        literatureCitations: [
          {
            authors: "Smith et al.",
            title: "Drug interaction study",
            journal: "Journal of Clinical Pharmacy",
            year: "2023"
          }
        ],
        guidelines: [
          {
            organization: "American College of Cardiology",
            year: "2024",
            recommendation: "Use caution when combining these medications"
          }
        ],
        regulatoryWarnings: [
          {
            organization: "FDA",
            date: "2024-01-15",
            warning: "Black box warning for severe interaction"
          }
        ]
      }
    }))
  };
}

// Generate all possible drug pairs for interaction checking
function generateDrugPairs(drugs: DrugEntry[]): [DrugEntry, DrugEntry][] {
  const pairs: [DrugEntry, DrugEntry][] = [];
  for (let i = 0; i < drugs.length; i++) {
    for (let j = i + 1; j < drugs.length; j++) {
      pairs.push([drugs[i], drugs[j]]);
    }
  }
  return pairs;
}

// Generate a mock drug interaction based on drug pair
function generateDrugInteraction(
  pair: [DrugEntry, DrugEntry],
  patientData: PatientData
) {
  const [drug1, drug2] = pair;
  const severityOptions = ['low', 'moderate', 'high'];
  
  // Pre-defined known interactions for demo
  const knownInteractions: Record<string, any> = {
    'warfarin-aspirin': {
      severity: 'high',
      description: `${drug1.drugName} and ${drug2.drugName}`,
      recommendation: `Concurrent use of ${drug1.drugName} and ${drug2.drugName} increases bleeding risk. Monitor INR closely and consider alternative therapy.`,
      mechanism: "Synergistic anticoagulant effects leading to increased bleeding risk",
      effects: ["Increased risk of bleeding", "Potential gastrointestinal hemorrhage", "Increased INR values"],
      doseModification: "Consider reducing warfarin dose by 25-30% and monitor INR more frequently",
      monitoringParameters: ["INR", "Signs of bleeding", "Hemoglobin/hematocrit"],
      alternatives: ["Consider acetaminophen instead of aspirin for pain relief", "Low-dose aspirin may be continued with close monitoring if benefits outweigh risks"]
    },
    'warfarin-lisinopril': {
      severity: 'low',
      description: `${drug1.drugName} and ${drug2.drugName}`,
      recommendation: `No significant interaction between ${drug1.drugName} and ${drug2.drugName}. Monitor blood pressure regularly.`,
      mechanism: "No major pharmacokinetic or pharmacodynamic interaction",
      effects: ["Minimal effect on anticoagulant activity", "No significant impact on blood pressure control"],
      monitoringParameters: ["Routine INR monitoring", "Blood pressure"]
    },
    'aspirin-lisinopril': {
      severity: 'moderate',
      description: `${drug1.drugName} and ${drug2.drugName}`,
      recommendation: `${drug1.drugName} may reduce the antihypertensive effect of ${drug2.drugName}. Monitor blood pressure more frequently.`,
      mechanism: "NSAIDs like aspirin may inhibit prostaglandin synthesis, reducing the antihypertensive effects of ACE inhibitors",
      effects: ["Potential reduction in blood pressure control", "Possible reduction in renal function"],
      monitoringParameters: ["Blood pressure", "Renal function tests", "Signs of fluid retention"],
      alternatives: ["Consider acetaminophen for pain relief if appropriate"]
    }
  };
  
  // Check for known interactions
  const drugPairKey1 = `${drug1.drugName.toLowerCase()}-${drug2.drugName.toLowerCase()}`;
  const drugPairKey2 = `${drug2.drugName.toLowerCase()}-${drug1.drugName.toLowerCase()}`;
  
  if (knownInteractions[drugPairKey1]) {
    return knownInteractions[drugPairKey1];
  } else if (knownInteractions[drugPairKey2]) {
    return knownInteractions[drugPairKey2];
  }
  
  // Generate random interaction if not predefined
  const severity = severityOptions[Math.floor(Math.random() * 3)];
  
  return {
    severity,
    description: `${drug1.drugName} and ${drug2.drugName}`,
    recommendation: `Interaction between ${drug1.drugName} and ${drug2.drugName} is of ${severity} risk. ${severity === 'high' ? 'Consider alternative therapy.' : severity === 'moderate' ? 'Monitor patient closely.' : 'No special precautions needed.'}`
  };
}

// Generate food interaction warnings
function generateFoodInteractions(drugs: DrugEntry[], foodItems: string[]) {
  if (!foodItems || foodItems.length === 0) return [];
  
  const interactions = [];
  
  // Known drug-food interactions for demo
  const knownInteractions: Record<string, Record<string, any>> = {
    'warfarin': {
      'grapefruit': {
        severity: 'moderate',
        description: 'Warfarin and Grapefruit',
        recommendation: 'Grapefruit juice may increase warfarin concentration. Maintain consistent vitamin K intake and avoid large changes in consumption of green leafy vegetables.'
      },
      'green leafy vegetables': {
        severity: 'moderate',
        description: 'Warfarin and Green leafy vegetables',
        recommendation: 'Foods rich in vitamin K reduce warfarin effectiveness. Maintain consistent intake of green leafy vegetables throughout therapy.'
      }
    },
    'lisinopril': {
      'grapefruit': {
        severity: 'low',
        description: 'Lisinopril and Grapefruit',
        recommendation: 'No significant interaction between Lisinopril and grapefruit has been documented.'
      }
    }
  };
  
  // Generate food interactions
  for (const drug of drugs) {
    const drugName = drug.drugName.toLowerCase();
    if (knownInteractions[drugName]) {
      for (const food of foodItems) {
        const foodName = food.toLowerCase();
        if (knownInteractions[drugName][foodName]) {
          interactions.push(knownInteractions[drugName][foodName]);
        }
      }
    }
  }
  
  // Add a generic food interaction if none were found
  if (interactions.length === 0 && foodItems.length > 0) {
    interactions.push({
      severity: 'low',
      description: `Food interaction`,
      recommendation: `No significant interactions between the prescribed medications and ${foodItems.join(', ')} have been documented. Continue regular eating habits.`
    });
  }
  
  return interactions;
}

// Generate alcohol interaction warnings
function generateAlcoholInteractions(drugs: DrugEntry[]) {
  const interactions = [];
  
  // Known drug-alcohol interactions for demo
  const knownInteractions: Record<string, any> = {
    'warfarin': {
      severity: 'high',
      description: 'Warfarin and Alcohol',
      recommendation: 'Alcohol may increase warfarin\'s anticoagulant effect and bleeding risk. Limit alcohol consumption while on warfarin therapy.'
    },
    'aspirin': {
      severity: 'moderate',
      description: 'Aspirin and Alcohol',
      recommendation: 'Combined use of aspirin and alcohol increases risk of gastrointestinal bleeding. Avoid alcohol or limit consumption to occasional use.'
    },
    'lisinopril': {
      severity: 'moderate',
      description: 'Lisinopril and Alcohol',
      recommendation: 'Alcohol may enhance the hypotensive effects of Lisinopril. Limit alcohol consumption and monitor blood pressure carefully.'
    }
  };
  
  // Check for known drug-alcohol interactions
  for (const drug of drugs) {
    const drugName = drug.drugName.toLowerCase();
    if (knownInteractions[drugName]) {
      interactions.push(knownInteractions[drugName]);
    }
  }
  
  // Add a generic alcohol interaction if none were found
  if (interactions.length === 0) {
    interactions.push({
      severity: 'moderate',
      description: 'Medication and Alcohol Interaction',
      recommendation: 'Alcohol consumption while taking medications may cause drowsiness, dizziness, or affect medication metabolism. Limit alcohol consumption while taking these medications.'
    });
  }
  
  return interactions;
}

// Generate patient-specific risk factors
function generatePatientRisks(drugs: DrugEntry[], patientData: PatientData) {
  if (Object.keys(patientData).length === 0) return [];
  
  const risks = [];
  
  // Check age-related risks
  if (patientData.age && patientData.age > 65) {
    const warfarin = drugs.some(drug => drug.drugName.toLowerCase() === 'warfarin');
    if (warfarin) {
      risks.push({
        severity: 'moderate',
        description: 'Increased Warfarin Sensitivity in Elderly',
        recommendation: 'Elderly patients may be more sensitive to warfarin effects. Consider starting with a lower dose and monitor INR more frequently.'
      });
    }
    
    risks.push({
      severity: 'low',
      description: 'Age-related Changes in Drug Metabolism',
      recommendation: 'Elderly patients may have altered drug metabolism. Monitor for increased side effects and consider dose adjustments as needed.'
    });
  }
  
  // Check kidney function risks
  if (patientData.clinicalParameters?.eGFR && patientData.clinicalParameters.eGFR < 60) {
    risks.push({
      severity: 'moderate',
      description: 'Reduced Renal Function',
      recommendation: 'Patient has reduced kidney function (eGFR < 60 mL/min/1.73m²). Consider dose adjustments for renally cleared medications.'
    });
  }
  
  // Check liver function risks
  if (patientData.clinicalParameters?.liverEnzymes?.alt && patientData.clinicalParameters.liverEnzymes.alt > 40) {
    risks.push({
      severity: 'moderate',
      description: 'Elevated Liver Enzymes',
      recommendation: 'Patient has elevated ALT. Monitor liver function tests and assess for drug-induced liver injury.'
    });
  }
  
  // Check blood pressure risks
  if (patientData.clinicalParameters?.bloodPressure?.systolic && patientData.clinicalParameters.bloodPressure.systolic > 140) {
    risks.push({
      severity: 'low',
      description: 'Elevated Blood Pressure',
      recommendation: 'Patient has elevated blood pressure. Monitor BP regularly and optimize antihypertensive therapy.'
    });
  }
  
  // Check for specific conditions
  if (patientData.medicalHistory?.conditions) {
    // Check for diabetes
    if (patientData.medicalHistory.conditions.some(c => c.toLowerCase().includes('diabetes'))) {
      const aspirin = drugs.some(drug => drug.drugName.toLowerCase() === 'aspirin');
      if (aspirin) {
        risks.push({
          severity: 'low',
          description: 'Diabetes and Aspirin',
          recommendation: 'Low-dose aspirin may be beneficial for cardiovascular risk reduction in diabetic patients with additional risk factors.'
        });
      }
    }
    
    // Check for atrial fibrillation
    if (patientData.medicalHistory.conditions.some(c => c.toLowerCase().includes('atrial fibrillation'))) {
      const warfarin = drugs.some(drug => drug.drugName.toLowerCase() === 'warfarin');
      if (warfarin) {
        risks.push({
          severity: 'low',
          description: 'Warfarin for Atrial Fibrillation',
          recommendation: 'Warfarin is appropriate for stroke prevention in atrial fibrillation. Target INR is typically 2.0-3.0.'
        });
      }
    }
  }
  
  return risks;
}

// Determine overall risk level based on all interactions
function determineOverallRisk(interactions: Array<{ severity: string }>) {
  if (interactions.some(i => i.severity === 'high')) {
    return 'high';
  } else if (interactions.some(i => i.severity === 'moderate')) {
    return 'moderate';
  } else if (interactions.some(i => i.severity === 'low')) {
    return 'low';
  } else {
    return 'none';
  }
}
