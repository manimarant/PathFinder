export interface QuestionnaireStep {
  id: number;
  title: string;
  field: string;
  options?: Array<{
    value: string;
    label: string;
    description?: string;
  }>;
  inputType?: 'radio' | 'text' | 'select';
  required?: boolean;
}

export interface QuestionnaireFormData {
  educationLevel?: string;
  fieldOfStudy?: string;
  currentRole?: string;
  yearsExperience?: string;
  location?: string;
  careerGoals?: string;
  learningPreference?: string;
}

export interface Recommendation {
  recommendedProgram: {
    title: string;
    description: string;
    matchScore: number;
  };
  programInsights: {
    enrolled: number;
    graduated: number;
    completionTime: string;
    successRate: number;
  };
  careerProjections: {
    jobTitles: string[];
    salaryRange: string;
    industryGrowth: string;
    alumniExample: string;
  };
  financialInfo: {
    estimatedCost: string;
    scholarships: string[];
    corporateDiscounts: boolean;
  };
  alternativePathways: Array<{
    title: string;
    description: string;
    matchScore: number;
  }>;
}
