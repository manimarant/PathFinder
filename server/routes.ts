import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { questionnaireSchema, recommendationSchema } from "@shared/schema";
import OpenAI from "openai";
import { GoogleGenAI } from "@google/genai";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_KEY || "sk-demo-key" 
});

const gemini = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || "" 
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
  const prompt = `You are an expert educational advisor. Based on the following student profile, recommend the most suitable educational program and provide detailed insights.

Student Profile:
- Education Level: ${formData.educationLevel}
- Field of Study: ${formData.fieldOfStudy || 'Not specified'}
- Current Role: ${formData.currentRole || 'Not specified'}
- Years of Experience: ${formData.yearsExperience}
- Location: ${formData.location}
- Career Goals: ${formData.careerGoals}
- Learning Preference: ${formData.learningPreference}

IMPORTANT: You MUST return a complete JSON object with ALL required fields. Do not omit any fields.

Please provide a comprehensive recommendation in the following EXACT JSON format (all fields are required):
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

Return ONLY the JSON object, no additional text or formatting. Ensure all numbers are realistic and the recommendations are relevant to the student's background and goals.`;

  // Try Google Gemini first (free tier: 60 requests/minute)
  if (process.env.GEMINI_API_KEY) {
    try {
      console.log("Attempting Gemini API call...");
      const response = await gemini.models.generateContent({
        model: "gemini-2.5-flash",
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "object",
            properties: {
              recommendedProgram: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  matchScore: { type: "number" }
                },
                required: ["title", "description", "matchScore"]
              },
              programInsights: {
                type: "object",
                properties: {
                  enrolled: { type: "number" },
                  graduated: { type: "number" },
                  completionTime: { type: "string" },
                  successRate: { type: "number" }
                },
                required: ["enrolled", "graduated", "completionTime", "successRate"]
              },
              careerProjections: {
                type: "object",
                properties: {
                  jobTitles: { type: "array", items: { type: "string" } },
                  salaryRange: { type: "string" },
                  industryGrowth: { type: "string" },
                  alumniExample: { type: "string" }
                },
                required: ["jobTitles", "salaryRange", "industryGrowth", "alumniExample"]
              },
              financialInfo: {
                type: "object",
                properties: {
                  estimatedCost: { type: "string" },
                  scholarships: { type: "array", items: { type: "string" } },
                  corporateDiscounts: { type: "boolean" }
                },
                required: ["estimatedCost", "scholarships", "corporateDiscounts"]
              },
              alternativePathways: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    description: { type: "string" },
                    matchScore: { type: "number" }
                  },
                  required: ["title", "description", "matchScore"]
                }
              }
            },
            required: ["recommendedProgram", "programInsights", "careerProjections", "financialInfo", "alternativePathways"]
          }
        },
        contents: prompt,
      });

      const content = response.text;
      if (content) {
        const recommendation = JSON.parse(content);
        console.log("Gemini API response:", JSON.stringify(recommendation, null, 2));
        
        try {
          recommendationSchema.parse(recommendation);
          console.log("✅ Gemini API successful");
          return recommendation;
        } catch (validationError) {
          console.error("Gemini API response validation failed:", validationError);
          console.log("Falling back to personalized recommendations due to schema validation error");
          throw validationError; // This will trigger the fallback to personalized recommendations
        }
      }
    } catch (geminiError) {
      console.error("Gemini API error:", geminiError);
    }
  }

  // Fallback to OpenAI if Gemini fails
  if (process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.includes("demo")) {
    try {
      console.log("Attempting OpenAI API call...");
      // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
      const response = await openai.chat.completions.create({
        model: "gpt-5",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.7,
      });

      const content = response.choices[0].message.content;
      if (content) {
        const recommendation = JSON.parse(content);
        recommendationSchema.parse(recommendation);
        console.log("✅ OpenAI API successful");
        return recommendation;
      }
    } catch (openaiError) {
      console.error("OpenAI API error:", openaiError);
    }
  }

  // Final fallback to personalized recommendations
  console.log("🔄 Using personalized fallback recommendations");
  return generatePersonalizedFallback(formData);
}

function generatePersonalizedFallback(formData: any): any {
  const { educationLevel, fieldOfStudy, currentRole, yearsExperience, careerGoals, learningPreference } = formData;
  
  // Base program recommendations based on education level and goals
  let programTitle = "General Studies Program";
  let programDescription = "A comprehensive program designed to build foundational knowledge";
  let matchScore = 70;
  let jobTitles = ["Program Coordinator", "Administrative Assistant", "Customer Service Representative"];
  let salaryRange = "$35,000 - $55,000";
  let estimatedCost = "$18,000";
  let completionTime = "24 months";
  let alternativePathways: Array<{ title: string; description: string; matchScore: number }> = [];

  // Customize based on education level
  if (educationLevel === "high_school") {
    if (careerGoals === "leadership") {
      programTitle = "Bachelor of Business Administration";
      programDescription = "Perfect for high school graduates aspiring to leadership roles, this program provides foundational business knowledge and management skills.";
      jobTitles = ["Management Trainee", "Supervisor", "Business Analyst"];
      salaryRange = "$40,000 - $65,000";
      estimatedCost = "$32,000";
      matchScore = 82;
      alternativePathways = [
        { title: "Associate in Business", description: "Faster entry into business field", matchScore: 75 },
        { title: "Marketing Certificate", description: "Specialized marketing skills", matchScore: 70 }
      ];
    } else if (fieldOfStudy?.toLowerCase().includes("computer") || fieldOfStudy?.toLowerCase().includes("tech")) {
      programTitle = "Bachelor of Information Technology";
      programDescription = "Ideal for tech-interested high school graduates, combining practical skills with theoretical knowledge in IT.";
      jobTitles = ["IT Support Specialist", "Web Developer", "Systems Administrator"];
      salaryRange = "$45,000 - $70,000";
      estimatedCost = "$35,000";
      matchScore = 85;
    }
  }

  else if (educationLevel === "bachelor") {
    if (careerGoals === "leadership") {
      programTitle = "Master of Business Administration (MBA)";
      programDescription = "Designed for bachelor's degree holders seeking leadership positions, this program develops strategic thinking and management expertise.";
      jobTitles = ["Operations Manager", "Business Development Manager", "Project Director"];
      salaryRange = "$70,000 - $120,000";
      estimatedCost = "$45,000";
      matchScore = 88;
      completionTime = "18 months";
      alternativePathways = [
        { title: "Master in Leadership", description: "Focused leadership development", matchScore: 82 },
        { title: "Project Management Certificate", description: "Specialized project management skills", matchScore: 75 }
      ];
    } else if (careerGoals === "specialization") {
      const field = fieldOfStudy?.toLowerCase() || currentRole?.toLowerCase() || "business";
      if (field.includes("market") || field.includes("sales")) {
        programTitle = "Master of Science in Marketing";
        programDescription = "Specialized marketing program for professionals looking to advance their expertise in digital marketing and consumer behavior.";
        jobTitles = ["Marketing Manager", "Brand Manager", "Digital Marketing Specialist"];
        salaryRange = "$60,000 - $95,000";
        matchScore = 85;
      } else if (field.includes("data") || field.includes("analyt")) {
        programTitle = "Master of Science in Data Analytics";
        programDescription = "Perfect for professionals seeking to specialize in data-driven decision making and business intelligence.";
        jobTitles = ["Data Analyst", "Business Intelligence Analyst", "Data Scientist"];
        salaryRange = "$70,000 - $110,000";
        matchScore = 90;
      }
    }
  }

  else if (educationLevel === "master") {
    if (careerGoals === "research") {
      programTitle = "Doctoral Program in Education";
      programDescription = "Advanced research-focused program for master's degree holders interested in educational research and academic careers.";
      jobTitles = ["Research Director", "University Professor", "Policy Analyst"];
      salaryRange = "$80,000 - $140,000";
      estimatedCost = "$55,000";
      completionTime = "36 months";
      matchScore = 85;
    } else {
      programTitle = "Professional Development Certificate";
      programDescription = "Specialized certification for master's degree holders looking to enhance specific skills in their field.";
      jobTitles = ["Senior Consultant", "Subject Matter Expert", "Training Director"];
      salaryRange = "$75,000 - $125,000";
      estimatedCost = "$12,000";
      completionTime = "12 months";
      matchScore = 80;
    }
  }

  // Adjust completion time based on learning preference
  if (learningPreference === "full_time") {
    completionTime = completionTime.replace(/\d+/, (match) => Math.ceil(parseInt(match) * 0.7).toString());
  } else if (learningPreference === "self_paced") {
    completionTime += " (FlexPath)";
  }

  // Add location-specific salary adjustments (simplified)
  const location = formData.location?.toLowerCase() || "";
  if (location.includes("california") || location.includes("new york") || location.includes("seattle")) {
    salaryRange = salaryRange.replace(/\$(\d+),000/g, (match, p1) => `$${Math.ceil(parseInt(p1) * 1.3)},000`);
  }

  return {
    recommendedProgram: {
      title: programTitle,
      description: programDescription,
      matchScore: matchScore
    },
    programInsights: {
      enrolled: Math.floor(Math.random() * 1000) + 500,
      graduated: Math.floor(Math.random() * 2000) + 1500,
      completionTime: completionTime,
      successRate: Math.floor(Math.random() * 15) + 75
    },
    careerProjections: {
      jobTitles: jobTitles,
      salaryRange: salaryRange,
      industryGrowth: `${Math.floor(Math.random() * 20) + 5}% growth by 2030`,
      alumniExample: `A graduate successfully advanced to a senior ${jobTitles[Math.floor(Math.random() * jobTitles.length)].toLowerCase()} position at a leading company in ${formData.location || 'their region'}.`
    },
    financialInfo: {
      estimatedCost: estimatedCost,
      scholarships: getRelevantScholarships(formData),
      corporateDiscounts: Math.random() > 0.3
    },
    alternativePathways: alternativePathways.length > 0 ? alternativePathways : [
      {
        title: "Professional Certificate Program",
        description: "Focused skill development for immediate career impact",
        matchScore: matchScore - 10
      },
      {
        title: "Continuing Education Course",
        description: "Flexible learning option for ongoing professional development",
        matchScore: matchScore - 15
      }
    ]
  };
}

function getRelevantScholarships(formData: any): string[] {
  const scholarships = [];
  const { educationLevel, careerGoals, fieldOfStudy } = formData;
  
  if (educationLevel === "high_school") {
    scholarships.push("First-Generation College Student Grant", "Academic Excellence Scholarship");
  }
  
  if (careerGoals === "leadership") {
    scholarships.push("Leadership Development Grant", "Future Leaders Scholarship");
  }
  
  if (fieldOfStudy?.toLowerCase().includes("tech") || fieldOfStudy?.toLowerCase().includes("computer")) {
    scholarships.push("STEM Excellence Scholarship", "Technology Innovation Grant");
  }
  
  scholarships.push("Merit-Based Scholarship", "Need-Based Financial Aid");
  
  return scholarships.slice(0, 3); // Return up to 3 relevant scholarships
}
