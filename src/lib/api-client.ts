const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export type ApiResponse<T> = {
  message: string;
  data: T;
};

export type PageResponse<T> = {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
};

export class ApiError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
    this.name = "ApiError";
  }
}

class ApiClient {
  private accessToken: string | null = null;
  private isRefreshing: boolean = false;
  private refreshSubscribers: ((token: string) => void)[] = [];

  public setAccessToken(token: string | null) {
    this.accessToken = token;
  }

  public getAccessToken() {
    return this.accessToken;
  }

  private getAuthHeader(): Record<string, string> {
    return this.accessToken ? { Authorization: `Bearer ${this.accessToken}` } : {};
  }

  private onRefreshed(token: string) {
    this.refreshSubscribers.forEach((cb) => cb(token));
    this.refreshSubscribers = [];
  }

  private addRefreshSubscriber(cb: (token: string) => void) {
    this.refreshSubscribers.push(cb);
  }

  async fetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${BASE_URL}${endpoint}`;
    
    // Always include credentials for HttpOnly cookies
    const headers: Record<string, string> = {
      ...this.getAuthHeader(),
      ...options.headers as Record<string, string>,
    };

    if (!(options.body instanceof FormData) && !headers["Content-Type"]) {
      headers["Content-Type"] = "application/json";
    }

    const fetchOptions: RequestInit = {
      ...options,
      credentials: "include",
      headers,
    };

    let response = await fetch(url, fetchOptions);

    // If 401 Unauthorized and not already trying to login/refresh
    if (response.status === 401 && !endpoint.includes("/auth/login") && !endpoint.includes("/auth/refresh-token")) {
      if (!this.isRefreshing) {
        this.isRefreshing = true;
        try {
          // Attempt to refresh
          const refreshUrl = `${BASE_URL}/auth/refresh-token`;
          const refreshRes = await fetch(refreshUrl, {
            method: 'POST',
            credentials: 'include',
            headers: { "Content-Type": "application/json" }
          });

          if (!refreshRes.ok) {
            throw new Error("Refresh failed");
          }

          const refreshData = await refreshRes.json() as ApiResponse<{ accessToken: string }>;
          this.setAccessToken(refreshData.data.accessToken);
          this.isRefreshing = false;
          this.onRefreshed(refreshData.data.accessToken);

          // Retry the original request
          fetchOptions.headers = {
            ...fetchOptions.headers,
            Authorization: `Bearer ${refreshData.data.accessToken}`
          };
          response = await fetch(url, fetchOptions);

        } catch (error) {
          this.isRefreshing = false;
          this.setAccessToken(null);
          this.refreshSubscribers = [];
          
          // Optionally trigger a global event here to force logout in UI if needed
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('auth:unauthorized'));
          }
          
          throw new Error("Session expired. Please login again.");
        }
      } else {
        // Wait for the refresh to complete
        return new Promise<T>((resolve) => {
          this.addRefreshSubscriber((newToken: string) => {
            fetchOptions.headers = {
              ...fetchOptions.headers,
              Authorization: `Bearer ${newToken}`
            };
            resolve(fetch(url, fetchOptions).then(res => res.json()));
          });
        });
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || `HTTP error! status: ${response.status}`,
        response.status
      );
    }

    return response.json();
  }

  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.fetch<T>(endpoint, { ...options, method: "GET" });
  }

  async post<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    const isFormData = data instanceof FormData;
    return this.fetch<T>(endpoint, {
      ...options,
      method: "POST",
      body: isFormData ? data : JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    const isFormData = data instanceof FormData;
    return this.fetch<T>(endpoint, {
      ...options,
      method: "PUT",
      body: isFormData ? data : JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.fetch<T>(endpoint, { ...options, method: "DELETE" });
  }

  async patch<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    const isFormData = data instanceof FormData;
    return this.fetch<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: isFormData ? data : data !== undefined ? JSON.stringify(data) : undefined,
    });
  }
}

export const apiClient = new ApiClient();
