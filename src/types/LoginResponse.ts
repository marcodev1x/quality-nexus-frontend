export interface LoginResponse {
  message: string,
  user: {
    token: string;
    id: number;
    email: string;
  };
}
