import { request } from "./api-core";
import { Doctor, PaginatedResponse } from "./types";

export interface CreateDoctorPayload {
    name: string;
    email: string;
    password?: string;
    hospital: string;
    phone?: string;
    specialization?: string[];
    isActive?: boolean;
}

export async function getDoctorsApi(params?: {
    search?: string;
    page?: number;
    limit?: number;
}): Promise<PaginatedResponse<Doctor>> {
    return request<PaginatedResponse<Doctor>>("/doctors", {
        query: params,
    });
}

export async function getDoctorByIdApi(id: string): Promise<Doctor> {
    return request<Doctor>(`/doctors/${id}`);
}

export async function createDoctorApi(payload: CreateDoctorPayload): Promise<Doctor> {
    return request<Doctor>("/doctors", {
        method: "POST",
        body: payload,
    });
}

export async function updateDoctorApi(id: string, payload: Partial<CreateDoctorPayload>): Promise<Doctor> {
    return request<Doctor>(`/doctors/${id}`, {
        method: "PUT",
        body: payload,
    });
}

export async function deleteDoctorApi(id: string): Promise<{ success: boolean; message: string }> {
    return request<{ success: boolean; message: string }>(`/doctors/${id}`, {
        method: "DELETE",
    });
}

