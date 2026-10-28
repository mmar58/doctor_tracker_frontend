"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { AdminDashboard } from "@/components/dashboard/admin/admin-dashboard";
import { DoctorDashboard } from "@/components/dashboard/doctor/doctor-dashboard";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
    const router = useRouter();
    const user = useAuthStore((s) => s.user);
    const authLoading = useAuthStore((s) => s.loading);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login");
        }
    }, [user, authLoading, router]);

    if (authLoading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] gap-3 text-muted-foreground">
                <Loader2 className="size-8 animate-spin text-sky-600" />
                <p className="text-sm font-medium">Authenticating session...</p>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
            {user.role === "admin" ? <AdminDashboard /> : <DoctorDashboard />}
        </div>
    );
}

