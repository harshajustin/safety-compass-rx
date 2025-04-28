import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PatientData } from "@/types";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { ChevronDown, ChevronRight, X } from "lucide-react";

type PatientInputProps = {
  patientData: PatientData;
  onChange: (patientData: PatientData) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
};

// Helper component for displaying errors
const InputError: React.FC<{ message?: string }> = ({ message }) => {
  if (!message) return null;
  return <p className="text-xs text-red-600 mt-1">{message}</p>;
};

const PatientInput: React.FC<PatientInputProps> = ({
  patientData,
  onChange,
  isExpanded,
  onToggleExpand,
}) => {
  // State for validation errors
  const [errors, setErrors] = useState<Partial<Record<keyof PatientData, string>>>({});

  // Validation function for numeric fields
  const validateNumeric = (value: number | undefined, fieldName: string, allowZero = false): string | undefined => {
    if (value === undefined || value === null || isNaN(value)) {
      return undefined; // No error if empty
    } 
    if (!allowZero && value <= 0) {
      return `${fieldName} must be a positive number.`;
    }
     if (allowZero && value < 0) {
       return `${fieldName} cannot be negative.`;
     }
    return undefined;
  };

  const handleChange = <K extends keyof PatientData>(field: K, value: PatientData[K]) => {
    let error: string | undefined = undefined;
    // Add validation checks
    if (field === 'age') {
      error = validateNumeric(value as number | undefined, 'Age');
    } else if (field === 'weight') {
      error = validateNumeric(value as number | undefined, 'Weight');
    } else if (field === 'height') {
      error = validateNumeric(value as number | undefined, 'Height');
    }
    // Add more checks for other fields if needed

    setErrors(prev => ({ ...prev, [field]: error }));
    onChange({ ...patientData, [field]: value });
  };

  const handleClinicalChange = <K extends keyof PatientData["clinicalParameters"]>(
    field: K,
    value: any,
    fieldName: string // Pass field name for validation message
  ) => {
    const clinicalParameters = patientData.clinicalParameters || {};
    let error: string | undefined = undefined;

    // Validate common clinical params
    if (field === 'eGFR') {
      error = validateNumeric(value as number | undefined, 'eGFR', true); // Allow zero for eGFR?
    }
    
    // Update nested errors if needed (complex)
    // For simplicity, we might only validate top-level clinical errors
    // or add specific error states like [clinicalErrors, setClinicalErrors]

    onChange({
      ...patientData,
      clinicalParameters: { ...clinicalParameters, [field]: value },
    });
     // Example: Update top-level clinical error state if needed
     // setErrors(prev => ({ ...prev, clinicalParameters: error ? { [field]: error } : undefined }));
  };

  const handleBloodPressureChange = (
    field: keyof PatientData["clinicalParameters"]["bloodPressure"],
    value: number
  ) => {
    const bloodPressure = patientData.clinicalParameters?.bloodPressure || {};
    handleClinicalChange("bloodPressure", { ...bloodPressure, [field]: value });
  };

  const handleLiverEnzymesChange = (
    field: keyof PatientData["clinicalParameters"]["liverEnzymes"],
    value: number
  ) => {
    const liverEnzymes = patientData.clinicalParameters?.liverEnzymes || {};
    handleClinicalChange("liverEnzymes", { ...liverEnzymes, [field]: value });
  };

  const handleArrayChange = <K extends keyof PatientData["medicalHistory"]>(
    section: K,
    value: string
  ) => {
    const medicalHistory = patientData.medicalHistory || {};
    const currentItems = medicalHistory[section] || [];
    if (value && !currentItems.includes(value)) {
      onChange({
        ...patientData,
        medicalHistory: {
          ...medicalHistory,
          [section]: [...currentItems, value],
        },
      });
    }
  };

  const removeArrayItem = <K extends keyof PatientData["medicalHistory"]>(
    section: K,
    index: number
  ) => {
    const medicalHistory = patientData.medicalHistory || {};
    const currentItems = [...(medicalHistory[section] || [])];
    currentItems.splice(index, 1);
    onChange({
      ...patientData,
      medicalHistory: { ...medicalHistory, [section]: currentItems },
    });
  };

  const handleMedicationChange = (value: string) => {
    const currentItems = patientData.currentMedications || [];
    if (value && !currentItems.includes(value)) {
      onChange({
        ...patientData,
        currentMedications: [...currentItems, value],
      });
    }
  };

  const removeMedication = (index: number) => {
    const currentItems = [...(patientData.currentMedications || [])];
    currentItems.splice(index, 1);
    onChange({
      ...patientData,
      currentMedications: currentItems,
    });
  };

  const handleSupplementChange = (value: string) => {
    const currentItems = patientData.supplements || [];
    if (value && !currentItems.includes(value)) {
      onChange({
        ...patientData,
        supplements: [...currentItems, value],
      });
    }
  };

  const removeSupplement = (index: number) => {
    const currentItems = [...(patientData.supplements || [])];
    currentItems.splice(index, 1);
    onChange({
      ...patientData,
      supplements: currentItems,
    });
  };

  return (
    <Card className="w-full mb-6">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center cursor-pointer" onClick={onToggleExpand}>
          <CardTitle className="text-lg font-medium">Patient Information (Optional)</CardTitle>
          <Button variant="ghost" size="sm" className="p-0 h-auto">
            {isExpanded ? (
              <ChevronDown className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
          </Button>
        </div>
      </CardHeader>
      {isExpanded && (
        <CardContent>
          <div className="space-y-6">
            {/* Demographics Section */}
            <div>
              <h4 className="text-lg font-medium mb-3">Demographics</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                  <Label htmlFor="patient-name">Name</Label>
                  <Input
                    id="patient-name"
                    placeholder="Enter patient name"
                    value={patientData.name || ""}
                    onChange={(e) => handleChange("name", e.target.value)}
                  />
                </div>
                <div className="md:col-span-1">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="Enter age"
                    value={patientData.age || ""}
                    onChange={(e) => handleChange("age", parseInt(e.target.value) || undefined)}
                    aria-invalid={!!errors.age}
                  />
                  <InputError message={errors.age} />
                </div>
                <div className="md:col-span-1">
                  <Label htmlFor="sex">Sex</Label>
                  <Select
                    value={patientData.sex}
                    onValueChange={(value) => handleChange("sex", value as any)}
                  >
                    <SelectTrigger id="sex">
                      <SelectValue placeholder="Select sex" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-1">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="Enter weight"
                    value={patientData.weight || ""}
                    onChange={(e) => handleChange("weight", parseFloat(e.target.value) || undefined)}
                    aria-invalid={!!errors.weight}
                  />
                  <InputError message={errors.weight} />
                </div>
                <div className="md:col-span-1">
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="Enter height"
                    value={patientData.height || ""}
                    onChange={(e) => handleChange("height", parseFloat(e.target.value) || undefined)}
                    aria-invalid={!!errors.height}
                  />
                  <InputError message={errors.height} />
                </div>
              </div>
            </div>

            {/* Clinical Parameters */}
            <div>
              <h4 className="text-lg font-medium mb-3">Clinical Parameters</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="egfr">eGFR (mL/min/1.73m²)</Label>
                  <Input
                    id="egfr"
                    type="number"
                    placeholder="Enter eGFR"
                    value={patientData.clinicalParameters?.eGFR || ""}
                    onChange={(e) => handleClinicalChange("eGFR", parseFloat(e.target.value) || undefined, 'eGFR')}
                  />
                </div>
                <div>
                  <Label htmlFor="alt">ALT (U/L)</Label>
                  <Input
                    id="alt"
                    type="number"
                    placeholder="Enter ALT"
                    value={patientData.clinicalParameters?.liverEnzymes?.alt || ""}
                    onChange={(e) => handleLiverEnzymesChange("alt", parseFloat(e.target.value) || undefined)}
                  />
                </div>
                <div>
                  <Label htmlFor="ast">AST (U/L)</Label>
                  <Input
                    id="ast"
                    type="number"
                    placeholder="Enter AST"
                    value={patientData.clinicalParameters?.liverEnzymes?.ast || ""}
                    onChange={(e) => handleLiverEnzymesChange("ast", parseFloat(e.target.value) || undefined)}
                  />
                </div>
                <div>
                  <Label htmlFor="systolic">Systolic BP (mmHg)</Label>
                  <Input
                    id="systolic"
                    type="number"
                    placeholder="Enter systolic BP"
                    value={patientData.clinicalParameters?.bloodPressure?.systolic || ""}
                    onChange={(e) => handleBloodPressureChange("systolic", parseFloat(e.target.value) || undefined)}
                  />
                </div>
                <div>
                  <Label htmlFor="diastolic">Diastolic BP (mmHg)</Label>
                  <Input
                    id="diastolic"
                    type="number"
                    placeholder="Enter diastolic BP"
                    value={patientData.clinicalParameters?.bloodPressure?.diastolic || ""}
                    onChange={(e) => handleBloodPressureChange("diastolic", parseFloat(e.target.value) || undefined)}
                  />
                </div>
              </div>
            </div>

            {/* Medical History */}
            <div>
              <h4 className="text-lg font-medium mb-3">Medical History</h4>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="conditions">Medical Conditions</Label>
                  <div className="flex gap-2">
                    <Input
                      id="conditions"
                      placeholder="Enter condition"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleArrayChange("conditions", e.currentTarget.value);
                          e.currentTarget.value = "";
                        }
                      }}
                    />
                    <Button 
                      onClick={(e) => {
                        const input = document.getElementById("conditions") as HTMLInputElement;
                        handleArrayChange("conditions", input.value);
                        input.value = "";
                      }}
                      variant="outline"
                    >
                      Add
                    </Button>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {patientData.medicalHistory?.conditions?.map((condition, index) => (
                      <div key={index} className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-1">
                        <span>{condition}</span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-4 w-4 rounded-full p-0"
                          onClick={() => removeArrayItem("conditions", index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="allergies">Allergies</Label>
                  <div className="flex gap-2">
                    <Input
                      id="allergies"
                      placeholder="Enter allergy"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleArrayChange("allergies", e.currentTarget.value);
                          e.currentTarget.value = "";
                        }
                      }}
                    />
                    <Button 
                      onClick={(e) => {
                        const input = document.getElementById("allergies") as HTMLInputElement;
                        handleArrayChange("allergies", input.value);
                        input.value = "";
                      }}
                      variant="outline"
                    >
                      Add
                    </Button>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {patientData.medicalHistory?.allergies?.map((allergy, index) => (
                      <div key={index} className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-1">
                        <span>{allergy}</span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-4 w-4 rounded-full p-0"
                          onClick={() => removeArrayItem("allergies", index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="adverse-reactions">Adverse Reactions</Label>
                  <div className="flex gap-2">
                    <Input
                      id="adverse-reactions"
                      placeholder="Enter adverse reaction"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleArrayChange("adverseReactions", e.currentTarget.value);
                          e.currentTarget.value = "";
                        }
                      }}
                    />
                    <Button 
                      onClick={(e) => {
                        const input = document.getElementById("adverse-reactions") as HTMLInputElement;
                        handleArrayChange("adverseReactions", input.value);
                        input.value = "";
                      }}
                      variant="outline"
                    >
                      Add
                    </Button>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {patientData.medicalHistory?.adverseReactions?.map((reaction, index) => (
                      <div key={index} className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-1">
                        <span>{reaction}</span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-4 w-4 rounded-full p-0"
                          onClick={() => removeArrayItem("adverseReactions", index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Current Medications */}
            <div>
              <h4 className="text-lg font-medium mb-3">Current Medications</h4>
              <div className="flex gap-2">
                <Input
                  id="medications"
                  placeholder="Enter medication"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleMedicationChange(e.currentTarget.value);
                      e.currentTarget.value = "";
                    }
                  }}
                />
                <Button 
                  onClick={(e) => {
                    const input = document.getElementById("medications") as HTMLInputElement;
                    handleMedicationChange(input.value);
                    input.value = "";
                  }}
                  variant="outline"
                >
                  Add
                </Button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {patientData.currentMedications?.map((medication, index) => (
                  <div key={index} className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-1">
                    <span>{medication}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-4 w-4 rounded-full p-0"
                      onClick={() => removeMedication(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Supplements */}
            <div>
              <h4 className="text-lg font-medium mb-3">Supplements</h4>
              <div className="flex gap-2">
                <Input
                  id="supplements"
                  placeholder="Enter supplement"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSupplementChange(e.currentTarget.value);
                      e.currentTarget.value = "";
                    }
                  }}
                />
                <Button 
                  onClick={(e) => {
                    const input = document.getElementById("supplements") as HTMLInputElement;
                    handleSupplementChange(input.value);
                    input.value = "";
                  }}
                  variant="outline"
                >
                  Add
                </Button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {patientData.supplements?.map((supplement, index) => (
                  <div key={index} className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-1">
                    <span>{supplement}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-4 w-4 rounded-full p-0"
                      onClick={() => removeSupplement(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default PatientInput;
