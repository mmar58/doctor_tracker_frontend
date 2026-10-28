"use client";

import { useState, useEffect, useCallback } from "react";
import { AdminDashboardData } from "@/lib/types";
import { getAdminDashboardApi } from "@/lib/dashboard-api";
import { StatsCard } from "../shared/stats-card";
import { TimelineChart } from "../shared/timeline-chart";
import { StatusDistributionWidget } from "../shared/status-pie-chart";
import { PatientsPerDoctorChart } from "./patients-per-doctor-chart";
import { DoctorManager } from "./doctor-manager";
import { PatientManager } from "../patients/patient-manager";
import { StatusBadge } from "../shared/status-badge";
import { toast } from "sonner";
import {
    Users,
    Stethoscope,
    BedDouble,
    Activity,
    LayoutDashboard,
    UserCheck,
    Loader2,
    Calendar,
    ArrowUpRight,
} from "lucide-react";

export function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<"overview" | "doctors" | "patients">("overview");
    const [days, setDays] = useState(30);
    const [data, setData] = useState<AdminDashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    const loadStats = useCallback(async (selectedDays: number) => {
        setLoading(true);
        try {
            const stats = await getAdminDashboardApi(selectedDays);
            setData(stats);
        } catch {
            toast.error("Failed to load admin dashboard data");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (activeTab === "overview") {
            loadStats(days);
        }
    }, [activeTab, days, loadStats]);

    return (
        <div className="space-y-8">
            {/* Top Bar with Title & Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/80">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                        Admin Portal
                    </h1>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        High-level clinical operations, medical staff management, and health metrics
                    </p>
                </div>

                {/* Tabs */}
                <div className="inline-flex rounded-xl border border-border p-1 bg-muted/40">
                    <button
                        type="button"
                        onClick={() => setActiveTab("overview")}
                        className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                            activeTab === "overview"
                                ? "bg-background text-foreground shadow-xs"
                                : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        <LayoutDashboard className="size-4" />
                        <span>Overview</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab("doctors")}
                        className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                            activeTab === "doctors"
                                ? "bg-background text-foreground shadow-xs"
                                : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        <Stethoscope className="size-4" />
                        <span>Doctors</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab("patients")}
                        className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                            activeTab === "patients"
                                ? "bg-background text-foreground shadow-xs"
                                : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        <Users className="size-4" />
                        <span>Patients</span>
                    </button>
                </div>
            </div>

            {/* Tab 1: Overview */}
            {activeTab === "overview" && (
                <>
                    {loading && !data ? (
                        <div className="py-24 flex flex-col items-center justify-center gap-3 text-muted-foreground">
                            <Loader2 className="size-8 animate-spin text-sky-600" />
                            <span className="text-sm">Aggregating hospital analytics...</span>
                        </div>
                    ) : data ? (
                        <div className="space-y-8 animate-in fade-in duration-300">
                            {/* Stats KPI Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                                <StatsCard
                                    title="Total Registered Doctors"
                                    value={data.overview.totalDoctors}
                                    subtitle="Active medical practitioners"
                                    icon={Stethoscope}
                                    color="sky"
                                />
                                <StatsCard
                                    title="Total Patients Recorded"
                                    value={data.overview.totalPatients}
                                    subtitle="Cumulative health profiles"
                                    icon={Users}
                                    color="emerald"
                                />
                                <StatsCard
                                    title="Admitted Inpatients"
                                    value={data.overview.totalAdmitted}
                                    subtitle={`${data.overview.totalOutpatient} outpatients active`}
                                    icon={BedDouble}
                                    color="rose"
                                />
                                <StatsCard
                                    title="Patients per Doctor"
                                    value={data.overview.avgPatientsPerDoctor}
                                    subtitle="Average clinical caseload"
                                    icon={Activity}
                                    color="violet"
                                />
                            </div>

                            {/* Main Charts Row */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2">
                                    <TimelineChart
                                        data={data.dateBasedStats}
                                        days={days}
                                        onDaysChange={(d) => setDays(d)}
                                    />
                                </div>
                                <div>
                                    <StatusDistributionWidget data={data.statusDistribution} />
                                </div>
                            </div>

                            {/* Secondary Row: Caseload Breakdown & Recent Patients */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <PatientsPerDoctorChart
                                    data={data.patientsPerDoctor}
                                    avgPatients={data.overview.avgPatientsPerDoctor}
                                />

                                {/* Recent Registered Patients */}
                                <div className="p-6 rounded-2xl border border-border bg-card">
                                    <div className="flex items-center justify-between pb-4 border-b border-border/60">
                                        <div className="flex items-center gap-2">
                                            <Users className="size-5 text-sky-600 dark:text-sky-400" />
                                            <div>
                                                <h3 className="font-semibold text-foreground text-base">
                                                    Recent Patient Intakes
                                                </h3>
                                                <p className="text-xs text-muted-foreground mt-0.5">
                                                    Latest consultations recorded in the system
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setActiveTab("patients")}
                                            className="text-xs font-semibold text-sky-600 hover:text-sky-500 inline-flex items-center gap-1 cursor-pointer"
                                        >
                                            <span>View all</span>
                                            <ArrowUpRight className="size-3.5" />
                                        </button>
                                    </div>

                                    <div className="mt-4 divide-y divide-border">
                                        {data.recentPatients.length === 0 ? (
                                            <p className="py-6 text-center text-xs text-muted-foreground">
                                                No patients recorded yet.
                                            </p>
                                        ) : (
                                            data.recentPatients.map((p) => (
                                                <div
                                                    key={p._id}
                                                    className="py-3 flex items-center justify-between gap-4"
                                                >
                                                    <div>
                                                        <p className="text-sm font-semibold text-foreground">
                                                            {p.name}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {p.gender}, {p.age} yrs •{" "}
                                                            {p.admit ? "Admitted" : "Outpatient"}
                                                        </p>
                                                    </div>
                                                    <StatusBadge status={p.status} />
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : null}
                </>
            )}

            {/* Tab 2: Doctors Management */}
            {activeTab === "doctors" && <DoctorManager />}

            {/* Tab 3: Patients Management */}
            {activeTab === "patients" && <PatientManager userRole="admin" />}
        </div>
    );
}

