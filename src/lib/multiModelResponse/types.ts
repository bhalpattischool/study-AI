
import { Message } from "../db";

export interface ModelResponse {
  text: string;
  success: boolean;
  model: string;
}

export interface StudyPlanParams {
  examName: string;
  examDate: string;
  subjects: string;
  dailyHours: string;
  language: string;
}
