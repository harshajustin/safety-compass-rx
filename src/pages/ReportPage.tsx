
import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { SafetyAssessmentResult, PatientData, DrugEntry } from '@/types';
import { Download, Printer } from 'lucide-react';

// Helper function to format date
const getDateFormatted = () => {
  const today = new Date();
  return today.toLocaleDateString('en-US', {
    year: 'numeric', 
    month: 'long', 
    day: 'numeric'
  });
};

// Helper function for risk level colors
const getRiskLevelColor = (risk: string) => {
  switch (risk) {
    case 'none': return 'text-risk-none'; // Ensure these CSS classes exist or adjust
    case 'low': return 'text-risk-low';
    case 'moderate': return 'text-risk-moderate';
    case 'high': return 'text-risk-high';
    case 'critical': return 'text-risk-critical';
    default: return 'text-gray-500';
  }
};

const ReportPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const reportContentRef = useRef<HTMLDivElement>(null);

  const results = location.state?.analysisResults as SafetyAssessmentResult | undefined;

  useEffect(() => {
    if (!results) {
      console.error('No analysis results found for report page. Redirecting.');
      toast({ title: "Error", description: "Could not load report data.", variant: "destructive" });
      navigate('/');
    }
  }, [results, navigate, toast]);

  const generatePDF = async () => {
    const element = reportContentRef.current;
    if (!element || !results) {
      toast({ title: "Error", description: "Could not find report content to generate PDF.", variant: "destructive" });
      return;
    }
    toast({ title: "Generating PDF", description: "Please wait...", variant: "default" });
    try {
      const canvas = await html2canvas(element, { scale: 2, useCORS: true, logging: false });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`drug-interaction-report-${new Date().toISOString().split('T')[0]}.pdf`);
      toast({ title: "Success", description: "PDF report generated and downloaded.", variant: "default" });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({ title: "Error", description: "Failed to generate PDF report.", variant: "destructive" });
    }
  };

  const handlePrint = () => {
    setTimeout(() => {
        window.print();
    }, 100);
  };

  if (!results) {
    return <div className="container mx-auto p-4">Loading report data...</div>;
  }

  // Destructure results for easier access
  const {
    interactionResults,
    overallRiskLevel,
    overallCompatibilityStatus,
    databaseVersion,
    lastUpdated,
    patientData,
    drugEntries,
  } = results;

  // Function to render patient information if available
  const renderPatientInformation = () => {
    if (!patientData) return null;
    
    return (
      <div className="mt-6">
        <h3 className="text-xl font-bold mb-4">Patient Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border">
          {patientData.name && (
            <div>
              <span className="text-sm text-gray-500">Name:</span>
              <div className="font-medium">{patientData.name}</div>
            </div>
          )}
          
          {patientData.age && (
            <div>
              <span className="text-sm text-gray-500">Age:</span>
              <div className="font-medium">{patientData.age} years</div>
            </div>
          )}
          
          {patientData.sex && (
            <div>
              <span className="text-sm text-gray-500">Sex:</span>
              <div className="font-medium capitalize">{patientData.sex}</div>
            </div>
          )}
          
          {patientData.weight && (
            <div>
              <span className="text-sm text-gray-500">Weight:</span>
              <div className="font-medium">{patientData.weight} kg</div>
            </div>
          )}
          
          {patientData.height && (
            <div>
              <span className="text-sm text-gray-500">Height:</span>
              <div className="font-medium">{patientData.height} cm</div>
            </div>
          )}
          
          {/* Clinical Parameters */}
          {patientData.clinicalParameters && Object.keys(patientData.clinicalParameters).length > 0 && (
            <div className="col-span-1 md:col-span-2">
              <div className="text-sm font-medium text-gray-700 mb-2">Clinical Parameters</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {patientData.clinicalParameters.eGFR !== undefined && (
                  <div>
                    <span className="text-sm text-gray-500">eGFR:</span>
                    <div className="font-medium">{patientData.clinicalParameters.eGFR} mL/min/1.73m²</div>
                  </div>
                )}
                
                {patientData.clinicalParameters.liverEnzymes && (
                  <>
                    {patientData.clinicalParameters.liverEnzymes.alt !== undefined && (
                      <div>
                        <span className="text-sm text-gray-500">ALT:</span>
                        <div className="font-medium">{patientData.clinicalParameters.liverEnzymes.alt} U/L</div>
                      </div>
                    )}
                    {patientData.clinicalParameters.liverEnzymes.ast !== undefined && (
                      <div>
                        <span className="text-sm text-gray-500">AST:</span>
                        <div className="font-medium">{patientData.clinicalParameters.liverEnzymes.ast} U/L</div>
                      </div>
                    )}
                  </>
                )}
                
                {patientData.clinicalParameters.bloodPressure && (
                  <div>
                    <span className="text-sm text-gray-500">Blood Pressure:</span>
                    <div className="font-medium">
                      {patientData.clinicalParameters.bloodPressure.systolic}/{patientData.clinicalParameters.bloodPressure.diastolic} mmHg
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Medical History */}
          {patientData.medicalHistory && (
            <div className="col-span-1 md:col-span-2">
              <div className="text-sm font-medium text-gray-700 mb-2">Medical History</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {patientData.medicalHistory.conditions && patientData.medicalHistory.conditions.length > 0 && (
                  <div>
                    <span className="text-sm text-gray-500">Conditions:</span>
                    <ul className="list-disc pl-5 text-sm">
                      {patientData.medicalHistory.conditions.map((condition, idx) => (
                        <li key={idx}>{condition}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {patientData.medicalHistory.allergies && patientData.medicalHistory.allergies.length > 0 && (
                  <div>
                    <span className="text-sm text-gray-500">Allergies:</span>
                    <ul className="list-disc pl-5 text-sm">
                      {patientData.medicalHistory.allergies.map((allergy, idx) => (
                        <li key={idx}>{allergy}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {patientData.medicalHistory.adverseReactions && patientData.medicalHistory.adverseReactions.length > 0 && (
                  <div>
                    <span className="text-sm text-gray-500">Adverse Reactions:</span>
                    <ul className="list-disc pl-5 text-sm">
                      {patientData.medicalHistory.adverseReactions.map((reaction, idx) => (
                        <li key={idx}>{reaction}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Medications */}
          {patientData.currentMedications && patientData.currentMedications.length > 0 && (
            <div className="col-span-1 md:col-span-2">
              <div className="text-sm font-medium text-gray-700 mb-2">Current Medications</div>
              <div className="flex flex-wrap gap-2">
                {patientData.currentMedications.map((med, idx) => (
                  <span key={idx} className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-sm">
                    {med}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Supplements */}
          {patientData.supplements && patientData.supplements.length > 0 && (
            <div className="col-span-1 md:col-span-2">
              <div className="text-sm font-medium text-gray-700 mb-2">Supplements</div>
              <div className="flex flex-wrap gap-2">
                {patientData.supplements.map((sup, idx) => (
                  <span key={idx} className="bg-green-50 text-green-700 px-2 py-1 rounded-full text-sm">
                    {sup}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Function to render drug entries if available
  const renderDrugEntries = () => {
    if (!drugEntries || drugEntries.length === 0) return null;
    
    return (
      <div className="mt-6">
        <h3 className="text-xl font-bold mb-4">Drug Information</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Drug Name</th>
                <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dosage</th>
                <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frequency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {drugEntries.map((drug, index) => (
                <tr key={index}>
                  <td className="py-2 px-3 whitespace-nowrap">{drug.drugName}</td>
                  <td className="py-2 px-3 whitespace-nowrap">{drug.dosage || 'Not specified'}</td>
                  <td className="py-2 px-3 whitespace-nowrap capitalize">{drug.route || 'Not specified'}</td>
                  <td className="py-2 px-3 whitespace-nowrap">{drug.frequency || 'Not specified'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Actual report content rendering, adapted from ReportModal
  const renderReportContent = () => {
    return (
      <>
        <div className="border-b pb-4 mb-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-medical-blue">Drug Interaction Analysis Report</h2>
            <div className="text-right">
              <div className="text-sm text-gray-500">Report Generated:</div>
              <div className="font-medium">{getDateFormatted()}</div>
            </div>
          </div>
        </div>

        {/* Patient Information Section */}
        {renderPatientInformation()}
        
        {/* Drug Information Section */}
        {renderDrugEntries()}

        <div className="mt-6">
          <h3 className="text-xl font-bold mb-4">Safety Assessment Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-gray-50 rounded-lg border">
              <div className="text-sm text-gray-500 mb-1">Compatibility Status</div>
              <div className={`text-lg font-bold ${overallCompatibilityStatus === 'compatible' ? 'text-green-600' : 'text-red-600'}`}>
                {overallCompatibilityStatus.charAt(0).toUpperCase() + overallCompatibilityStatus.slice(1)}
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg border">
              <div className="text-sm text-gray-500 mb-1">Overall Risk Level</div>
              <div className={`text-lg font-bold ${getRiskLevelColor(overallRiskLevel)}`}>
                {overallRiskLevel.charAt(0).toUpperCase() + overallRiskLevel.slice(1)}
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg border">
              <div className="text-sm text-gray-500 mb-1">Database Version</div>
              <div className="text-lg font-medium">{databaseVersion}</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg border">
              <div className="text-sm text-gray-500 mb-1">Last Updated</div>
              <div className="text-lg font-medium">{lastUpdated}</div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">Detailed Interaction Analysis</h3>
          
          {interactionResults.map((interaction, index) => (
            <div key={index} className="mb-8 border rounded-lg p-4 bg-white shadow-sm page-break-inside-avoid">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 pb-2 border-b">
                <h4 className="text-lg font-bold">
                  {interaction.drugPair[0]} + {interaction.drugPair[1]}
                </h4>
                <div className="flex items-center gap-2 mt-2 md:mt-0 flex-wrap">
                  <span className={`pdf-badge risk-${interaction.riskLevel}`}>
                    {interaction.riskLevel.charAt(0).toUpperCase() + interaction.riskLevel.slice(1)} Risk
                  </span>
                  <span className={`pdf-badge status-${interaction.compatibilityStatus}`}>
                    {interaction.compatibilityStatus.charAt(0).toUpperCase() + interaction.compatibilityStatus.slice(1)}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Time to Onset</div>
                  <div className="font-medium text-sm">
                    {interaction.timeToOnset === 'immediate' && 'Immediate (<24h)'}
                    {interaction.timeToOnset === 'short-term' && 'Short-term (1-7d)'}
                    {interaction.timeToOnset === 'delayed' && 'Delayed (>7d)'}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Confidence Score</div>
                  <div className="font-medium text-sm">
                    {interaction.confidenceScore}/5
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <div className="text-sm font-semibold text-gray-700 mb-1">Mechanism</div>
                <p className="text-sm">{interaction.mechanism}</p>
              </div>

              <div className="mb-4">
                <div className="text-sm font-semibold text-gray-700 mb-1">Effects</div>
                <ul className="list-disc pl-5 text-sm">
                  {interaction.effects.map((effect, idx) => (
                    <li key={idx}>{effect}</li>
                  ))}
                </ul>
              </div>

              {interaction.doseModification && (
                <div className="mb-4">
                  <div className="text-sm font-semibold text-gray-700 mb-1">Dose Modification</div>
                  <p className="text-sm">{interaction.doseModification}</p>
                </div>
              )}

              {interaction.monitoringParameters && interaction.monitoringParameters.length > 0 && (
                <div className="mb-4">
                  <div className="text-sm font-semibold text-gray-700 mb-1">Monitoring Parameters</div>
                  <ul className="list-disc pl-5 text-sm">
                    {interaction.monitoringParameters.map((param, idx) => (
                      <li key={idx}>{param}</li>
                    ))}
                  </ul>
                </div>
              )}

              {interaction.alternatives && interaction.alternatives.length > 0 && (
                <div className="mb-4">
                  <div className="text-sm font-semibold text-gray-700 mb-1">Alternative Therapy</div>
                  <ul className="list-disc pl-5 text-sm">
                    {interaction.alternatives.map((alt, idx) => (
                      <li key={idx}>{alt}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-4 pt-4 border-t">
                <div className="text-sm font-semibold text-gray-700 mb-2">Evidence Sources</div>
                {interaction.evidence.literatureCitations && interaction.evidence.literatureCitations.length > 0 && (
                  <div className="mb-2">
                    <div className="text-xs font-medium text-gray-500">Literature:</div>
                    <ul className="list-disc pl-5 text-xs">
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
                    <div className="text-xs font-medium text-gray-500">Guidelines:</div>
                    <ul className="list-disc pl-5 text-xs">
                      {interaction.evidence.guidelines.map((guideline, idx) => (
                        <li key={idx}>{guideline.organization} ({guideline.year}): {guideline.recommendation}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {interaction.evidence.regulatoryWarnings && interaction.evidence.regulatoryWarnings.length > 0 && (
                  <div className="mb-2">
                    <div className="text-xs font-medium text-gray-500">Warnings:</div>
                    <ul className="list-disc pl-5 text-xs">
                      {interaction.evidence.regulatoryWarnings.map((warning, idx) => (
                        <li key={idx}>{warning.organization} ({warning.date}): {warning.warning}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8 print:p-0 print:bg-white">
      {/* Add specific styles for PDF rendering AND Print */}
      <style>
        {`
          @media print {
            /* Hide everything except the printable area */
            body > *:not(#report-printable-wrapper) {
              display: none !important;
            }
            #report-printable-wrapper,
            #report-printable {
              display: block !important;
              margin: 0 !important;
              padding: 0 !important;
              box-shadow: none !important;
              border: none !important;
            }
            /* Ensure full width */
            #report-printable {
              width: 100%;
            }
             /* Ensure background colors print */
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            /* Hide buttons in print view */
            .no-print {
              display: none !important;
            }
             /* Attempt to force page breaks */
            .page-break-inside-avoid {
               page-break-inside: avoid !important;
             }
             h1, h2, h3, h4 { page-break-after: avoid; }
             div, p { page-break-inside: avoid; }
          }

          /* Styles for html2canvas (PDF) */
          #report-printable {
            width: 100%; 
            background-color: #ffffff; 
            padding: 1.5rem; /* Slightly increase padding for PDF */
          }
          #report-printable .page-break-inside-avoid {
            page-break-inside: avoid !important;
          }
          /* Explicit Badge Styling for PDF */
          #report-printable .pdf-badge {
            display: inline-block; /* Ensure block properties */
            padding: 0.25rem 0.75rem; /* px-3 py-1 equivalent */
            border-radius: 9999px; /* rounded-full */
            font-size: 0.75rem; /* text-xs */
            font-weight: 500; /* font-medium */
            border-width: 1px;
            border-style: solid;
            margin-left: 0.5rem; /* Add spacing if needed */
            vertical-align: middle; /* Align nicely */
          }
          /* Risk Colors (provide fallbacks or ensure vars work) */
          #report-printable .pdf-badge.risk-none {
            color: #16a34a; /* Green text */
            border-color: #16a34a; 
            background-color: rgba(22, 163, 74, 0.1); /* Green bg with opacity */
          }
           #report-printable .pdf-badge.risk-low {
            color: #ca8a04; /* Yellow text */
            border-color: #ca8a04; 
            background-color: rgba(202, 138, 4, 0.1);
          }
          #report-printable .pdf-badge.risk-moderate {
            color: #ea580c; /* Orange text */
            border-color: #ea580c;
            background-color: rgba(234, 88, 12, 0.1);
          }
           #report-printable .pdf-badge.risk-high {
            color: #dc2626; /* Red text */
            border-color: #dc2626;
            background-color: rgba(220, 38, 38, 0.1);
          }
          #report-printable .pdf-badge.risk-critical {
            color: #dc2626; /* Darker Red text */
            border-color: #dc2626;
            background-color: rgba(220, 38, 38, 0.2); /* Darker bg */
          }
          /* Compatibility Colors */
          #report-printable .pdf-badge.status-compatible {
            color: #16a34a; /* Green text */
            border-color: #16a34a; 
            background-color: rgba(22, 163, 74, 0.1);
          }
          #report-printable .pdf-badge.status-incompatible {
             color: #dc2626; /* Red text */
            border-color: #dc2626;
            background-color: rgba(220, 38, 38, 0.1);
          }
          /* Ensure Tailwind bg-opacity works if needed elsewhere */
          #report-printable .bg-opacity-10 {
             --tw-bg-opacity: 0.1 !important;
          }
        `}
      </style>

      {/* Wrapper for print targeting */}
      <div id="report-printable-wrapper">
        <div className="container mx-auto max-w-4xl bg-white shadow-lg rounded-lg p-6 print:shadow-none print:rounded-none print:p-0">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-4 border-b no-print"> {/* Hide buttons container on print */}
            <h1 className="text-3xl font-bold text-gray-800 mb-2 sm:mb-0">Interaction Report</h1>
            <div className="flex gap-2 flex-wrap">
              <Button variant="outline" onClick={() => navigate(-1)} size="sm" className="flex items-center gap-1">
                {/* Optional: Add back icon */}
                Back
              </Button>
              <Button onClick={handlePrint} variant="outline" size="sm" className="flex items-center gap-1">
                 <Printer className="h-4 w-4" /> Print
              </Button>
              <Button onClick={generatePDF} size="sm" className="flex items-center gap-1">
                 <Download className="h-4 w-4" /> Download PDF
              </Button>
            </div>
          </div>

          {/* This div contains the printable/PDF content AND the footer */}
          <div id="report-printable" ref={reportContentRef}>
            {renderReportContent()}
            <footer className="mt-8 pt-4 border-t text-center text-gray-500 text-sm">
              Report generated on {new Date().toLocaleDateString()}. This report is for informational purposes only and does not substitute professional medical advice.
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPage; 
