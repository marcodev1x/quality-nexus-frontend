export type TestRunResponse = {
  id: number;
  testId: number;
  status: "queued" | "failed" | "completed" | "running";
  result: string;
  duration: number;
  response: [] | object | string | null;
  success: string;
  passed: boolean;
  error: string;
};
