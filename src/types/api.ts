import type { DatabaseEngine } from "./database";
import type { Project } from "./project";
import type { HistoryEntry } from "./query";
import type { EvaluationResult, InterviewQuestion } from "./interview";
import type { QueryResult } from "./database";

export interface ApiErrorBody {
  message: string;
  details?: string;
  status: number;
}

export interface CreateProjectPayload {
  name: string;
  engine: DatabaseEngine;
  description: string;
}

export interface ExecuteQueryPayload {
  sql: string;
  projectId: string;
}

export interface ShareProjectPayload {
  visibility: "private" | "anyone";
  permission: "view" | "edit";
}

export interface SubmitInterviewPayload {
  questionId: string;
  sql: string;
}

export interface ProjectsApi {
  list(): Promise<Project[]>;
  get(id: string): Promise<Project>;
  create(payload: CreateProjectPayload): Promise<Project>;
  fork(id: string): Promise<Project>;
  share(id: string, payload: ShareProjectPayload): Promise<Project>;
  update(id: string, patch: Partial<Project>): Promise<Project>;
  remove(id: string): Promise<void>;
}

export interface QueryApi {
  execute(payload: ExecuteQueryPayload): Promise<QueryResult>;
  validate(sql: string): Promise<{ valid: boolean; message?: string }>;
  history(): Promise<HistoryEntry[]>;
}

export interface InterviewApi {
  questions(): Promise<InterviewQuestion[]>;
  submit(payload: SubmitInterviewPayload): Promise<EvaluationResult>;
}
