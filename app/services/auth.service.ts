import type {
  LoginRequest,
  LoginResponse,
  ResponseMessage,
} from "~/types/auth";
import { httpClient, ApiError } from "~/services/http-client";

export class AuthService {
  private static instance: AuthService;

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(credentials: LoginRequest): Promise<ResponseMessage> {
    try {
      const { Data, Success, Message, StatusCode } =
        await httpClient.post<ResponseMessage>("/Auth/login", credentials);
      return { Data, Success, Message, StatusCode };
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(error.message || "Đăng nhập thất bại");
      }
      throw new Error("Lỗi mạng trong quá trình đăng nhập");
    }
  }

  async refreshToken(refreshToken: string): Promise<ResponseMessage> {
    try {
      const { Data, Success, Message, StatusCode } =
        await httpClient.post<ResponseMessage>(
          `/Auth/refresh-token?refreshToken`,
          { RefreshToken: refreshToken }
        );
      return { Data, Success, Message, StatusCode };
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(error.message || "Làm mới token thất bại");
      }
      throw new Error("Lỗi mạng trong quá trình làm mới token");
    }
  }

  async logout(refreshToken: string): Promise<void> {
    try {
      await httpClient.post("/Auth/logout", { refreshToken });
    } catch (error) {
      // Logout errors are not critical, log but don't throw
      console.warn("Logout request failed:", error);
    }
  }

  // Helper method to make authenticated requests
  async authenticatedGet<T>(
    url: string,
    params?: Record<string, any>
  ): Promise<T> {
    return httpClient.get<T>(url, params);
  }

  async authenticatedPost<T>(url: string, data?: any): Promise<T> {
    return httpClient.post<T>(url, data);
  }

  async authenticatedPut<T>(url: string, data?: any): Promise<T> {
    return httpClient.put<T>(url, data);
  }

  async authenticatedDelete<T>(url: string): Promise<T> {
    return httpClient.delete<T>(url);
  }

  // Token storage methods
  storeTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    // Cập nhật token cho HttpClient
    httpClient.setAccessToken(accessToken);
  }

  getStoredAccessToken(): string | null {
    return localStorage.getItem("accessToken");
  }

  getStoredRefreshToken(): string | null {
    return localStorage.getItem("refreshToken");
  }

  clearStoredTokens(): void {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    // Xóa token khỏi HttpClient
    httpClient.setAccessToken(null);
  }

  // Khởi tạo HttpClient với token từ localStorage
  initializeHttpClient(): void {
    const token = this.getStoredAccessToken();
    if (token) {
      httpClient.setAccessToken(token);
    }
  }
}

export const authService = AuthService.getInstance();
