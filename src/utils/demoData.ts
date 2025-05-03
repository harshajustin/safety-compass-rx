
import { DrugEntry, PatientData } from '@/types';

export interface DemoDataType {
  drugs: DrugEntry[];
  foodInteractions: string[];
  alcoholInteractions: boolean;
  alcoholDetails: string;
  patientData: PatientData;
}

export function getDemoData(): DemoDataType {
  return {
    drugs: [
      {
        drugId: "1",
        drugName: "Warfarin",
        dosage: "5 mg",
        route: "oral",
        frequency: "once daily"
      },
      {
        drugId: "2",
        drugName: "Aspirin",
        dosage: "81 mg",
        route: "oral",
        frequency: "once daily"
      },
      {
        drugId: "3",
        drugName: "Lisinopril",
        dosage: "10 mg",
        route: "oral",
        frequency: "once daily"
      }
    ],
    
    foodInteractions: ["Grapefruit", "Green leafy vegetables"],
    
    alcoholInteractions: true,
    alcoholDetails: "Patient consumes alcohol on weekends",
    
    patientData: {
      name: "John Doe",
      age: 65,
      sex: "male",
      weight: 80,
      height: 175,
      clinicalParameters: {
        eGFR: 65,
        liverEnzymes: {
          alt: 32,
          ast: 28
        },
        bloodPressure: {
          systolic: 142,
          diastolic: 88
        }
      },
      medicalHistory: {
        conditions: [
          "Hypertension",
          "Atrial Fibrillation",
          "Type 2 Diabetes"
        ],
        allergies: [
          "Penicillin"
        ],
        adverseReactions: [
          "Nausea with metformin"
        ]
      },
      currentMedications: [
        "Metformin 500mg twice daily",
        "Atorvastatin 40mg once daily"
      ],
      supplements: [
        "Vitamin D 1000 IU",
        "CoQ10 100mg"
      ]
    }
  };
}
