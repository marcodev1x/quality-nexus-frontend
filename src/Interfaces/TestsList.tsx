export interface TestsList {
  id: number;
  type: "integration" | "load" | "performance";
  description: string;
  config: {
    method: string;
    url: string;
    headers: {
      [key: string]: string;
    };
    body: string;
    expectations: {
      key: string;
      value: string;
      operator: string;
    }[];
  };
}
