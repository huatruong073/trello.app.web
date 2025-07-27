import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
  errors?: string[];
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public errors?: string[]
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export interface HttpClientOptions {
  baseURL?: string;
  timeout?: number;
  defaultHeaders?: Record<string, string>;
}

export class HttpClient {
  private static instance: HttpClient;
  private axios: AxiosInstance;
  private accessToken: string | null = null;

  private constructor(options: HttpClientOptions = {}) {
    const {
      baseURL = import.meta.env.VITE_API_URL || "https://localhost:7001",
      timeout = 30000,
      defaultHeaders = {},
    } = options;

    this.axios = axios.create({
      baseURL,
      timeout,
      headers: {
        "Content-Type": "application/json",
        ...defaultHeaders,
      },
    });

    this.setupInterceptors();
  }

  static getInstance(options?: HttpClientOptions): HttpClient {
    if (!HttpClient.instance) {
      HttpClient.instance = new HttpClient(options);
    }
    return HttpClient.instance;
  }

  private setupInterceptors(): void {
    // Request interceptor - Tự động thêm Authorization header
    this.axios.interceptors.request.use(
      (config) => {
        if (this.accessToken) {
          config.headers.Authorization = `Bearer ${this.accessToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor - Xử lý response và error
    this.axios.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error) => {
        const status = error.response?.status || 0;
        const data = error.response?.data;

        // Tạo ApiError với thông tin chi tiết
        let message = "An error occurred";
        let code = "UNKNOWN_ERROR";
        let errors: string[] = [];

        if (data) {
          if (typeof data === "string") {
            message = data;
          } else if (data.message) {
            message = data.message;
          } else if (data.title) {
            message = data.title;
          }

          code = data.code || data.type || "API_ERROR";
          errors = data.errors || data.details || [];
        } else if (error.message) {
          message = error.message;
        }

        const apiError = new ApiError(status, code, message, errors);
        return Promise.reject(apiError);
      }
    );
  }

  // Thiết lập access token cho requests
  setAccessToken(token: string | null): void {
    this.accessToken = token;
  }

  // Lấy access token hiện tại
  getAccessToken(): string | null {
    return this.accessToken;
  }

  // GET request
  async get<T = any>(
    url: string,
    params?: Record<string, any>,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.axios.get<T>(url, {
      params,
      ...config,
    });
    return response.data;
  }

  // POST request
  async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.axios.post<T>(url, data, config);
    return response.data;
  }

  // PUT request
  async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.axios.put<T>(url, data, config);
    return response.data;
  }

  // PATCH request
  async patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.axios.patch<T>(url, data, config);
    return response.data;
  }

  // DELETE request
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axios.delete<T>(url, config);
    return response.data;
  }

  // Upload file
  async upload<T = any>(
    url: string,
    file: File | FormData,
    onProgress?: (progressEvent: any) => void,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const formData = file instanceof FormData ? file : new FormData();
    if (file instanceof File) {
      formData.append("file", file);
    }

    const response = await this.axios.post<T>(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: onProgress,
      ...config,
    });
    return response.data;
  }

  // Download file
  async download(
    url: string,
    filename?: string,
    config?: AxiosRequestConfig
  ): Promise<Blob> {
    const response = await this.axios.get(url, {
      responseType: "blob",
      ...config,
    });

    // Nếu có filename, tự động download
    if (filename) {
      const blob = new Blob([response.data]);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    }

    return response.data;
  }

  // Lấy raw AxiosResponse (cho các trường hợp đặc biệt)
  async request<T = any>(
    config: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.axios.request<T>(config);
  }

  // Thêm interceptor tùy chỉnh
  addRequestInterceptor(
    onFulfilled?: (config: any) => any,
    onRejected?: (error: any) => any
  ): number {
    return this.axios.interceptors.request.use(onFulfilled, onRejected);
  }

  addResponseInterceptor(
    onFulfilled?: (response: AxiosResponse) => AxiosResponse,
    onRejected?: (error: any) => any
  ): number {
    return this.axios.interceptors.response.use(onFulfilled, onRejected);
  }

  // Xóa interceptor
  removeRequestInterceptor(id: number): void {
    this.axios.interceptors.request.eject(id);
  }

  removeResponseInterceptor(id: number): void {
    this.axios.interceptors.response.eject(id);
  }

  // Hủy tất cả requests đang pending
  cancelAllRequests(message = "Operation cancelled"): void {
    // Axios không có built-in method để cancel tất cả
    // Bạn có thể implement CancelToken cho từng request nếu cần
    console.warn("Cancel all requests:", message);
  }

  // Thiết lập base URL mới
  setBaseURL(baseURL: string): void {
    this.axios.defaults.baseURL = baseURL;
  }

  // Thiết lập timeout mới
  setTimeout(timeout: number): void {
    this.axios.defaults.timeout = timeout;
  }

  // Thiết lập default headers
  setDefaultHeaders(headers: Record<string, string>): void {
    Object.assign(this.axios.defaults.headers, headers);
  }
}

// Tạo instance mặc định
export const httpClient = HttpClient.getInstance();
