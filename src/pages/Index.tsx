
import React, { useState } from 'react';
import DrugInput from '@/components/DrugInput';
import PatientInput from '@/components/PatientInput';
import InteractionResults from '@/components/InteractionResults';
import ReportModal from '@/components/ReportModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import { useToast } from '@/components/ui/use-toast';
import { DrugEntry, PatientData, SafetyAssessmentResult } from '@/types';
import { analyzeDrugInteractions } from '@/services/drugInteractionService';
import { Search, AlertTriangle, FileText, Info } from 'lucide-react';

const Index = () => {
  const [drugs, setDrugs] = useState<DrugEntry[]>([]);
  const [patientData, setPatientData] = useState<PatientData>({});
  const [analysisResults, setAnalysisResults] = useState<SafetyAssessmentResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPatientDataExpanded, setIsPatientDataExpanded] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const { toast } = useToast();

  const handleAnalyze = () => {
    try {
      // Validate inputs
      if (drugs.length < 2) {
        toast({
          title: "Input Error",
          description: "Please enter at least two drugs for analysis.",
          variant: "destructive",
        });
        return;
      }

      // Check if drug names are provided
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
      
      // Simulate API call with a short delay
      setTimeout(() => {
        try {
          const results = analyzeDrugInteractions(drugs, patientData);
          setAnalysisResults(results);
          
          // Show toast notification based on results
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

  const handleGenerateReport = () => {
    setIsReportModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-medical-blue text-white p-4 md:p-6">
        <div className="container mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Drug Interaction Analysis and Safety System</h1>
          <p className="text-blue-100">Analyze potential drug interactions and safety concerns</p>
        </div>
      </header>

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
            onGenerateReport={handleGenerateReport}
          />
        )}

        {/* Educational Info Section */}
        <Card className="mt-8 border shadow">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Info className="h-5 w-5 text-medical-blue" />
              About Drug Interaction Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-600 space-y-4">
              <p>
                Drug interactions occur when a drug's effectiveness or toxicity is altered by the presence of another drug, food, or supplement. These interactions can potentially decrease drug efficacy, increase toxicity, or have other adverse effects.
              </p>
              <p>
                The Drug Interaction Analysis and Safety System (DIASS) evaluates potential interactions between medications by analyzing their pharmacokinetic and pharmacodynamic properties. The system provides risk assessments based on clinical evidence and current medical guidelines.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <h4 className="font-medium text-medical-blue mb-1">Risk Level Classification</h4>
                  <ul className="list-disc pl-5">
                    <li><span className="font-medium text-risk-none">None</span> - No known interaction</li>
                    <li><span className="font-medium text-risk-low">Low</span> - Minor interaction, typically no intervention required</li>
                    <li><span className="font-medium text-risk-moderate">Moderate</span> - May require monitoring or dose adjustment</li>
                    <li><span className="font-medium text-risk-high">High</span> - Significant interaction, may require therapy modification</li>
                    <li><span className="font-medium text-risk-critical">Critical</span> - Potentially life-threatening, avoid combination</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-medical-blue mb-1">Evidence Quality</h4>
                  <p>The confidence score (1-5) reflects the quality and consistency of evidence supporting the interaction:</p>
                  <ul className="list-disc pl-5">
                    <li><span className="font-medium">5</span> - Multiple high-quality studies</li>
                    <li><span className="font-medium">4</span> - Well-documented clinical evidence</li>
                    <li><span className="font-medium">3</span> - Limited clinical evidence</li>
                    <li><span className="font-medium">2</span> - Case reports or theoretical concerns</li>
                    <li><span className="font-medium">1</span> - Limited or conflicting data</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-md flex gap-3">
          <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-gray-700">
            <p className="font-medium mb-1">Medical Disclaimer</p>
            <p>
              This tool is provided for informational purposes only and should not replace professional medical advice. 
              Always consult with a qualified healthcare provider regarding medication decisions. 
              The analysis is based on available data and may not account for all possible drug interactions or individual patient factors.
            </p>
          </div>
        </div>

      </main>

      <footer className="bg-gray-100 border-t p-6 mt-12">
        <div className="container mx-auto text-center text-sm text-gray-500">
          <p>Drug Interaction Analysis and Safety System (DIASS) © 2025</p>
          <p className="mt-1">Database Version: {analysisResults?.databaseVersion || '1.0.0'} | Last Updated: {analysisResults?.lastUpdated || '2025-04-28'}</p>
        </div>
      </footer>

      {/* Report Modal */}
      {analysisResults && (
        <ReportModal 
          results={analysisResults}
          open={isReportModalOpen}
          onOpenChange={setIsReportModalOpen}
        />
      )}

      {/* Global styling for reports - Fix the style tag by removing jsx and global attributes */}
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
