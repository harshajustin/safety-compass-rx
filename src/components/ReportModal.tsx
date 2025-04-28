import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { SafetyAssessmentResult } from '@/types';
import { FileDown, FileText, Printer } from 'lucide-react';

type ReportModalProps = {
  results: SafetyAssessmentResult;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const ReportModal: React.FC<ReportModalProps> = ({ results, open, onOpenChange }) => {
  if (!results) return null;

  const {
    interactionResults,
    overallRiskLevel,
    overallCompatibilityStatus,
    databaseVersion,
    lastUpdated,
  } = results;

  const handlePrint = () => {
    window.print();
  };

  const getDateFormatted = () => {
    const today = new Date();
    return today.toLocaleDateString('en-US', {
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    });
  };

  const getRiskLevelColor = (risk: string) => {
    switch (risk) {
      case 'none': return 'text-risk-none';
      case 'low': return 'text-risk-low';
      case 'moderate': return 'text-risk-moderate';
      case 'high': return 'text-risk-high';
      case 'critical': return 'text-risk-critical';
      default: return 'text-gray-500';
    }
  };

  const handlePdfExport = async () => {
    const element = document.getElementById('report-printable');
    if (!element) return;

    try {
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
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Drug Interaction Analysis Report</DialogTitle>
          <div className="flex justify-end gap-2 mt-2">
            <Button onClick={handlePdfExport} variant="outline" size="sm" className="flex items-center gap-1">
              <FileDown className="h-4 w-4" />
              <span>Export PDF</span>
            </Button>
            <Button onClick={handlePrint} variant="outline" size="sm" className="flex items-center gap-1">
              <Printer className="h-4 w-4" />
              <span>Print</span>
            </Button>
          </div>
        </DialogHeader>

        <div className="report-container p-6" id="report-printable">
          <div className="border-b pb-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-medical-blue">Drug Interaction Analysis Report</h1>
              <div className="text-right">
                <div className="text-sm text-gray-500">Report Generated:</div>
                <div className="font-medium">{getDateFormatted()}</div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-bold mb-4">Safety Assessment Summary</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">Compatibility Status</div>
                <div className={`text-lg font-bold ${overallCompatibilityStatus === 'compatible' ? 'text-green-600' : 'text-red-600'}`}>
                  {overallCompatibilityStatus.charAt(0).toUpperCase() + overallCompatibilityStatus.slice(1)}
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">Overall Risk Level</div>
                <div className={`text-lg font-bold ${getRiskLevelColor(overallRiskLevel)}`}>
                  {overallRiskLevel.charAt(0).toUpperCase() + overallRiskLevel.slice(1)}
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">Database Version</div>
                <div className="text-lg font-medium">{databaseVersion}</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">Last Updated</div>
                <div className="text-lg font-medium">{lastUpdated}</div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Detailed Interaction Analysis</h2>
            
            {interactionResults.map((interaction, index) => (
              <div key={index} className="mb-8 border rounded-lg p-4 page-break-inside-avoid">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 pb-2 border-b">
                  <h3 className="text-lg font-bold">
                    {interaction.drugPair[0]} + {interaction.drugPair[1]}
                  </h3>
                  <div className="flex items-center gap-2 mt-2 md:mt-0">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskLevelColor(interaction.riskLevel)} bg-opacity-10 border border-current`}>
                      {interaction.riskLevel.charAt(0).toUpperCase() + interaction.riskLevel.slice(1)} Risk
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${interaction.compatibilityStatus === 'compatible' ? 'text-green-600' : 'text-red-600'} bg-opacity-10 border border-current`}>
                      {interaction.compatibilityStatus.charAt(0).toUpperCase() + interaction.compatibilityStatus.slice(1)}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Time to Onset</div>
                    <div className="font-medium">
                      {interaction.timeToOnset === 'immediate' && 'Immediate (<24h)'}
                      {interaction.timeToOnset === 'short-term' && 'Short-term (1-7d)'}
                      {interaction.timeToOnset === 'delayed' && 'Delayed (>7d)'}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Confidence Score</div>
                    <div className="font-medium">
                      {interaction.confidenceScore}/5
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-sm font-medium text-gray-500 mb-1">Interaction Mechanism</div>
                  <p>{interaction.mechanism}</p>
                </div>

                <div className="mb-4">
                  <div className="text-sm font-medium text-gray-500 mb-1">Effects</div>
                  <ul className="list-disc pl-5">
                    {interaction.effects.map((effect, idx) => (
                      <li key={idx}>{effect}</li>
                    ))}
                  </ul>
                </div>

                {interaction.doseModification && (
                  <div className="mb-4">
                    <div className="text-sm font-medium text-gray-500 mb-1">Dose Modification</div>
                    <p>{interaction.doseModification}</p>
                  </div>
                )}

                {interaction.monitoringParameters && interaction.monitoringParameters.length > 0 && (
                  <div className="mb-4">
                    <div className="text-sm font-medium text-gray-500 mb-1">Monitoring Parameters</div>
                    <ul className="list-disc pl-5">
                      {interaction.monitoringParameters.map((param, idx) => (
                        <li key={idx}>{param}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {interaction.alternatives && interaction.alternatives.length > 0 && (
                  <div className="mb-4">
                    <div className="text-sm font-medium text-gray-500 mb-1">Alternative Therapy Options</div>
                    <ul className="list-disc pl-5">
                      {interaction.alternatives.map((alt, idx) => (
                        <li key={idx}>{alt}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-4">
                  <div className="text-sm font-medium text-gray-500 mb-1">Evidence Sources</div>
                  {interaction.evidence.literatureCitations && interaction.evidence.literatureCitations.length > 0 && (
                    <div className="mb-2">
                      <div className="text-xs font-medium text-gray-500">Literature Citations:</div>
                      <ul className="list-disc pl-5 text-sm">
                        {interaction.evidence.literatureCitations.map((citation, idx) => (
                          <li key={idx}>
                            {citation.authors}. {citation.title}. {citation.journal}. {citation.year}.
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {interaction.evidence.guidelines && interaction.evidence.guidelines.length > 0 && (
                    <div className="mb-2">
                      <div className="text-xs font-medium text-gray-500">Clinical Guidelines:</div>
                      <ul className="list-disc pl-5 text-sm">
                        {interaction.evidence.guidelines.map((guideline, idx) => (
                          <li key={idx}>
                            {guideline.organization} ({guideline.year}): {guideline.recommendation}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {interaction.evidence.regulatoryWarnings && interaction.evidence.regulatoryWarnings.length > 0 && (
                    <div className="mb-2">
                      <div className="text-xs font-medium text-gray-500">Regulatory Warnings:</div>
                      <ul className="list-disc pl-5 text-sm">
                        {interaction.evidence.regulatoryWarnings.map((warning, idx) => (
                          <li key={idx}>
                            {warning.organization} ({warning.date}): {warning.warning}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-4 border-t text-sm text-gray-500">
            <p className="mb-2">
              <strong>Disclaimer:</strong> This report is provided for informational purposes only and should not replace professional medical advice. Always consult with qualified healthcare providers regarding medication decisions.
            </p>
            <p>
              Generated using Drug Interaction Analysis and Safety System (DIASS) | Database Version: {databaseVersion} | Last Updated: {lastUpdated}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReportModal;
