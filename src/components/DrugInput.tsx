
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { DrugEntry } from "@/types";
import { X, Plus } from "lucide-react";
import { getDrugSuggestions, getAllDrugs, getDrugById } from "@/services/drugInteractionService";

type DrugInputProps = {
  drugs: DrugEntry[];
  onChange: (drugs: DrugEntry[]) => void;
};

const defaultDrug: DrugEntry = {
  drugId: "",
  drugName: "",
  dosage: "",
  route: "",
  frequency: ""
};

const routeOptions = [
  "Oral",
  "Intravenous",
  "Intramuscular",
  "Subcutaneous",
  "Topical",
  "Inhalation",
  "Rectal",
  "Transdermal"
];

const DrugInput: React.FC<DrugInputProps> = ({ drugs, onChange }) => {
  const [suggestions, setSuggestions] = useState<Array<{ id: string; name: string }>>([]);
  // Replace single searchQuery with an array of queries for each drug
  const [searchQueries, setSearchQueries] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  
  // Initialize with at least 2 drug entries if none provided
  useEffect(() => {
    if (drugs.length === 0) {
      onChange([{ ...defaultDrug }, { ...defaultDrug }]);
      setSearchQueries(["", ""]);
    } else if (searchQueries.length < drugs.length) {
      // Make sure searchQueries array has same length as drugs array
      setSearchQueries(prev => [...prev, ...Array(drugs.length - prev.length).fill("")]);
    }
  }, [drugs, onChange]);

  const handleDrugSearch = (query: string, index: number) => {
    // Update only the search query for this specific drug
    const updatedQueries = [...searchQueries];
    updatedQueries[index] = query;
    setSearchQueries(updatedQueries);
    
    setActiveIndex(index);
    
    if (query.length >= 2) {
      const matches = getDrugSuggestions(query);
      setSuggestions(matches.map(d => ({ id: d.id, name: d.name })));
    } else {
      setSuggestions([]);
    }
  };

  const selectDrug = (drugId: string, index: number) => {
    const drug = getDrugById(drugId);
    if (!drug) return;
    
    const updatedDrugs = [...drugs];
    updatedDrugs[index] = {
      ...updatedDrugs[index],
      drugId: drug.id,
      drugName: drug.name,
    };
    
    // Clear the search query for this drug after selection
    const updatedQueries = [...searchQueries];
    updatedQueries[index] = "";
    setSearchQueries(updatedQueries);
    
    onChange(updatedDrugs);
    setSuggestions([]);
  };

  const handleInputChange = (index: number, field: keyof DrugEntry, value: string) => {
    const updatedDrugs = [...drugs];
    updatedDrugs[index] = { ...updatedDrugs[index], [field]: value };
    onChange(updatedDrugs);
  };

  const addDrug = () => {
    onChange([...drugs, { ...defaultDrug }]);
    setSearchQueries([...searchQueries, ""]);
  };

  const removeDrug = (index: number) => {
    if (drugs.length <= 2) return; // Keep minimum 2 drugs
    const updatedDrugs = drugs.filter((_, i) => i !== index);
    onChange(updatedDrugs);
    
    // Also remove the corresponding search query
    const updatedQueries = searchQueries.filter((_, i) => i !== index);
    setSearchQueries(updatedQueries);
  };

  return (
    <Card className="w-full mb-6">
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Drug Information</h3>
            <Button 
              onClick={addDrug} 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
            >
              <Plus className="h-4 w-4" /> Add Drug
            </Button>
          </div>
          
          {drugs.map((drug, index) => (
            <div key={index} className="p-4 border rounded-md relative">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-4 relative">
                  <Label htmlFor={`drug-${index}`}>Drug Name (required)</Label>
                  <Input
                    id={`drug-${index}`}
                    placeholder="Enter drug name"
                    value={searchQueries[index] || drug.drugName}
                    onChange={(e) => handleDrugSearch(e.target.value, index)}
                    className="w-full"
                  />
                  {suggestions.length > 0 && activeIndex === index && (
                    <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                      {suggestions.map((suggestion) => (
                        <div 
                          key={suggestion.id}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => selectDrug(suggestion.id, index)}
                        >
                          {suggestion.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor={`dosage-${index}`}>Dosage</Label>
                  <Input
                    id={`dosage-${index}`}
                    placeholder="e.g., 5mg, 10mL"
                    value={drug.dosage}
                    onChange={(e) => handleInputChange(index, "dosage", e.target.value)}
                  />
                </div>
                <div className="md:col-span-3">
                  <Label htmlFor={`route-${index}`}>Administration Route</Label>
                  <Select
                    value={drug.route}
                    onValueChange={(value) => handleInputChange(index, "route", value)}
                  >
                    <SelectTrigger className="w-full" id={`route-${index}`}>
                      <SelectValue placeholder="Select route" />
                    </SelectTrigger>
                    <SelectContent>
                      {routeOptions.map((route) => (
                        <SelectItem key={route} value={route.toLowerCase()}>
                          {route}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-3">
                  <Label htmlFor={`frequency-${index}`}>Frequency</Label>
                  <Input
                    id={`frequency-${index}`}
                    placeholder="e.g., Once daily, BID, TID"
                    value={drug.frequency}
                    onChange={(e) => handleInputChange(index, "frequency", e.target.value)}
                  />
                </div>
              </div>
              {drugs.length > 2 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeDrug(index)}
                  className="absolute top-2 right-2 h-6 w-6 rounded-full p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DrugInput;
