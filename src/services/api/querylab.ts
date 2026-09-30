import type { CreateProjectPayload, InterviewApi, ProjectsApi, QueryApi } from "@/types/api";
import { apiClient } from "./client";
import { useProjectStore } from "@/stores/useProjectStore";
import { useHistoryStore } from "@/stores/useHistoryStore";
import { useQueryStore } from "@/stores/useQueryStore";
import { interviewQuestions } from "@/data/questions";
import { evaluateInterviewQuery } from "@/services/interview/evaluator";

const useMock = import.meta.env.VITE_USE_MOCK_API !== "false";

export const projectsApi: ProjectsApi = {
  list: () => (useMock ? Promise.resolve(useProjectStore.getState().projects) : apiClient.get("/projects")),
  get: (id) =>
    useMock
      ? Promise.resolve(useProjectStore.getState().projects.find((project) => project.id === id)! )
      : apiClient.get(`/projects/${id}`),
  create: (payload: CreateProjectPayload) =>
    useMock ? Promise.resolve(useProjectStore.getState().createProject(payload)) : apiClient.post("/projects", payload),
  fork: (id) =>
    useMock ? Promise.resolve(useProjectStore.getState().forkProject(id)!) : apiClient.post(`/projects/${id}/fork`),
  share: (id, payload) => {
    if (useMock) {
      useProjectStore.getState().shareProject(id, payload.visibility, payload.permission);
      return Promise.resolve(useProjectStore.getState().projects.find((project) => project.id === id)!);
    }
    return apiClient.post(`/projects/${id}/share`, payload);
  },
  update: (id, patch) => {
    if (useMock) {
      useProjectStore.getState().updateProject(id, patch);
      return Promise.resolve(useProjectStore.getState().projects.find((project) => project.id === id)!);
    }
    return apiClient.patch(`/projects/${id}`, patch);
  },
  remove: (id) => (useMock ? Promise.resolve(useProjectStore.getState().deleteProject(id)) : apiClient.delete(`/projects/${id}`)),
};

export const queryApi: QueryApi = {
  execute: (payload) =>
    useMock ? useQueryStore.getState().runQuery(payload.sql) : apiClient.post("/query/execute", payload),
  validate: (sql) =>
    useMock ? useQueryStore.getState().validateQuery(sql) : apiClient.post("/query/validate", { sql }),
  history: () => (useMock ? Promise.resolve(useHistoryStore.getState().entries) : apiClient.get("/query/history")),
};

export const interviewApi: InterviewApi = {
  questions: () => (useMock ? Promise.resolve(interviewQuestions) : apiClient.get("/interview/questions")),
  submit: async (payload) => {
    if (!useMock) return apiClient.post("/interview/submit", payload);
    const question = interviewQuestions.find((item) => item.id === payload.questionId);
    if (!question) throw new Error("Question not found");
    return evaluateInterviewQuery(question, payload.sql);
  },
};
