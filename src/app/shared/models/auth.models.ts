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
  id: string;
  name: string;
  email: string;
  role: string;
  initials: string;
}

export interface LoginResponse {
  accessToken: string;
  expiresAt: string;
  user: AuthUser;
}
