// Replace this with your backend API URL
const API_BASE_URL = 'https://your-backend-api.com/api';

// Types for your backend responses
export interface User {
  id: string;
  email: string;
  name?: string;
  // Add other user fields from your backend
}

export interface UserRole {
  id: string;
  role: 'user' | 'designer' | 'manager' | 'admin' | 'super_admin';
  is_active: boolean;
}

export interface LoginResponse {
  user: User;
  token: string;
  role?: UserRole;
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.token = localStorage.getItem('auth_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
      ...options,
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Authentication methods
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    this.token = response.token;
    localStorage.setItem('auth_token', response.token);
    
    return response;
  }

  async register(email: string, password: string, name?: string): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
    
    this.token = response.token;
    localStorage.setItem('auth_token', response.token);
    
    return response;
  }

  async logout(): Promise<void> {
    await this.request('/auth/logout', { method: 'POST' });
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  async getCurrentUser(): Promise<User> {
    return this.request<User>('/auth/me');
  }

  async getUserRole(userId: string): Promise<UserRole | null> {
    try {
      return await this.request<UserRole>(`/users/${userId}/role`);
    } catch {
      return null;
    }
  }

  // Template methods
  async getTemplates(): Promise<any[]> {
    return this.request<any[]>('/templates');
  }

  async createTemplate(templateData: any): Promise<any> {
    return this.request<any>('/templates', {
      method: 'POST',
      body: JSON.stringify(templateData),
    });
  }

  async updateTemplate(id: string, templateData: any): Promise<any> {
    return this.request<any>(`/templates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(templateData),
    });
  }

  async deleteTemplate(id: string): Promise<void> {
    await this.request(`/templates/${id}`, { method: 'DELETE' });
  }

  // Categories methods
  async getCategories(): Promise<any[]> {
    return this.request<any[]>('/categories');
  }

  // Ads methods
  async getAds(): Promise<any[]> {
    return this.request<any[]>('/ads');
  }

  async createAd(adData: any): Promise<any> {
    return this.request<any>('/ads', {
      method: 'POST',
      body: JSON.stringify(adData),
    });
  }

  // File upload
  async uploadFile(file: File, bucket: string): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('bucket', bucket);

    const response = await fetch(`${this.baseUrl}/upload`, {
      method: 'POST',
      headers: {
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    return response.json();
  }
}

export const apiClient = new ApiClient(API_BASE_URL);