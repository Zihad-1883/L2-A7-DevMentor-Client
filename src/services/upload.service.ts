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

    const res = await apiClient.post<UploadResult | UploadResult[]>("/uploads", formData);
    if (Array.isArray(res)) {
      return res[0];
    }
    return res;
  },
};
