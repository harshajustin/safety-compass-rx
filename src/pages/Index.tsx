
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import DrugInput from '@/components/DrugInput';
import PatientInput from '@/components/PatientInput';
import { DrugEntry, PatientData } from '@/types';
import InteractionResults from '@/components/InteractionResults';
import FooterSection from '@/components/FooterSection';
import { analyzeInteractions } from '@/services/drugInteractionService';
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  // State for drugs
  const [drugs, setDrugs] = useState<DrugEntry[]>([{ 
    drugId: "", 
    drugName: "", 
    dosage: "", 
    route: "", 
    frequency: "" 
  }]);
  
  // New state for food and alcohol interactions
  const [foodInteractions, setFoodInteractions] = useState<string[]>([]);
  const [alcoholInteractions, setAlcoholInteractions] = useState(false);
  const [alcoholDetails, setAlcoholDetails] = useState("");

  // Patient info
  const [patientData, setPatientData] = useState<PatientData>({});
  const [patientInfoExpanded, setPatientInfoExpanded] = useState(false);
  
  // Results
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  
  const { toast } = useToast();

  const handleAnalyze = async () => {
    // Validate at least one drug name is entered
    const validDrugs = drugs.filter(drug => drug.drugName.trim().length > 0);
    
    if (validDrugs.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please enter at least one drug name.",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Include food and alcohol interactions in the analysis
      const analysisResults = await analyzeInteractions(
        validDrugs, 
        patientData, 
        foodInteractions,
        alcoholInteractions ? { hasInteraction: true, details: alcoholDetails } : { hasInteraction: false }
      );
      
      setResults(analysisResults);
      setShowResults(true);
      
      // Scroll to results
      setTimeout(() => {
        const resultsElement = document.getElementById('results-section');
        if (resultsElement) {
          resultsElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while analyzing interactions. Please try again.",
        variant: "destructive",
      });
      console.error("Analysis error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setDrugs([{ drugId: "", drugName: "", dosage: "", route: "", frequency: "" }]);
    setFoodInteractions([]);
    setAlcoholInteractions(false);
    setAlcoholDetails("");
    setPatientData({});
    setResults(null);
    setShowResults(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Drug Interaction Analyzer</h1>
          
          <div className="mb-8">
            <DrugInput 
              drugs={drugs} 
              onChange={setDrugs}
              foodInteractions={foodInteractions}
              onFoodInteractionsChange={setFoodInteractions}
              alcoholInteractions={alcoholInteractions}
              onAlcoholInteractionsChange={setAlcoholInteractions}
              alcoholDetails={alcoholDetails}
              onAlcoholDetailsChange={setAlcoholDetails}
            />
            
            <PatientInput
              patientData={patientData}
              onChange={setPatientData}
              isExpanded={patientInfoExpanded}
              onToggleExpand={() => setPatientInfoExpanded(!patientInfoExpanded)}
            />
            
            <div className="flex flex-col sm:flex-row gap-4 justify-end mt-8">
              <Button
                variant="outline"
                onClick={handleReset}
              >
                Reset
              </Button>
              <Button
                onClick={handleAnalyze}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Analyze Interactions"
                )}
              </Button>
            </div>
          </div>
          
          {showResults && (
            <div id="results-section">
              <InteractionResults results={results} />
            </div>
          )}
        </div>
      </div>
      <FooterSection />
    </div>
  );
};

export default Index;
