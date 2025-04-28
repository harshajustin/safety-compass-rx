import React, { useState, useEffect } from 'react';
import DrugInput from '@/components/DrugInput';
import PatientInput from '@/components/PatientInput';
import InteractionResults from '@/components/InteractionResults';
import ReportModal from '@/components/ReportModal';
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
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const sampleDrugs = [
      { drugId: "123", drugName: "Warfarin", dosage: "5mg", route: "oral", frequency: "daily" },
      { drugId: "456", drugName: "Aspirin", dosage: "81mg", route: "oral", frequency: "daily" }
    ];
    
    const samplePatientData = {
      age: 65,
      sex: 'male' as const,
      weight: 70,
      height: 175,
      clinicalParameters: {
        eGFR: 75,
        liverEnzymes: {
          alt: 30,
          ast: 28
        },
        bloodPressure: {
          systolic: 130,
          diastolic: 85
        }
      },
      medicalHistory: {
        conditions: ["Hypertension", "Atrial Fibrillation"],
        allergies: ["Penicillin"],
        adverseReactions: ["Rash with sulfa drugs"]
      },
      currentMedications: ["Metoprolol", "Atorvastatin"],
      supplements: ["Vitamin D", "Calcium"]
    };

    setDrugs(sampleDrugs);
    setPatientData(samplePatientData);
    handleAnalyzeWithDelay();
  }, []);

  const handleAnalyzeWithDelay = () => {
    setTimeout(() => {
      handleAnalyze();
    }, 500);
  };

  const handleAnalyze = () => {
    try {
      if (drugs.length < 2) {
        toast({
          title: "Input Error",
          description: "Please enter at least two drugs for analysis.",
          variant: "destructive",
        });
        return;
      }

      const missingDrugs = drugs.filter(drug => !drug.drugId || !drug.drugName);
      if (missingDrugs.length > 0) {
        toast({
          title: "Input Error",
          description: "Please provide a name for all drugs.",
          variant: "destructive",
        });
        return;
      }

      setIsLoading(true);
      
      setTimeout(() => {
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
      }, 1500);
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

  const generatePDF = async () => {
    try {
      const element = document.getElementById('report-printable');
      if (!element) return;

      const { jsPDF } = await import('jspdf');
      const { default: html2canvas } = await import('html2canvas');

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('drug-interaction-report.pdf');

      toast({
        title: "Success",
        description: "PDF report has been generated and downloaded",
        variant: "default",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error",
        description: "Failed to generate PDF report",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderSection />

      <main className="container mx-auto px-4 py-8">
        <Card className="mb-8 border-2 shadow-md">
          <CardHeader>
            <CardTitle>Enter Drug and Patient Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <DrugInput drugs={drugs} onChange={setDrugs} />
              
              <PatientInput 
                patientData={patientData} 
                onChange={setPatientData}
                isExpanded={isPatientDataExpanded}
                onToggleExpand={() => setIsPatientDataExpanded(!isPatientDataExpanded)}
              />

              <div className="flex flex-col sm:flex-row gap-4 justify-end mt-6">
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
                  className="bg-medical-blue hover:bg-medical-navy flex items-center gap-2"
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
            </div>
          </CardContent>
        </Card>

        {analysisResults && (
          <InteractionResults 
            results={analysisResults} 
            onGenerateReport={() => setIsReportModalOpen(true)}
          />
        )}

        <EducationalInfo />
        <DisclaimerSection />
      </main>

      <FooterSection results={analysisResults} />

      {analysisResults && (
        <ReportModal 
          results={analysisResults}
          open={isReportModalOpen}
          onOpenChange={setIsReportModalOpen}
        />
      )}

      <style>
        {`
        @media print {
          body * {
            visibility: hidden;
          }
          #report-printable, #report-printable * {
            visibility: visible;
          }
          #report-printable {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .page-break-inside-avoid {
            page-break-inside: avoid;
          }
        }
        `}
      </style>
    </div>
  );
};

export default Index;
