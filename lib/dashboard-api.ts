import { request } from "./api-core";
import { AdminDashboardData, DoctorDashboardData } from "./types";

export async function getAdminDashboardApi(days: number = 30): Promise<AdminDashboardData> {
    return request<AdminDashboardData>("/dashboard/admin", {
        query: { days },
    });
}

export async function getDoctorDashboardApi(days: number = 30): Promise<DoctorDashboardData> {
    return request<DoctorDashboardData>("/dashboard/doctor", {
        query: { days },
    });
}

