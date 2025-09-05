// Client-side OpenAI utilities and types
// Note: The main AI processing happens on the server side for security

export interface OpenAIConfig {
  apiKey?: string;
  baseURL?: string;
}

export interface AIRecommendationRequest {
  formData: {
    educationLevel: string;
    fieldOfStudy?: string;
    currentRole?: string;
    yearsExperience: string;
    location: string;
    careerGoals: string;
    learningPreference: string;
  };
  sessionId: string;
}

export interface AIRecommendationResponse {
  sessionId: string;
  recommendation: {
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
  };
}

// Client-side utility functions for AI integration
export class OpenAIClient {
  private config: OpenAIConfig;

  constructor(config: OpenAIConfig = {}) {
    this.config = {
      apiKey: config.apiKey || import.meta.env.VITE_OPENAI_API_KEY,
      baseURL: config.baseURL || 'https://api.openai.com/v1',
    };
  }

  // Note: In production, all AI calls should go through the backend
  // This is primarily for type safety and client-side utilities
  async validateApiKey(): Promise<boolean> {
    if (!this.config.apiKey) {
      console.warn('OpenAI API key not configured');
      return false;
    }
    return true;
  }

  // Utility to format questionnaire data for AI processing
  static formatQuestionnaireForAI(formData: any): string {
    const educationLevelMap: Record<string, string> = {
      'high_school': 'High School Graduate',
      'associate': 'Associate Degree',
      'bachelor': 'Bachelor\'s Degree',
      'master': 'Master\'s Degree',
      'doctoral': 'Doctoral Degree'
    };

    const careerGoalsMap: Record<string, string> = {
      'leadership': 'Leadership and Management',
      'specialization': 'Technical Specialization',
      'research': 'Research and Academia',
      'industry_change': 'Career Transition'
    };

    const learningPreferenceMap: Record<string, string> = {
      'full_time': 'Full-time Study',
      'part_time': 'Part-time Study',
      'self_paced': 'Self-paced (FlexPath)'
    };

    return `
Education Level: ${educationLevelMap[formData.educationLevel] || formData.educationLevel}
Field of Study: ${formData.fieldOfStudy || 'Not specified'}
Current Role: ${formData.currentRole || 'Not specified'}
Years of Experience: ${formData.yearsExperience}
Location: ${formData.location}
Career Goals: ${careerGoalsMap[formData.careerGoals] || formData.careerGoals}
Learning Preference: ${learningPreferenceMap[formData.learningPreference] || formData.learningPreference}
    `.trim();
  }

  // Utility to validate recommendation response structure
  static validateRecommendation(recommendation: any): boolean {
    const requiredFields = [
      'recommendedProgram.title',
      'recommendedProgram.description',
      'recommendedProgram.matchScore',
      'programInsights.enrolled',
      'programInsights.graduated',
      'programInsights.completionTime',
      'programInsights.successRate',
      'careerProjections.jobTitles',
      'careerProjections.salaryRange',
      'financialInfo.estimatedCost'
    ];

    return requiredFields.every(field => {
      const value = field.split('.').reduce((obj, key) => obj?.[key], recommendation);
      return value !== undefined && value !== null;
    });
  }

  // Error handling utilities
  static getErrorMessage(error: any): string {
    if (error?.response?.data?.message) {
      return error.response.data.message;
    }
    if (error?.message) {
      return error.message;
    }
    return 'An unexpected error occurred while processing your assessment.';
  }

  // Utility to generate fallback recommendations when AI fails
  static generateFallbackRecommendation(formData: any): AIRecommendationResponse['recommendation'] {
    const educationLevel = formData.educationLevel;
    
    let programTitle = 'General Studies Program';
    let programDescription = 'Based on your profile, we recommend exploring our general studies program to help you identify your specific interests and career path.';
    
    // Provide more specific fallbacks based on education level
    if (educationLevel === 'high_school') {
      programTitle = 'Bachelor of Arts in Liberal Studies';
      programDescription = 'A foundational undergraduate program that provides broad knowledge across multiple disciplines, perfect for recent high school graduates exploring their interests.';
    } else if (educationLevel === 'bachelor') {
      programTitle = 'Master of Business Administration (MBA)';
      programDescription = 'A versatile graduate degree that develops leadership and business skills applicable across industries and career paths.';
    } else if (educationLevel === 'master') {
      programTitle = 'Professional Development Certificate';
      programDescription = 'Focused skill enhancement programs designed for experienced professionals seeking to advance their expertise.';
    }

    return {
      recommendedProgram: {
        title: programTitle,
        description: programDescription,
        matchScore: 70
      },
      programInsights: {
        enrolled: 800,
        graduated: 2000,
        completionTime: '24 months',
        successRate: 78
      },
      careerProjections: {
        jobTitles: ['Program Coordinator', 'Business Analyst', 'Project Manager'],
        salaryRange: '$45,000 - $75,000',
        industryGrowth: '5% growth by 2030',
        alumniExample: 'Graduate successfully transitioned to management role in their field'
      },
      financialInfo: {
        estimatedCost: '$18,000',
        scholarships: ['Merit-Based Scholarship', 'Need-Based Grant'],
        corporateDiscounts: true
      },
      alternativePathways: [
        {
          title: 'Professional Certificate Program',
          description: 'Focused skill development in specific area',
          matchScore: 65
        },
        {
          title: 'Associate Degree Program',
          description: 'Foundation for further education',
          matchScore: 60
        }
      ]
    };
  }
}

// Export singleton instance
export const openaiClient = new OpenAIClient();

// Type guards for runtime validation
export function isValidRecommendation(obj: any): obj is AIRecommendationResponse['recommendation'] {
  return OpenAIClient.validateRecommendation(obj);
}

export function isValidQuestionnaireData(obj: any): obj is AIRecommendationRequest['formData'] {
  return (
    typeof obj === 'object' &&
    typeof obj.educationLevel === 'string' &&
    typeof obj.yearsExperience === 'string' &&
    typeof obj.location === 'string' &&
    typeof obj.careerGoals === 'string' &&
    typeof obj.learningPreference === 'string'
  );
}
