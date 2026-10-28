import { request } from "./api-core";
import { Patient, PaginatedResponse } from "./types";

export interface CreatePatientPayload {
    name: string;
    status: "very-ill" | "ill" | "stable" | "good";
    admit: boolean;
    gender: "male" | "female";
    age: number;
    description: string;
    doctors?: string[];
}

export async function getPatientsApi(params?: {
    search?: string;
    status?: string;
    admit?: boolean;
    gender?: string;
    doctorId?: string;
    page?: number;
    limit?: number;
}): Promise<PaginatedResponse<Patient>> {
    return request<PaginatedResponse<Patient>>("/patients", {
        query: params,
    });
}

export async function getPatientByIdApi(id: string): Promise<Patient> {
    return request<Patient>(`/patients/${id}`);
}

export async function createPatientApi(payload: CreatePatientPayload): Promise<Patient> {
    return request<Patient>("/patients", {
        method: "POST",
        body: payload,
    });
}

export async function updatePatientApi(id: string, payload: Partial<CreatePatientPayload>): Promise<Patient> {
    return request<Patient>(`/patients/${id}`, {
        method: "PUT",
        body: payload,
    });
}

export async function deletePatientApi(id: string): Promise<{ success: boolean; message: string }> {
    return request<{ success: boolean; message: string }>(`/patients/${id}`, {
        method: "DELETE",
    });
}

