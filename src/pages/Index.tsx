import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DrugInput from '@/components/DrugInput';
import PatientInput from '@/components/PatientInput';
import InteractionResults from '@/components/InteractionResults';
import HeaderSection from '@/components/HeaderSection';
import EducationalInfo from '@/components/EducationalInfo';
import DisclaimerSection from '@/components/DisclaimerSection';
import FooterSection from '@/components/FooterSection';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { DrugEntry, PatientData, SafetyAssessmentResult } from '@/types';
import { analyzeDrugInteractions } from '@/services/drugInteractionService';
import { Search } from 'lucide-react';

const Index = () => {
  const [drugs, setDrugs] = useState<DrugEntry[]>([]);
  const [patientData, setPatientData] = useState<PatientData>({});
  const [analysisResults, setAnalysisResults] = useState<SafetyAssessmentResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPatientDataExpanded, setIsPatientDataExpanded] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const loadSampleData = () => {
    const sampleDrugs = [
      { drugId: "123", drugName: "Warfarin", dosage: "5mg", route: "oral", frequency: "daily" },
      { drugId: "456", drugName: "Aspirin", dosage: "81mg", route: "oral", frequency: "daily" }
    ];
    const samplePatientData = {
      age: 65,
      sex: 'male' as const,
      weight: 70,
      height: 175,
      clinicalParameters: { eGFR: 75, liverEnzymes: { alt: 30, ast: 28 }, bloodPressure: { systolic: 130, diastolic: 85 } },
      medicalHistory: { conditions: ["Hypertension", "Atrial Fibrillation"], allergies: ["Penicillin"], adverseReactions: ["Rash with sulfa drugs"] },
      currentMedications: ["Metoprolol", "Atorvastatin"],
      supplements: ["Vitamin D", "Calcium"]
    };
    setDrugs(sampleDrugs);
    setPatientData(samplePatientData);
    setAnalysisResults(null);
    setIsPatientDataExpanded(true);
    toast({
      title: "Sample Data Loaded",
      description: "Warfarin, Aspirin, and sample patient data have been loaded.",
    });
  };

  const handleAnalyze = () => {
    try {
      // Check 1: Minimum two drugs
      if (drugs.length < 2) {
        toast({
          title: "Input Error",
          description: "Please enter at least two drugs for analysis.",
          variant: "destructive",
        });
        return;
      }

      // Check 2: All entered drugs must have a name/ID (implying selection)
      const invalidDrugs = drugs.filter(drug => !drug.drugId || !drug.drugName);
      if (invalidDrugs.length > 0) {
        toast({
          title: "Input Error",
          // description: "Please provide a name for all drugs.",
          description: `Please ensure all ${invalidDrugs.length > 1 ? 'drugs have been selected' : 'drug has been selected'} from the suggestion list.`, 
          variant: "destructive",
        });
        return;
      }

      // Validation passed (for drug list), proceed with analysis
      setIsLoading(true);
      
      try {
        const results = analyzeDrugInteractions(drugs, patientData);
        setAnalysisResults(results);
        
        if (results.overallCompatibilityStatus === 'incompatible' && 
            (results.overallRiskLevel === 'high' || results.overallRiskLevel === 'critical')) {
          toast({
            title: "High Risk Interaction Detected",
            description: "One or more serious drug interactions were found. Review results carefully.",
            variant: "destructive",
          });
        } else if (results.overallCompatibilityStatus === 'incompatible' && 
                  results.overallRiskLevel === 'moderate') {
          toast({
            title: "Moderate Risk Interaction Detected",
            description: "Potential drug interactions were found. Review results for more information.",
            variant: "default",
          });
        } else if (results.overallCompatibilityStatus === 'compatible') {
          toast({
            title: "Analysis Complete",
            description: "No significant interactions detected between the selected drugs.",
            variant: "default",
          });
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error analyzing drug interactions:', error);
        toast({
          title: "Analysis Error",
          description: "An error occurred while analyzing drug interactions. Please try again.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error in handleAnalyze:', error);
      toast({
        title: "Unexpected Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setDrugs([]);
    setPatientData({});
    setAnalysisResults(null);
  };

  const handleNavigateToReport = () => {
    if (analysisResults) {
      navigate('/report', { state: { analysisResults } });
    } else {
      toast({
        title: "Error",
        description: "Analysis results are not available yet.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-gray-50 to-gray-100">
      <HeaderSection />

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-end mb-4">
           <Button variant="link" onClick={loadSampleData} className="text-sm">
             Load Sample Data
           </Button>
        </div>
        <Card className="mb-8 border-2 shadow-md">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Enter Drug and Patient Information</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Use grid layout for medium screens and up */}
            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 space-y-6 md:space-y-0">
              {/* Drug Input Section */}
              <div className="space-y-4">
                 <h3 className="text-lg font-medium mb-2">Medications</h3>
                 <DrugInput drugs={drugs} onChange={setDrugs} />
              </div>
              
              {/* Patient Input Section */}
              <div className="space-y-4">
                 <h3 className="text-lg font-medium mb-2">Patient Details (Optional)</h3>
                 <PatientInput 
                    patientData={patientData} 
                    onChange={setPatientData}
                    isExpanded={isPatientDataExpanded}
                    onToggleExpand={() => setIsPatientDataExpanded(!isPatientDataExpanded)}
                 />
              </div>
            </div>

            {/* Buttons moved outside the grid, but still inside CardContent */}
            <div className="flex flex-col sm:flex-row gap-4 justify-end mt-8 pt-6 border-t">
              <Button
                variant="outline"
                onClick={handleReset}
                disabled={isLoading || (!drugs.length && !Object.keys(patientData).length)}
              >
                Clear All
              </Button>
              <Button 
                onClick={handleAnalyze} 
                disabled={isLoading || drugs.length < 2} 
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4" />
                    <span>Analyze Interactions</span>
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {analysisResults && (
          <InteractionResults 
            results={analysisResults} 
            onGenerateReport={handleNavigateToReport}
          />
        )}

        <EducationalInfo />
        <DisclaimerSection />
      </main>

      <FooterSection results={analysisResults} />
    </div>
  );
};

export default Index;
