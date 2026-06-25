import apiClient, { ApiResponse } from "@/lib/axios"
import { Auditorium, AuditoriumPayload, Branch, SaveSeatLayoutPayload } from "./types"

function unwrap<T>(response: ApiResponse<T> | T): T {
  if (response && typeof response === "object" && "data" in response) {
    return (response as ApiResponse<T>).data
  }

  return response as T
}

export const auditoriumsApi = {
  async getBranches() {
    return unwrap<Branch[]>(await apiClient.get<Branch[]>("/branches"))
  },

  async getAuditoriums(branchId?: string) {
    const query = branchId ? `?branchId=${encodeURIComponent(branchId)}` : ""
    return unwrap<Auditorium[]>(await apiClient.get<Auditorium[]>(`/auditoriums${query}`))
  },

  async getAuditorium(id: string) {
    return unwrap<Auditorium>(await apiClient.get<Auditorium>(`/auditoriums/${id}`))
  },

  async createAuditorium(payload: AuditoriumPayload) {
    return unwrap<Auditorium>(await apiClient.post<Auditorium>("/auditoriums", payload))
  },

  async updateAuditorium(id: string, payload: Partial<AuditoriumPayload>) {
    return unwrap<Auditorium>(await apiClient.put<Auditorium>(`/auditoriums/${id}`, payload))
  },

  async deleteAuditorium(id: string) {
    return unwrap<Auditorium>(await apiClient.delete<Auditorium>(`/auditoriums/${id}`))
  },

  async saveSeatLayout(auditoriumId: string, payload: SaveSeatLayoutPayload) {
    return unwrap<Auditorium>(await apiClient.put<Auditorium>(`/auditoriums/${auditoriumId}/seats/layout`, payload))
  },
}
