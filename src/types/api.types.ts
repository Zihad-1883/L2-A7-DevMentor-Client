// Generic backend ApiResponse<T> wrapper TypeScript interface
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}
