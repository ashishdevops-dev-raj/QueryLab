import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { MonacoEditor } from "@/components/editor/MonacoEditor";
import { interviewQuestions } from "@/data/questions";
import { useInterviewStore } from "@/stores/useInterviewStore";
import { LoadingState } from "@/components/common/EmptyState";
import { toast } from "sonner";
import { cn } from "@/utils/cn";
import { QuestionNavigator } from "@/components/interview/QuestionNavigator";
import { Pause, Play } from "lucide-react";

export function InterviewPage() {
  const { questionId } = useParams();
  const navigate = useNavigate();
  const questionIndex = useInterviewStore((state) => state.questionIndex);
  const setQuestionIndex = useInterviewStore((state) => state.setQuestionIndex);
  const answers = useInterviewStore((state) => state.answers);
  const setAnswer = useInterviewStore((state) => state.setAnswer);
  const results = useInterviewStore((state) => state.results);
  const runCurrent = useInterviewStore((state) => state.runCurrent);
  const submitCurrent = useInterviewStore((state) => state.submitCurrent);
  const evaluating = useInterviewStore((state) => state.evaluating);
  const secondsLeft = useInterviewStore((state) => state.secondsLeft);
  const paused = useInterviewStore((state) => state.paused);
  const togglePause = useInterviewStore((state) => state.togglePause);
  const tick = useInterviewStore((state) => state.tick);
  const resultTab = useInterviewStore((state) => state.resultTab);
  const setResultTab = useInterviewStore((state) => state.setResultTab);

  useEffect(() => {
    if (!questionId) return;
    const index = interviewQuestions.findIndex((question) => question.id === questionId);
    if (index >= 0) setQuestionIndex(index);
  }, [questionId, setQuestionIndex]);

  useEffect(() => {
    const timer = window.setInterval(() => tick(), 1000);
    return () => window.clearInterval(timer);
  }, [tick]);

  const question = interviewQuestions[questionIndex] ?? interviewQuestions[1];
  const result = results[question.id];
  const mins = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const secs = String(secondsLeft % 60).padStart(2, "0");
  const previous = interviewQuestions[questionIndex - 1];
  const next = interviewQuestions[questionIndex + 1];

  const goTo = (index: number) => {
    const target = interviewQuestions[index];
    if (!target) return;
    setQuestionIndex(index);
    navigate(`/interview/${target.id}`);
  };

  return (
    <AppShell>
      <div className="bg-surface-container-lowest px-4 py-2 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-label-md text-outline">SQL INTERVIEW</p>
            <p className="text-headline-sm">{question.track}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-lg bg-surface-container-low px-3 py-1">
              Remaining
              <span className="font-mono text-code-md font-semibold text-tertiary-container">
                {mins}:{secs}
              </span>
              <Button variant="ghost" size="icon" aria-label="Pause timer" onClick={togglePause}>
                {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              </Button>
            </div>
            <span className="rounded bg-surface-container px-2 py-1 font-mono text-code-sm">PostgreSQL</span>
          </div>
        </div>
        <div className="mt-2 h-1 rounded bg-surface-container">
          <div
            className="h-1 rounded bg-primary"
            style={{ width: `${((questionIndex + 1) / interviewQuestions.length) * 100}%` }}
          />
        </div>
        <p className="mt-1 font-mono text-label-sm text-outline">
          {question.prompt} of {interviewQuestions.length}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 p-4 lg:grid-cols-12">
        <div className="space-y-3 lg:col-span-5">
          <section className="rounded-lg bg-surface-container-lowest p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-label-sm font-semibold uppercase tracking-widest text-primary">
                  Technical Assessment • Part 1
                </p>
                <h1 className="text-headline-md">
                  {question.prompt}: {question.title}
                </h1>
              </div>
              <div className="flex shrink-0 flex-wrap items-center gap-1">
                <span className="rounded bg-tertiary-fixed px-2 py-0.5 font-mono text-label-sm text-on-tertiary-fixed">
                  {question.difficulty}
                </span>
                <span className="rounded bg-surface-container-high px-2 py-0.5 font-mono text-code-sm">
                  {question.points} pts
                </span>
                <span className="rounded bg-surface-container px-2 py-0.5 font-mono text-label-sm text-on-surface-variant">
                  {question.category}
                </span>
              </div>
            </div>
            <p className="mt-2 text-body-md">{question.description}</p>
            <div className="mt-3 rounded-lg bg-surface-container-low p-3 font-mono text-code-sm">
              {question.schema.tables.map((table) => (
                <div key={table.name}>
                  <p className="font-semibold">{table.name}</p>
                  {table.columns.map((column) => (
                    <p key={column.name} className="flex justify-between">
                      <span>
                        {column.name}
                        {column.primaryKey ? " PK" : ""}
                      </span>
                      <span className="text-outline">{column.type}</span>
                    </p>
                  ))}
                </div>
              ))}
            </div>
          </section>

          {question.sampleData.map((sample) => (
            <section key={sample.tableName} className="rounded-lg bg-surface-container-lowest p-4 shadow-sm">
              <h2 className="mb-2 text-headline-sm">Sample data · {sample.tableName}</h2>
              <div className="overflow-auto rounded-lg bg-surface-container-low">
                <table className="w-full text-left font-mono text-code-sm">
                  <thead>
                    <tr>
                      {sample.columns.map((column) => (
                        <th key={column.name} className="px-3 py-1 text-outline">
                          {column.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sample.rows.map((row, index) => (
                      <tr key={index}>
                        {sample.columns.map((column) => (
                          <td key={column.name} className="px-3 py-1">
                            {String(row[column.name] ?? "NULL")}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ))}
          <QuestionNavigator currentIndex={questionIndex} onSelect={goTo} />
        </div>

        <div className="space-y-3 lg:col-span-7">
          <section className="overflow-hidden rounded-lg bg-surface-container-lowest shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 bg-surface-container-low px-3 py-1.5">
              <span className="font-mono text-code-sm font-semibold">solution.sql</span>
              <div className="flex gap-1">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={async () => {
                    await runCurrent();
                    toast.success("Query executed successfully");
                  }}
                >
                  Run Code
                </Button>
                <Button
                  variant="success"
                  size="sm"
                  onClick={async () => {
                    const next = await submitCurrent();
                    toast.success(next?.passed ? "Answer submitted" : "Submitted — review test results");
                  }}
                >
                  Submit Answer
                </Button>
              </div>
            </div>
            <div className="h-[240px]">
              <MonacoEditor
                language="sql"
                value={answers[question.id] ?? question.starterSql}
                onChange={(value) => setAnswer(question.id, value)}
              />
            </div>
          </section>

          <section className="rounded-lg bg-surface-container-lowest shadow-sm">
            <div className="flex gap-1 bg-surface-container-low px-3 pt-1">
              {(["tests", "output", "explain"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  className={cn(
                    "rounded-t px-3 py-1 text-body-sm",
                    resultTab === tab ? "bg-surface-container-lowest font-semibold text-primary" : "text-on-surface-variant",
                  )}
                  onClick={() => setResultTab(tab)}
                >
                  {tab === "tests" ? `Test Results (${result?.passedCount ?? 0}/${result?.totalCount ?? 3})` : tab === "output" ? "Raw Output" : "Console & EXPLAIN"}
                </button>
              ))}
            </div>
            <div className="p-4">
              {evaluating ? <LoadingState label="Evaluating…" /> : null}
              {!evaluating && !result ? (
                <p className="text-body-sm text-on-surface-variant">Run or submit to see evaluation.</p>
              ) : null}
              {!evaluating && result && resultTab === "tests" ? (
                <div className="space-y-2">
                  <div className="rounded-lg bg-secondary-container/20 p-3">
                    <p className="text-body-md font-semibold">
                      {result.passed ? "Passed" : "Partial / failed"} • {result.passedCount}/{result.totalCount} test cases
                    </p>
                    <p className="font-mono text-label-sm">Execution time: {result.executionTimeMs} ms</p>
                    {result.performanceHint ? <p className="text-body-sm text-tertiary">{result.performanceHint}</p> : null}
                  </div>
                  {result.testCases.map((test) => (
                    <div key={test.id} className="flex items-center justify-between rounded bg-surface-container-low p-2">
                      <div>
                        <p className="text-body-sm font-medium">{test.name}</p>
                        <p className="font-mono text-code-sm text-outline">{test.description}</p>
                      </div>
                      <span
                        className={cn(
                          "rounded px-2 py-0.5 font-mono text-label-sm",
                          test.status === "passed"
                            ? "bg-secondary-container/40 text-secondary"
                            : "bg-error-container text-on-error-container",
                        )}
                      >
                        {test.status.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              ) : null}
              {!evaluating && result && resultTab === "output" ? (
                <pre className="overflow-auto font-mono text-code-sm">{JSON.stringify(result.outputRows, null, 2)}</pre>
              ) : null}
              {!evaluating && result && resultTab === "explain" ? (
                <ul className="text-body-sm">
                  <li>Query executes: {result.queryExecutes ? "yes" : "no"}</li>
                  <li>SQL correctness: {result.correctness ? "yes" : "no"}</li>
                  <li>Duplicate handling: {result.duplicateHandling ? "yes" : "review"}</li>
                  <li>NULL handling: {result.nullHandling ? "yes" : "failed"}</li>
                </ul>
              ) : null}
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 bg-surface-container p-3">
              <Button variant="outline" disabled={!previous} onClick={() => goTo(questionIndex - 1)}>
                Previous{previous ? `: Q${questionIndex} (${previous.title})` : ""}
              </Button>
              <Button variant="outline" disabled={!next} onClick={() => goTo(questionIndex + 1)}>
                Next{next ? `: Q${questionIndex + 2} (${next.title})` : ""}
              </Button>
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
