
import React from 'react';
import { Info } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const EducationalInfo = () => {
  return (
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
  );
};

export default EducationalInfo;
