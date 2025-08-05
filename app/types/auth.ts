export interface LoginRequest {
  UserName: string;
  Password: string;
}

export interface RefreshTokenRequest {
  RefreshToken: string;
}

export interface LoginResponse {
  AccessToken: string;
  RefreshToken: string;
}

export interface User {
  Name: string;
  Id: string;
  Fullname: string;
  RoleName: string;
  OrgCode?: string;
  OrgPath?: string;
  DeptId?: string;
  DeptName?: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
