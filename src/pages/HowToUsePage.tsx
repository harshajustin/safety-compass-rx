import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

const HowToUsePage = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="container mx-auto max-w-4xl bg-white shadow-lg rounded-lg p-6 sm:p-8">
        <Link 
          to="/" 
          className="inline-flex items-center text-sm text-blue-600 hover:underline mb-6"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Analysis Tool
        </Link>

        <h1 className="text-3xl font-bold text-gray-800 mb-6">How to Use the Drug Interaction Checker</h1>

        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-3">1. Entering Medications</h2>
            <p className="mb-4">The primary function is to check for interactions between two or more medications. Start by entering the drugs you want to analyze:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>
                <strong>Drug Name (Required):</strong> Start typing the name of the drug. A list of suggestions will appear after you type at least two characters. Click on the correct drug from the list to select it. You must select a drug from the suggestions for it to be included in the analysis.
              </li>
              <li>
                <strong>Dosage (Optional):</strong> Enter the specific dose, including units (e.g., "5mg", "100 units", "2 puffs"). This field is optional but can provide context.
              </li>
              <li>
                <strong>Administration Route (Optional):</strong> Select how the drug is taken (e.g., Oral, Topical, Intravenous) from the dropdown menu. Optional.
              </li>
              <li>
                <strong>Frequency (Optional):</strong> Select how often the drug is taken (e.g., Once daily, As needed) from the dropdown menu. Optional.
              </li>
              <li>
                <strong>Adding/Removing Drugs:</strong> 
                You start with one input row. Use the <code className="bg-gray-200 px-1 rounded">+ Add Another Drug</code> button to add more medication fields. 
                To remove a medication (only possible if you have more than one), click the <code className="bg-gray-200 px-1 rounded">X</code> icon in the top-right corner of that drug's input area.
              </li>
               <li>
                <strong>Minimum Requirement:</strong> You must enter at least <span className="font-semibold">two</span> valid drugs (selected from the suggestions) to perform an analysis.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">2. Adding Patient Details (Optional)</h2>
            <p className="mb-4">Providing patient-specific information can help refine the interaction analysis, as some interactions are affected by factors like age or kidney function. This section is entirely optional.</p>
            <p className="mb-4">Click the title or the arrow next to "Patient Details (Optional)" to expand or collapse this section.</p>
            <p className="mb-2 font-medium">Fields include:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li><strong>Demographics:</strong> Age, Sex, Weight (kg), Height (cm).</li>
              <li><strong>Clinical Parameters:</strong> eGFR (kidney function), Liver Enzymes (ALT, AST), Blood Pressure.</li>
              <li><strong>Medical History:</strong> Known Conditions, Allergies, past Adverse Drug Reactions.</li>
              <li><strong>Other Medications/Supplements:</strong> List any other relevant current medications or supplements not included in the main drug list above.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">3. Analyzing Interactions</h2>
            <p className="mb-4">Once you have entered at least two drugs:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
               <li>Click the <code className="bg-blue-600 text-white px-1 rounded">Analyze Interactions</code> button.</li>
               <li>The button will show a loading indicator while the analysis is performed.</li>
               <li>Results will appear below the input card once the analysis is complete.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">4. Understanding the Results Summary</h2>
            <p className="mb-4">After analysis, a summary card appears:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li><strong>Overall Compatibility Status:</strong> Indicates if any significant interactions were found (<code className="text-red-600">Incompatible</code>) or not (<code className="text-green-600">Compatible</code>).</li>
              <li><strong>Overall Risk Level:</strong> Summarizes the highest risk level detected across all pairs (None, Low, Moderate, High, Critical).</li>
              <li><strong>Database Info:</strong> Shows the version and last update date of the interaction database used.</li>
              <li>
                <strong>Detailed Interaction Analysis:</strong> This section lists each pair of drugs analyzed. 
                You can click on a drug pair to expand it and see more details like Time to Onset and Confidence Score. 
                Badges indicate the risk level and compatibility for each specific pair.
             </li>
             <li>
                <strong>View Full Report Button:</strong> Click this button to navigate to a dedicated page with a comprehensive report suitable for printing or saving.
             </li>
            </ul>
          </section>
          
           <section>
            <h2 className="text-2xl font-semibold mb-3">5. The Full Report Page</h2>
            <p className="mb-4">Accessed via the "View Full Report" button, this page provides:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>A repeat of the Safety Assessment Summary.</li>
              <li>A detailed breakdown for each interacting pair, including:
                <ul className="list-circle pl-6 mt-1">
                    <li>Mechanism of interaction</li>
                    <li>Potential effects</li>
                    <li>Suggested dose modifications (if any)</li>
                    <li>Monitoring parameters</li>
                    <li>Alternative therapy options (if available)</li>
                    <li>Evidence sources (literature, guidelines, warnings)</li>
                </ul>
              </li>
              <li>
                <strong>Action Buttons:</strong>
                <ul className="list-circle pl-6 mt-1">
                    <li><code className="bg-gray-200 px-1 rounded">Back</code>: Returns to the main analysis page.</li>
                    <li><code className="bg-gray-200 px-1 rounded">Print</code>: Opens your browser's print dialog to print the report.</li>
                    <li><code className="bg-gray-200 px-1 rounded">Download PDF</code>: Saves the report as a PDF file.</li>
                </ul>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Other Features</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>
                <strong>Clear All Button:</strong> Resets all drug inputs, patient data, and analysis results.
              </li>
               <li>
                <strong>Load Sample Data Link:</strong> Fills the form with sample drug and patient data for demonstration purposes. Useful for quickly seeing how the tool works.
              </li>
            </ul>
          </section>

          <section className="pt-4 border-t mt-6">
            <h2 className="text-xl font-semibold mb-3 text-red-600">Important Disclaimer</h2>
            <p className="text-gray-700 italic">
              This tool is for informational purposes only and does not substitute professional medical advice, diagnosis, or treatment. 
              Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition or medication management. 
              Never disregard professional medical advice or delay in seeking it because of something you have read or interpreted from this tool.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default HowToUsePage; 