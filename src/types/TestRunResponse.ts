export type TestRunResponse = {
  id: number;
  testId: number;
  status: "queued" | "failed" | "completed" | "running";
  duration?: number;
  response: [] | object | string | null;
  expectations: {
    key: string;
    passed: {
      status: boolean;
      found: any;
    };
    operator: string;
    value: string;
    error?: string;
  }[];
  APIResponse: [] | object | string | null;
  success: string;
  passed: boolean;
  error: string;
  loadResponse: [] | object | string | null;
};

export type TestLoadResponse = {
  title: string;
  url: string;
  connections: number;
  sampleInt: number;
  pipelining: number;
  workers: number;
  duration: number;
  samples: number;
  start: string; // ISO string, pode usar Date se for convertido depois
  finish: string;
  errors: number;
  timeouts: number;
  mismatches: number;
  non2xx: number;
  resets: number;
  "1xx": number;
  "2xx": number;
  "3xx": number;
  "4xx": number;
  "5xx": number;
  statusCodeStats: {
    [statusCode: string]: {
      count: number;
    };
  };
  latency: {
    average: number;
    mean: number;
    stddev: number;
    min: number;
    max: number;
    p0_001: number;
    p0_01: number;
    p0_1: number;
    p1: number;
    p2_5: number;
    p10: number;
    p25: number;
    p50: number;
    p75: number;
    p90: number;
    p97_5: number;
    p99: number;
    p99_9: number;
    p99_99: number;
    p99_999: number;
    totalCount: number;
  };
  requests: {
    average: number;
    mean: number;
    stddev: number;
    min: number;
    max: number;
    total: number;
    p0_001: number;
    p0_01: number;
    p0_1: number;
    p1: number;
    p2_5: number;
    p10: number;
    p25: number;
    p50: number;
    p75: number;
    p90: number;
    p97_5: number;
    p99: number;
    p99_9: number;
    p99_99: number;
    p99_999: number;
    sent: number;
  };
  throughput: {
    average: number;
    mean: number;
    stddev: number;
    min: number;
    max: number;
    total: number;
    p0_001: number;
    p0_01: number;
    p0_1: number;
    p1: number;
    p2_5: number;
    p10: number;
    p25: number;
    p50: number;
    p75: number;
    p90: number;
    p97_5: number;
    p99: number;
    p99_9: number;
    p99_99: number;
    p99_999: number;
  };
};
