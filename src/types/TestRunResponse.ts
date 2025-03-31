export type TestRunResponse = {
  id: number;
  testId: number;
  status: "queued" | "failed" | "completed" | "running";
  duration?: number;
  response: [] | object | string | null;
  expectations: {
    key: string;
    passed?: boolean;
    operator: string;
    value: string;
    error?: string;
  }[];
  APIResponse: [] | object | string | null;
  success: string;
  passed: boolean;
  error: string;
};
