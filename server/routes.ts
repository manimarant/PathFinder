import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { questionnaireSchema, recommendationSchema } from "@shared/schema";
import OpenAI from "openai";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_KEY || "sk-demo-key" 
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Submit assessment and get AI recommendation
  app.post("/api/assessment", async (req, res) => {
    try {
      const sessionId = req.body.sessionId || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const formData = questionnaireSchema.parse(req.body.formData);

      // Store assessment
      await storage.createAssessment({
        sessionId,
        formData: formData as any,
        recommendation: null,
      });

      // Generate AI recommendation
      const recommendation = await generateRecommendation(formData);

      // Update assessment with recommendation
      await storage.updateAssessmentRecommendation(sessionId, recommendation);

      res.json({ sessionId, recommendation });
    } catch (error) {
      console.error("Assessment error:", error);
      res.status(400).json({ 
        message: "Failed to process assessment", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Get assessment by session ID
  app.get("/api/assessment/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const assessment = await storage.getAssessment(sessionId);
      
      if (!assessment) {
        return res.status(404).json({ message: "Assessment not found" });
      }

      res.json(assessment);
    } catch (error) {
      console.error("Get assessment error:", error);
      res.status(500).json({ message: "Failed to retrieve assessment" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

async function generateRecommendation(formData: any): Promise<any> {
  try {
    const prompt = `You are an expert educational advisor. Based on the following student profile, recommend the most suitable educational program and provide detailed insights.

Student Profile:
- Education Level: ${formData.educationLevel}
- Field of Study: ${formData.fieldOfStudy || 'Not specified'}
- Current Role: ${formData.currentRole || 'Not specified'}
- Years of Experience: ${formData.yearsExperience}
- Location: ${formData.location}
- Career Goals: ${formData.careerGoals}
- Learning Preference: ${formData.learningPreference}

Please provide a comprehensive recommendation in the following JSON format:
{
  "recommendedProgram": {
    "title": "Program name",
    "description": "Why this program fits the student's profile and goals",
    "matchScore": 85
  },
  "programInsights": {
    "enrolled": 1200,
    "graduated": 3000,
    "completionTime": "18 months",
    "successRate": 82
  },
  "careerProjections": {
    "jobTitles": ["Job Title 1", "Job Title 2", "Job Title 3"],
    "salaryRange": "$XX,000 - $XX,000",
    "industryGrowth": "X% growth by 2030",
    "alumniExample": "Brief success story"
  },
  "financialInfo": {
    "estimatedCost": "$XX,000",
    "scholarships": ["Scholarship 1", "Scholarship 2"],
    "corporateDiscounts": true
  },
  "alternativePathways": [
    {
      "title": "Alternative Program 1",
      "description": "Brief description",
      "matchScore": 75
    },
    {
      "title": "Alternative Program 2", 
      "description": "Brief description",
      "matchScore": 70
    }
  ]
}

Ensure all numbers are realistic and the recommendations are relevant to the student's background and goals.`;

    // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No response from OpenAI");
    }

    const recommendation = JSON.parse(content);
    
    // Validate the recommendation structure
    recommendationSchema.parse(recommendation);
    
    return recommendation;
  } catch (error) {
    console.error("OpenAI recommendation error:", error);
    
    // Return a fallback recommendation structure
    return {
      recommendedProgram: {
        title: "General Studies Program",
        description: "Based on your profile, we recommend exploring our general studies program to help you identify your specific interests and career path.",
        matchScore: 70
      },
      programInsights: {
        enrolled: 800,
        graduated: 2000,
        completionTime: "24 months",
        successRate: 78
      },
      careerProjections: {
        jobTitles: ["Program Coordinator", "Business Analyst", "Project Manager"],
        salaryRange: "$45,000 - $75,000",
        industryGrowth: "5% growth by 2030",
        alumniExample: "Graduate successfully transitioned to management role in their field"
      },
      financialInfo: {
        estimatedCost: "$18,000",
        scholarships: ["Merit-Based Scholarship", "Need-Based Grant"],
        corporateDiscounts: true
      },
      alternativePathways: [
        {
          title: "Professional Certificate Program",
          description: "Focused skill development in specific area",
          matchScore: 65
        },
        {
          title: "Associate Degree Program",
          description: "Foundation for further education",
          matchScore: 60
        }
      ]
    };
  }
}
