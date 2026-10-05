export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Array<{
    field?: string;
    message: string;
    code?: string;
  }>;
}
