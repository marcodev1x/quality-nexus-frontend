export type TestRunResponse = {
  id: number;
  testId: number;
  status: "queued" | "failed" | "completed" | "running";
  result: string;
  duration: number;
  results: JSON;
};
