
import React, { useState } from 'react';
import { SafetyAssessmentResult, InteractionResult } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, Clock, FileText, Printer, ArrowDown } from 'lucide-react';

type InteractionResultsProps = {
  results: SafetyAssessmentResult;
  onGenerateReport: () => void;
};

const getRiskBadgeColor = (riskLevel: string) => {
  switch (riskLevel) {
    case 'none':
      return 'bg-risk-none text-white';
    case 'low':
      return 'bg-risk-low text-black';
    case 'moderate':
      return 'bg-risk-moderate text-black';
    case 'high':
      return 'bg-risk-high text-white';
    case 'critical':
      return 'bg-risk-critical text-white';
    default:
      return 'bg-gray-500 text-white';
  }
};

const getTimeToOnsetIcon = (timeToOnset: string) => {
  switch (timeToOnset) {
    case 'immediate':
      return <Clock className="inline mr-1 h-4 w-4" />;
    case 'short-term':
      return <Clock className="inline mr-1 h-4 w-4" />;
    case 'delayed':
      return <Clock className="inline mr-1 h-4 w-4" />;
    default:
      return null;
  }
};

const getTimeToOnsetText = (timeToOnset: string) => {
  switch (timeToOnset) {
    case 'immediate':
      return 'Immediate (<24h)';
    case 'short-term':
      return 'Short-term (1-7d)';
    case 'delayed':
      return 'Delayed (>7d)';
    default:
      return timeToOnset;
  }
};

const getConfidenceStars = (score: number) => {
  return '★'.repeat(score) + '☆'.repeat(5 - score);
};

const InteractionResults: React.FC<InteractionResultsProps> = ({ 
  results, 
  onGenerateReport 
}) => {
  const [expandedInteraction, setExpandedInteraction] = useState<string | null>(null);

  const handleInteractionClick = (interactionId: string) => {
    if (expandedInteraction === interactionId) {
      setExpandedInteraction(null);
    } else {
      setExpandedInteraction(interactionId);
    }
  };

  if (!results || !results.interactionResults) {
    return null;
  }

  const { 
    interactionResults, 
    overallRiskLevel, 
    overallCompatibilityStatus,
    databaseVersion,
    lastUpdated 
  } = results;

  // Sort interactions by risk level (highest to lowest)
  const sortedInteractions = [...interactionResults].sort((a, b) => {
    const riskLevels = { 'critical': 5, 'high': 4, 'moderate': 3, 'low': 2, 'none': 1 };
    return riskLevels[b.riskLevel as keyof typeof riskLevels] - riskLevels[a.riskLevel as keyof typeof riskLevels];
  });

  return (
    <div className="space-y-6">
      <Card className="w-full border-2 shadow-md">
        <CardHeader className={`pb-2 ${overallCompatibilityStatus === 'compatible' ? 'bg-green-50' : 'bg-red-50'}`}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <CardTitle className="text-xl font-bold">Safety Assessment Summary</CardTitle>
            <div className="flex items-center gap-2 mt-2 md:mt-0">
              <Button onClick={onGenerateReport} className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>Generate Report</span>
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Printer className="h-4 w-4" />
                <span>Print</span>
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowDown className="h-4 w-4" />
                <span>Download</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">Compatibility Status</div>
              <div className="flex items-center">
                {overallCompatibilityStatus === 'compatible' ? (
                  <>
                    <CheckCircle className="mr-2 h-5 w-5 text-green-600" />
                    <span className="text-lg font-semibold text-green-600">Compatible</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="mr-2 h-5 w-5 text-red-600" />
                    <span className="text-lg font-semibold text-red-600">Incompatible</span>
                  </>
                )}
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">Overall Risk Level</div>
              <div className="flex items-center">
                <Badge className={`${getRiskBadgeColor(overallRiskLevel)} capitalize text-md font-semibold px-3 py-1`}>
                  {overallRiskLevel}
                </Badge>
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">Database Version</div>
              <div className="text-lg font-semibold">{databaseVersion}</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">Last Updated</div>
              <div className="text-lg font-semibold">{lastUpdated}</div>
            </div>
          </div>

          <h3 className="text-lg font-semibold mb-4">Detailed Interaction Analysis</h3>

          <Accordion type="single" collapsible className="w-full">
            {sortedInteractions.map((interaction, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex flex-col md:flex-row w-full md:items-center md:justify-between text-left">
                    <div className="font-medium">
                      {interaction.drugPair[0]} + {interaction.drugPair[1]}
                    </div>
                    <div className="flex items-center gap-2 mt-2 md:mt-0">
                      <Badge className={`${getRiskBadgeColor(interaction.riskLevel)}`}>
                        {interaction.riskLevel}
                      </Badge>
                      {interaction.compatibilityStatus === 'compatible' ? (
                        <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700">
                          Compatible
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-red-50 border-red-200 text-red-700">
                          Incompatible
                        </Badge>
                      )}
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pt-4 pb-2">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Time to Onset</div>
                        <div className="flex items-center">
                          {getTimeToOnsetIcon(interaction.timeToOnset)}
                          <span>{getTimeToOnsetText(interaction.timeToOnset)}</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 mb-1">Confidence Score</div>
                        <div className="text-yellow-500">{getConfidenceStars(interaction.confidenceScore)}</div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="text-sm font-medium mb-1">Mechanism</div>
                      <p className="text-gray-700">{interaction.mechanism}</p>
                    </div>

                    <div className="mb-4">
                      <div className="text-sm font-medium mb-1">Effects</div>
                      <ul className="list-disc pl-5">
                        {interaction.effects.map((effect, idx) => (
                          <li key={idx} className="text-gray-700">{effect}</li>
                        ))}
                      </ul>
                    </div>

                    {interaction.doseModification && (
                      <div className="mb-4">
                        <div className="text-sm font-medium mb-1">Dose Modification</div>
                        <p className="text-gray-700">{interaction.doseModification}</p>
                      </div>
                    )}

                    {interaction.monitoringParameters && interaction.monitoringParameters.length > 0 && (
                      <div className="mb-4">
                        <div className="text-sm font-medium mb-1">Monitoring Parameters</div>
                        <ul className="list-disc pl-5">
                          {interaction.monitoringParameters.map((param, idx) => (
                            <li key={idx} className="text-gray-700">{param}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {interaction.alternatives && interaction.alternatives.length > 0 && (
                      <div className="mb-4">
                        <div className="text-sm font-medium mb-1">Alternative Therapy Options</div>
                        <ul className="list-disc pl-5">
                          {interaction.alternatives.map((alt, idx) => (
                            <li key={idx} className="text-gray-700">{alt}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Evidence Documentation */}
                    <div className="mt-6">
                      <div className="text-sm font-medium mb-2">Evidence Documentation</div>
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="evidence-literature">
                          <AccordionTrigger className="text-sm py-2">
                            Literature Citations ({interaction.evidence.literatureCitations.length})
                          </AccordionTrigger>
                          <AccordionContent>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Title</TableHead>
                                  <TableHead>Authors</TableHead>
                                  <TableHead>Journal</TableHead>
                                  <TableHead>Year</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {interaction.evidence.literatureCitations.map((citation, idx) => (
                                  <TableRow key={idx}>
                                    <TableCell>
                                      {citation.url ? (
                                        <a 
                                          href={citation.url} 
                                          target="_blank" 
                                          rel="noopener noreferrer"
                                          className="text-blue-600 hover:underline"
                                        >
                                          {citation.title}
                                        </a>
                                      ) : (
                                        citation.title
                                      )}
                                    </TableCell>
                                    <TableCell>{citation.authors}</TableCell>
                                    <TableCell>{citation.journal}</TableCell>
                                    <TableCell>{citation.year}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </AccordionContent>
                        </AccordionItem>
                        
                        {interaction.evidence.guidelines && interaction.evidence.guidelines.length > 0 && (
                          <AccordionItem value="evidence-guidelines">
                            <AccordionTrigger className="text-sm py-2">
                              Clinical Guidelines ({interaction.evidence.guidelines.length})
                            </AccordionTrigger>
                            <AccordionContent>
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Organization</TableHead>
                                    <TableHead>Recommendation</TableHead>
                                    <TableHead>Year</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {interaction.evidence.guidelines.map((guideline, idx) => (
                                    <TableRow key={idx}>
                                      <TableCell>{guideline.organization}</TableCell>
                                      <TableCell>{guideline.recommendation}</TableCell>
                                      <TableCell>{guideline.year}</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </AccordionContent>
                          </AccordionItem>
                        )}
                        
                        {interaction.evidence.regulatoryWarnings && interaction.evidence.regulatoryWarnings.length > 0 && (
                          <AccordionItem value="evidence-warnings">
                            <AccordionTrigger className="text-sm py-2">
                              Regulatory Warnings ({interaction.evidence.regulatoryWarnings.length})
                            </AccordionTrigger>
                            <AccordionContent>
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Organization</TableHead>
                                    <TableHead>Warning</TableHead>
                                    <TableHead>Date</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {interaction.evidence.regulatoryWarnings.map((warning, idx) => (
                                    <TableRow key={idx}>
                                      <TableCell>{warning.organization}</TableCell>
                                      <TableCell>{warning.warning}</TableCell>
                                      <TableCell>{warning.date}</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </AccordionContent>
                          </AccordionItem>
                        )}
                      </Accordion>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};

export default InteractionResults;
