import { sql } from "drizzle-orm";
import { pgTable, text, varchar, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const assessments = pgTable("assessments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: text("session_id").notNull(),
  formData: jsonb("form_data").notNull(),
  recommendation: jsonb("recommendation"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertAssessmentSchema = createInsertSchema(assessments).omit({
  id: true,
  createdAt: true,
});

export const questionnaireSchema = z.object({
  educationLevel: z.enum(["high_school", "associate", "bachelor", "master", "doctoral"]),
  fieldOfStudy: z.string().optional(),
  currentRole: z.string().optional(),
  yearsExperience: z.string(),
  location: z.string(),
  careerGoals: z.enum(["leadership", "specialization", "research", "industry_change"]),
  learningPreference: z.enum(["full_time", "part_time", "self_paced"]),
});

export const recommendationSchema = z.object({
  recommendedProgram: z.object({
    title: z.string(),
    description: z.string(),
    matchScore: z.number(),
  }),
  programInsights: z.object({
    enrolled: z.number(),
    graduated: z.number(),
    completionTime: z.string(),
    successRate: z.number(),
  }),
  careerProjections: z.object({
    jobTitles: z.array(z.string()),
    salaryRange: z.string(),
    industryGrowth: z.string(),
    alumniExample: z.string(),
  }),
  financialInfo: z.object({
    estimatedCost: z.string(),
    scholarships: z.array(z.string()),
    corporateDiscounts: z.boolean(),
  }),
  alternativePathways: z.array(z.object({
    title: z.string(),
    description: z.string(),
    matchScore: z.number(),
  })),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertAssessment = z.infer<typeof insertAssessmentSchema>;
export type Assessment = typeof assessments.$inferSelect;
export type QuestionnaireData = z.infer<typeof questionnaireSchema>;
export type Recommendation = z.infer<typeof recommendationSchema>;
