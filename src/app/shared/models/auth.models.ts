export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
}

export interface AuthUser {
  fullName: string;
  email: string;
}

export interface LoginResponse {
  accessToken: string;
  expiresAtUtc: string;
  fullName: string;
  email: string;
}
