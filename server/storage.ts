import { type User, type InsertUser, type Assessment, type InsertAssessment } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createAssessment(assessment: InsertAssessment): Promise<Assessment>;
  getAssessment(sessionId: string): Promise<Assessment | undefined>;
  updateAssessmentRecommendation(sessionId: string, recommendation: any): Promise<Assessment | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private assessments: Map<string, Assessment>;

  constructor() {
    this.users = new Map();
    this.assessments = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createAssessment(insertAssessment: InsertAssessment): Promise<Assessment> {
    const id = randomUUID();
    const assessment: Assessment = {
      ...insertAssessment,
      id,
      createdAt: new Date(),
      recommendation: null,
    };
    this.assessments.set(assessment.sessionId, assessment);
    return assessment;
  }

  async getAssessment(sessionId: string): Promise<Assessment | undefined> {
    return this.assessments.get(sessionId);
  }

  async updateAssessmentRecommendation(sessionId: string, recommendation: any): Promise<Assessment | undefined> {
    const assessment = this.assessments.get(sessionId);
    if (assessment) {
      assessment.recommendation = recommendation;
      this.assessments.set(sessionId, assessment);
      return assessment;
    }
    return undefined;
  }
}

export const storage = new MemStorage();
