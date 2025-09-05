import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { QuestionnaireFormData } from "@/types/questionnaire";

interface QuestionnaireStepperProps {
  onComplete: (formData: QuestionnaireFormData) => void;
  isLoading?: boolean;
}

const STEPS = [
  {
    id: 1,
    title: "What's your current education level?",
    field: "educationLevel",
    inputType: "radio" as const,
    options: [
      { value: "high_school", label: "High School Graduate", description: "Looking to start undergraduate studies" },
      { value: "associate", label: "Associate Degree", description: "Ready to pursue Bachelor's degree" },
      { value: "bachelor", label: "Bachelor's Degree", description: "Considering graduate programs" },
      { value: "master", label: "Master's Degree", description: "Exploring doctoral or certificate programs" },
      { value: "doctoral", label: "Doctoral Degree", description: "Seeking specialized or continuing education" },
    ],
  },
  {
    id: 2,
    title: "What field of study or major interests you most?",
    field: "fieldOfStudy",
    inputType: "text" as const,
  },
  {
    id: 3,
    title: "What is your current role or industry?",
    field: "currentRole",
    inputType: "text" as const,
  },
  {
    id: 4,
    title: "How many years of work experience do you have?",
    field: "yearsExperience",
    inputType: "radio" as const,
    options: [
      { value: "0-2", label: "0-2 years", description: "Entry level or recent graduate" },
      { value: "3-5", label: "3-5 years", description: "Some professional experience" },
      { value: "6-10", label: "6-10 years", description: "Mid-level professional" },
      { value: "10+", label: "10+ years", description: "Experienced professional" },
    ],
  },
  {
    id: 5,
    title: "What is your geographic location?",
    field: "location",
    inputType: "text" as const,
  },
  {
    id: 6,
    title: "What are your primary career aspirations?",
    field: "careerGoals",
    inputType: "radio" as const,
    options: [
      { value: "leadership", label: "Leadership", description: "Move into management or executive roles" },
      { value: "specialization", label: "Specialization", description: "Deepen expertise in current field" },
      { value: "research", label: "Research", description: "Pursue research or academic career" },
      { value: "industry_change", label: "Industry Change", description: "Transition to a new field or industry" },
    ],
  },
  {
    id: 7,
    title: "What is your preferred learning style?",
    field: "learningPreference",
    inputType: "radio" as const,
    options: [
      { value: "full_time", label: "Full-time", description: "Dedicated study schedule" },
      { value: "part_time", label: "Part-time", description: "Balance with work or other commitments" },
      { value: "self_paced", label: "Self-paced (FlexPath)", description: "Flexible, competency-based learning" },
    ],
  },
];

export function QuestionnaireStepper({ onComplete, isLoading = false }: QuestionnaireStepperProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<QuestionnaireFormData>({});

  const currentStepData = STEPS.find(step => step.id === currentStep);
  const progress = (currentStep / STEPS.length) * 100;

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(formData);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isStepValid = () => {
    if (!currentStepData) return false;
    const fieldValue = formData[currentStepData.field as keyof QuestionnaireFormData];
    return fieldValue && fieldValue.trim() !== "";
  };

  const renderStepInput = () => {
    if (!currentStepData) return null;

    const { field, inputType, options } = currentStepData;
    const value = formData[field as keyof QuestionnaireFormData] || "";

    if (inputType === "radio" && options) {
      return (
        <RadioGroup
          value={value}
          onValueChange={(value) => handleFieldChange(field, value)}
          className="grid gap-4"
          data-testid={`radio-group-${field}`}
        >
          {options.map((option) => (
            <div key={option.value} className="flex items-center space-x-4 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
              <RadioGroupItem value={option.value} id={option.value} data-testid={`radio-${option.value}`} />
              <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                <div className="font-medium">{option.label}</div>
                {option.description && (
                  <div className="text-sm text-muted-foreground">{option.description}</div>
                )}
              </Label>
            </div>
          ))}
        </RadioGroup>
      );
    }

    if (inputType === "text") {
      return (
        <Input
          value={value}
          onChange={(e) => handleFieldChange(field, e.target.value)}
          placeholder={`Enter your ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
          className="max-w-md"
          data-testid={`input-${field}`}
        />
      );
    }

    return null;
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="p-8">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium" data-testid="step-indicator">
              Step {currentStep} of {STEPS.length}
            </span>
            <span className="text-sm text-muted-foreground">Assessment Progress</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300" 
              style={{ width: `${progress}%` }}
              data-testid="progress-bar"
            />
          </div>
        </div>

        {/* Step content */}
        <div className="min-h-[400px]">
          <h3 className="text-2xl font-semibold mb-6" data-testid="step-title">
            {currentStepData?.title}
          </h3>
          <div className="mb-8">
            {renderStepInput()}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1 || isLoading}
            data-testid="button-previous"
          >
            Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={!isStepValid() || isLoading}
            data-testid="button-continue"
          >
            {isLoading ? "Processing..." : currentStep === STEPS.length ? "Get Recommendations" : "Continue"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
