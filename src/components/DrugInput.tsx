
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
import { X, Plus, Wine, Utensils } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { getDrugSuggestions, getAllDrugs, getDrugById } from "@/services/drugInteractionService";

type DrugInputProps = {
  drugs: DrugEntry[];
  onChange: (drugs: DrugEntry[]) => void;
  foodInteractions: string[];
  onFoodInteractionsChange: (foods: string[]) => void;
  alcoholInteractions: boolean;
  onAlcoholInteractionsChange: (hasInteraction: boolean) => void;
  alcoholDetails: string;
  onAlcoholDetailsChange: (details: string) => void;
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

const frequencyOptions = [
  "Once daily",
  "Twice daily (BID)",
  "Three times daily (TID)",
  "Four times daily (QID)",
  "Every 4 hours",
  "Every 6 hours",
  "Every 8 hours",
  "Every 12 hours",
  "As needed (PRN)",
  "Weekly",
  "Every other day",
  "Monthly"
];

const commonFoods = [
  "Grapefruit",
  "Dairy products",
  "Leafy greens",
  "Caffeine",
  "High-fat foods",
  "Alcohol",
  "Aged cheeses",
  "Fermented foods"
];

const DrugInput: React.FC<DrugInputProps> = ({ 
  drugs, 
  onChange,
  foodInteractions,
  onFoodInteractionsChange,
  alcoholInteractions,
  onAlcoholInteractionsChange,
  alcoholDetails,
  onAlcoholDetailsChange
}) => {
  const [suggestions, setSuggestions] = useState<Array<{ id: string; name: string }>>([]);
  const [searchQueries, setSearchQueries] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [newFood, setNewFood] = useState("");
  const [activeTab, setActiveTab] = useState("drugs");
  
  useEffect(() => {
    if (drugs.length === 0) {
      onChange([{ ...defaultDrug }]);
      setSearchQueries([""]);
    } else if (searchQueries.length < drugs.length) {
      setSearchQueries(prev => [...prev, ...Array(drugs.length - prev.length).fill("")]);
    }
  }, [drugs, onChange]);

  const handleDrugSearch = (query: string, index: number) => {
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
    if (drugs.length <= 1) return;
    const updatedDrugs = drugs.filter((_, i) => i !== index);
    onChange(updatedDrugs);
    
    const updatedQueries = searchQueries.filter((_, i) => i !== index);
    setSearchQueries(updatedQueries);
  };

  const handleAddFood = () => {
    if (newFood.trim() && !foodInteractions.includes(newFood.trim())) {
      onFoodInteractionsChange([...foodInteractions, newFood.trim()]);
      setNewFood("");
    }
  };

  const handleRemoveFood = (index: number) => {
    const updatedFoods = [...foodInteractions];
    updatedFoods.splice(index, 1);
    onFoodInteractionsChange(updatedFoods);
  };

  const addCommonFood = (food: string) => {
    if (!foodInteractions.includes(food)) {
      onFoodInteractionsChange([...foodInteractions, food]);
    }
  };

  return (
    <Card className="w-full mb-6">
      <CardContent className="pt-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 grid grid-cols-3">
            <TabsTrigger value="drugs">Drug Information</TabsTrigger>
            <TabsTrigger value="food">
              <Utensils className="mr-2 h-4 w-4" />
              Food Interactions
            </TabsTrigger>
            <TabsTrigger value="alcohol">
              <Wine className="mr-2 h-4 w-4" />
              Alcohol Interactions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="drugs" className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Drug Information</h3>
            </div>
            
            {drugs.map((drug, index) => (
              <div key={index} className="p-4 border rounded-md relative mb-4">
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
                    <Select
                      value={drug.frequency}
                      onValueChange={(value) => handleInputChange(index, "frequency", value)}
                    >
                      <SelectTrigger className="w-full" id={`frequency-${index}`}>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        {frequencyOptions.map((frequency) => (
                          <SelectItem key={frequency} value={frequency}>
                            {frequency}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {drugs.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeDrug(index)}
                    className="absolute top-2 right-2 h-6 w-6 rounded-full p-0 text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Remove Drug</span>
                  </Button>
                )}
              </div>
            ))}

            <div className="mt-4 flex justify-center">
              <Button 
                onClick={addDrug} 
                variant="secondary"
                className="w-full md:w-auto flex items-center gap-2"
              >
                <Plus className="h-4 w-4" /> Add Another Drug
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="food" className="space-y-6">
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4">Food Interactions</h3>
              <p className="text-gray-600 mb-4">
                Specify foods that may interact with the medications.
              </p>
              
              <div className="flex gap-2 mb-4">
                <Input
                  placeholder="Enter food item"
                  value={newFood}
                  onChange={(e) => setNewFood(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleAddFood();
                    }
                  }}
                />
                <Button onClick={handleAddFood} variant="secondary">Add Food</Button>
              </div>

              {/* Food items list */}
              <div className="mt-4 mb-6">
                <h4 className="text-sm font-medium mb-2">Added Foods:</h4>
                {foodInteractions.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {foodInteractions.map((food, index) => (
                      <div key={index} className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-1">
                        <span>{food}</span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-4 w-4 rounded-full p-0"
                          onClick={() => handleRemoveFood(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No food interactions added yet.</p>
                )}
              </div>

              {/* Common foods suggestions */}
              <div>
                <h4 className="text-sm font-medium mb-2">Common Foods with Interactions:</h4>
                <div className="flex flex-wrap gap-2">
                  {commonFoods.map((food) => (
                    <Button
                      key={food}
                      variant="outline"
                      size="sm"
                      className={`${foodInteractions.includes(food) ? 'bg-blue-100' : ''}`}
                      onClick={() => addCommonFood(food)}
                    >
                      {food}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="alcohol" className="space-y-6">
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4">Alcohol Interactions</h3>
              <p className="text-gray-600 mb-4">
                Indicate whether alcohol consumption may interact with the medications.
              </p>
              
              <div className="flex items-center space-x-2 mb-6">
                <input
                  type="checkbox"
                  id="alcohol-interaction"
                  checked={alcoholInteractions}
                  onChange={(e) => onAlcoholInteractionsChange(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-5 w-5"
                />
                <Label htmlFor="alcohol-interaction">
                  Potential alcohol interaction with these medications
                </Label>
              </div>

              {alcoholInteractions && (
                <div className="mb-4">
                  <Label htmlFor="alcohol-details" className="mb-2 block">
                    Alcohol Interaction Details
                  </Label>
                  <Textarea 
                    id="alcohol-details"
                    placeholder="Describe potential interactions with alcohol..."
                    value={alcoholDetails}
                    onChange={(e) => onAlcoholDetailsChange(e.target.value)}
                    className="min-h-[120px]"
                  />
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DrugInput;
