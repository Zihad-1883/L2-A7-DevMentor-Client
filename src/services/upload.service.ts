import { apiClient } from "@/lib/api-client";

export interface UploadResult {
  url: string;
  public_id: string;
  format: string;
  bytes: number;
}

export const uploadService = {
  uploadFile: async (file: File): Promise<UploadResult> => {
    const formData = new FormData();
    formData.append("file", file);

    return await apiClient.post<UploadResult>("/uploads", formData);
  },
};
