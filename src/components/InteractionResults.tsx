
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Utensils, Wine, AlertTriangle, User } from "lucide-react";
import { cn } from '@/lib/utils';

type InteractionResultsProps = {
  results: {
    drugInteractions: Array<{
      severity: string;
      description: string;
      recommendation: string;
    }>;
    foodInteractions: Array<{
      severity: string;
      description: string;
      recommendation: string;
    }>;
    alcoholInteractions: Array<{
      severity: string;
      description: string;
      recommendation: string;
    }>;
    patientRisks: Array<{
      severity: string;
      description: string;
      recommendation: string;
    }>;
    overallRisk: string;
  } | null;
};

const InteractionResults: React.FC<InteractionResultsProps> = ({ results }) => {
  if (!results) return null;

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return 'bg-red-100 border-red-300 text-red-800';
      case 'moderate':
        return 'bg-amber-100 border-amber-300 text-amber-800';
      case 'low':
        return 'bg-blue-100 border-blue-300 text-blue-800';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const getOverallRiskStyle = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'high':
        return 'bg-red-600 text-white';
      case 'moderate':
        return 'bg-amber-500 text-white';
      case 'low':
        return 'bg-blue-500 text-white';
      case 'none':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const hasInteractions = results.drugInteractions.length > 0 || 
                         results.foodInteractions.length > 0 || 
                         results.alcoholInteractions.length > 0 || 
                         results.patientRisks.length > 0;

  return (
    <Card className="mb-8 shadow-lg">
      <CardHeader className={cn("py-4", getOverallRiskStyle(results.overallRisk))}>
        <CardTitle className="text-center text-xl">
          Interaction Analysis - {results.overallRisk} Risk
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {!hasInteractions && (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center p-4 bg-green-100 rounded-full mb-4">
              <AlertTriangle className="h-8 w-8 text-green-500" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No Interactions Detected</h3>
            <p className="text-gray-600">
              No significant interactions were found between the provided medications and patient factors.
            </p>
          </div>
        )}

        {/* Drug Interactions Section */}
        {results.drugInteractions.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5" /> Drug-Drug Interactions
            </h3>
            <div className="space-y-4">
              {results.drugInteractions.map((interaction, index) => (
                <div 
                  key={index}
                  className={`border rounded-md p-4 ${getSeverityColor(interaction.severity)}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{interaction.description}</h4>
                    <span className={`px-2 py-1 rounded text-xs font-medium`}>
                      {interaction.severity} Risk
                    </span>
                  </div>
                  <p>{interaction.recommendation}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Food Interactions Section */}
        {results.foodInteractions.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <Utensils className="mr-2 h-5 w-5" /> Food Interactions
            </h3>
            <div className="space-y-4">
              {results.foodInteractions.map((interaction, index) => (
                <div 
                  key={index}
                  className={`border rounded-md p-4 ${getSeverityColor(interaction.severity)}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{interaction.description}</h4>
                    <span className={`px-2 py-1 rounded text-xs font-medium`}>
                      {interaction.severity} Risk
                    </span>
                  </div>
                  <p>{interaction.recommendation}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Alcohol Interactions Section */}
        {results.alcoholInteractions.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <Wine className="mr-2 h-5 w-5" /> Alcohol Interactions
            </h3>
            <div className="space-y-4">
              {results.alcoholInteractions.map((interaction, index) => (
                <div 
                  key={index}
                  className={`border rounded-md p-4 ${getSeverityColor(interaction.severity)}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{interaction.description}</h4>
                    <span className={`px-2 py-1 rounded text-xs font-medium`}>
                      {interaction.severity} Risk
                    </span>
                  </div>
                  <p>{interaction.recommendation}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Patient-Specific Risks Section */}
        {results.patientRisks.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <User className="mr-2 h-5 w-5" /> Patient-Specific Considerations
            </h3>
            <div className="space-y-4">
              {results.patientRisks.map((risk, index) => (
                <div 
                  key={index}
                  className={`border rounded-md p-4 ${getSeverityColor(risk.severity)}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{risk.description}</h4>
                    <span className={`px-2 py-1 rounded text-xs font-medium`}>
                      {risk.severity} Risk
                    </span>
                  </div>
                  <p>{risk.recommendation}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> This analysis is for informational purposes only and should not replace 
            professional medical advice. Always consult with a healthcare provider before making changes 
            to medication regimens.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default InteractionResults;
