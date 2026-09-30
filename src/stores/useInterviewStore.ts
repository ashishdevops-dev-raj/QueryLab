import { create } from "zustand";
import { persist } from "zustand/middleware";
import { interviewQuestions } from "@/data/questions";
import type { EvaluationResult } from "@/types/interview";
import { evaluateInterviewQuery } from "@/services/interview/evaluator";

interface InterviewState {
  questionIndex: number;
  answers: Record<string, string>;
  results: Record<string, EvaluationResult>;
  secondsLeft: number;
  paused: boolean;
  evaluating: boolean;
  resultTab: "tests" | "output" | "explain";
  setQuestionIndex: (index: number) => void;
  setAnswer: (questionId: string, sql: string) => void;
  runCurrent: () => Promise<EvaluationResult | undefined>;
  submitCurrent: () => Promise<EvaluationResult | undefined>;
  tick: () => void;
  togglePause: () => void;
  setResultTab: (tab: InterviewState["resultTab"]) => void;
}

export const useInterviewStore = create<InterviewState>()(
  persist(
    (set, get) => ({
      questionIndex: 1,
      answers: Object.fromEntries(interviewQuestions.map((question) => [question.id, question.starterSql])),
      results: {},
      secondsLeft: 15 * 60 + 30,
      paused: false,
      evaluating: false,
      resultTab: "tests",
      setQuestionIndex: (questionIndex) => set({ questionIndex }),
      setAnswer: (questionId, sql) =>
        set((state) => ({ answers: { ...state.answers, [questionId]: sql } })),
      runCurrent: async () => {
        const { questionIndex, answers } = get();
        const question = interviewQuestions[questionIndex];
        if (!question) return undefined;
        set({ evaluating: true });
        const result = await evaluateInterviewQuery(question, answers[question.id] ?? "");
        set((state) => ({
          evaluating: false,
          results: { ...state.results, [question.id]: result },
          resultTab: "tests",
        }));
        return result;
      },
      submitCurrent: async () => get().runCurrent(),
      tick: () =>
        set((state) => ({
          secondsLeft: state.paused || state.secondsLeft <= 0 ? state.secondsLeft : state.secondsLeft - 1,
        })),
      togglePause: () => set((state) => ({ paused: !state.paused })),
      setResultTab: (resultTab) => set({ resultTab }),
    }),
    {
      name: "querylab-interview",
      partialize: (state) => ({
        questionIndex: state.questionIndex,
        answers: state.answers,
        results: state.results,
        secondsLeft: state.secondsLeft,
      }),
      merge: (persisted, current) => {
        const saved = persisted as Partial<InterviewState> | undefined;
        const starters = Object.fromEntries(
          interviewQuestions.map((question) => [question.id, question.starterSql]),
        );
        return {
          ...current,
          ...saved,
          answers: { ...starters, ...(saved?.answers ?? {}) },
          results: saved?.results ?? current.results,
        };
      },
    },
  ),
);
