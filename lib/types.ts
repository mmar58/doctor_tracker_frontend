export interface AuthUser {
    id?: string;
    name: string;
    email: string;
    role: "admin" | "doctor";
}

export interface DoctorSpecialization {
    _id: string;
    name: string;
}

export interface Doctor {
    _id: string;
    userId?: {
        _id: string;
        email: string;
        isActive?: boolean;
        createdAt?: string;
    };
    name: string;
    hospital: string;
    phone: string;
    specialization?: DoctorSpecialization[] | string[];
    patientCount?: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface Patient {
    _id: string;
    name: string;
    status: "very-ill" | "ill" | "stable" | "good";
    admit: boolean;
    gender: "male" | "female";
    age: number;
    description: string;
    doctors?: Doctor[] | string[];
    createdAt?: string;
    updatedAt?: string;
}

export interface DateBasedStat {
    date: string;
    total: number;
    admitted: number;
    outpatient: number;
}

export interface StatusDistribution {
    status: "very-ill" | "ill" | "stable" | "good";
    count: number;
}

export interface PatientsPerDoctorStat {
    doctorId: string;
    doctorName: string;
    hospital: string;
    patientCount: number;
}

export interface AdminDashboardData {
    overview: {
        totalDoctors: number;
        totalPatients: number;
        totalAdmitted: number;
        totalOutpatient: number;
        avgPatientsPerDoctor: number;
    };
    patientsPerDoctor: PatientsPerDoctorStat[];
    dateBasedStats: DateBasedStat[];
    statusDistribution: StatusDistribution[];
    recentPatients: Patient[];
    recentDoctors: Doctor[];
}

export interface DoctorDashboardData {
    doctorProfile: {
        _id: string;
        name: string;
        hospital: string;
        phone: string;
    };
    overview: {
        totalPatients: number;
        totalAdmitted: number;
        totalOutpatient: number;
        criticalCount: number;
        stableCount: number;
    };
    dateBasedStats: DateBasedStat[];
    statusDistribution: StatusDistribution[];
    recentPatients: Patient[];
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}
