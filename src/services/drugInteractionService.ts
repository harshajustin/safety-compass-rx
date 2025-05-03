
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
  patientData: PatientData,
  foodItems: string[] = [],
  alcoholData: { hasInteraction: boolean, details?: string } = { hasInteraction: false }
) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Extract drug IDs
  const drugIds = drugs
    .filter(drug => drug.drugId)
    .map(drug => drug.drugId);
    
  // Find drug-drug interactions
  const drugInteractions = [];
  
  for (let i = 0; i < drugIds.length; i++) {
    for (let j = i + 1; j < drugIds.length; j++) {
      const drug1 = getDrugById(drugIds[i]);
      const drug2 = getDrugById(drugIds[j]);
      
      if (drug1 && drug2) {
        if (drug1.interactions.includes(drug2.id) || drug2.interactions.includes(drug1.id)) {
          drugInteractions.push({
            severity: "Moderate",
            description: `Potential interaction between ${drug1.name} and ${drug2.name}`,
            recommendation: "Monitor for adverse effects and adjust dosage if necessary."
          });
        }
      }
    }
  }

  // Find food interactions
  const foodInteractions = [];
  for (const drugId of drugIds) {
    const interactingFoods = foodInteractionDatabase[drugId] || [];
    
    // Check if any of the provided food items interact with the drug
    const matchingFoods = interactingFoods.filter(food => 
      foodItems.some(item => item.toLowerCase() === food.toLowerCase())
    );
    
    if (matchingFoods.length > 0) {
      const drug = getDrugById(drugId);
      if (drug) {
        foodInteractions.push({
          severity: "Moderate", 
          description: `${drug.name} may interact with: ${matchingFoods.join(', ')}`,
          recommendation: "Consider taking this medication at least 2 hours before or after consuming these foods."
        });
      }
    }
  }

  // Check for alcohol interactions
  const alcoholInteractions = [];
  if (alcoholData.hasInteraction) {
    const interactingDrugs = drugIds.filter(id => alcoholInteractionDatabase.includes(id))
      .map(id => getDrugById(id))
      .filter(Boolean)
      .map(drug => drug.name);
    
    if (interactingDrugs.length > 0) {
      alcoholInteractions.push({
        severity: "High",
        description: `Alcohol may interact with: ${interactingDrugs.join(', ')}`,
        recommendation: "Avoid alcohol consumption when taking these medications."
      });
    }
  }
  
  // Check for patient-specific risk factors
  const patientRisks = [];
  
  // Age-related risks (simplified example)
  if (patientData.age && patientData.age > 65) {
    const higherRiskDrugs = drugs
      .filter(drug => ['drug1', 'drug4', 'drug10'].includes(drug.drugId))
      .map(drug => getDrugById(drug.drugId)?.name)
      .filter(Boolean);
    
    if (higherRiskDrugs.length > 0) {
      patientRisks.push({
        severity: "Moderate",
        description: `Higher sensitivity to ${higherRiskDrugs.join(', ')} in patients over 65.`,
        recommendation: "Consider reduced dosage and monitor more frequently."
      });
    }
  }
  
  // Kidney function related risks
  if (patientData.clinicalParameters?.eGFR && patientData.clinicalParameters.eGFR < 60) {
    const renallyExcretedDrugs = drugs
      .filter(drug => ['drug4', 'drug6'].includes(drug.drugId))
      .map(drug => getDrugById(drug.drugId)?.name)
      .filter(Boolean);
    
    if (renallyExcretedDrugs.length > 0) {
      patientRisks.push({
        severity: "High",
        description: `Reduced renal clearance may affect ${renallyExcretedDrugs.join(', ')}.`,
        recommendation: "Consider dose adjustment based on eGFR."
      });
    }
  }

  return {
    drugInteractions,
    foodInteractions,
    alcoholInteractions,
    patientRisks,
    overallRisk: calculateOverallRisk(drugInteractions, foodInteractions, alcoholInteractions, patientRisks),
  };
};

/**
 * Calculate the overall risk level based on all interactions
 */
const calculateOverallRisk = (drugInteractions, foodInteractions, alcoholInteractions, patientRisks) => {
  const allInteractions = [
    ...drugInteractions, 
    ...foodInteractions,
    ...alcoholInteractions,
    ...patientRisks
  ];
  
  const hasHigh = allInteractions.some(interaction => interaction.severity === "High");
  const hasModerate = allInteractions.some(interaction => interaction.severity === "Moderate");
  
  if (hasHigh) return "High";
  if (hasModerate) return "Moderate";
  if (allInteractions.length > 0) return "Low";
  return "None";
};
