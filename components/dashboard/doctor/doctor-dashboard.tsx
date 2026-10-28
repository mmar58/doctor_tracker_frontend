"use client";

import { useState, useEffect, useCallback } from "react";
import { DoctorDashboardData } from "@/lib/types";
import { getDoctorDashboardApi } from "@/lib/dashboard-api";
import { StatsCard } from "../shared/stats-card";
import { TimelineChart } from "../shared/timeline-chart";
import { StatusDistributionWidget } from "../shared/status-pie-chart";
import { PatientManager } from "../patients/patient-manager";
import { StatusBadge } from "../shared/status-badge";
import { toast } from "sonner";
import {
    Users,
    BedDouble,
    AlertCircle,
    CheckCircle2,
    LayoutDashboard,
    Stethoscope,
    Building2,
    Phone,
    Loader2,
    ArrowUpRight,
} from "lucide-react";

export function DoctorDashboard() {
    const [activeTab, setActiveTab] = useState<"overview" | "patients">("overview");
    const [days, setDays] = useState(30);
    const [data, setData] = useState<DoctorDashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    const loadStats = useCallback(async (selectedDays: number) => {
        setLoading(true);
        try {
            const res = await getDoctorDashboardApi(selectedDays);
            setData(res);
        } catch {
            toast.error("Failed to load doctor dashboard data");
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
            {/* Top Bar with Doctor Info & Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/80">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                        Doctor Workspace
                    </h1>
                    {data?.doctorProfile && (
                        <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                            <span className="font-semibold text-foreground">
                                {data.doctorProfile.name}
                            </span>
                            <span>•</span>
                            <span className="inline-flex items-center gap-1">
                                <Building2 className="size-3.5" />
                                {data.doctorProfile.hospital}
                            </span>
                            {data.doctorProfile.phone && (
                                <>
                                    <span>•</span>
                                    <span className="inline-flex items-center gap-1">
                                        <Phone className="size-3.5" />
                                        {data.doctorProfile.phone}
                                    </span>
                                </>
                            )}
                        </div>
                    )}
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
                        <span>Clinical Overview</span>
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
                        <span>My Patients</span>
                    </button>
                </div>
            </div>

            {/* Tab 1: Overview */}
            {activeTab === "overview" && (
                <>
                    {loading && !data ? (
                        <div className="py-24 flex flex-col items-center justify-center gap-3 text-muted-foreground">
                            <Loader2 className="size-8 animate-spin text-sky-600" />
                            <span className="text-sm">Retrieving your clinical caseload...</span>
                        </div>
                    ) : data ? (
                        <div className="space-y-8 animate-in fade-in duration-300">
                            {/* KPI Stat Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                                <StatsCard
                                    title="My Total Patients"
                                    value={data.overview.totalPatients}
                                    subtitle="Assigned to your care"
                                    icon={Users}
                                    color="sky"
                                />
                                <StatsCard
                                    title="Admitted Inpatients"
                                    value={data.overview.totalAdmitted}
                                    subtitle={`${data.overview.totalOutpatient} outpatients`}
                                    icon={BedDouble}
                                    color="rose"
                                />
                                <StatsCard
                                    title="Critical Attention"
                                    value={data.overview.criticalCount}
                                    subtitle="Very ill or ill condition"
                                    icon={AlertCircle}
                                    color="amber"
                                />
                                <StatsCard
                                    title="Stable & Recovering"
                                    value={data.overview.stableCount}
                                    subtitle="On track or good health"
                                    icon={CheckCircle2}
                                    color="emerald"
                                />
                            </div>

                            {/* Charts Row */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2">
                                    <TimelineChart
                                        title="My Patient Activity Trend"
                                        subtitle="Daily consultations and hospital admissions"
                                        data={data.dateBasedStats}
                                        days={days}
                                        onDaysChange={(d) => setDays(d)}
                                    />
                                </div>
                                <div>
                                    <StatusDistributionWidget
                                        title="My Patients Health Status"
                                        data={data.statusDistribution}
                                    />
                                </div>
                            </div>

                            {/* Recent Consultations */}
                            <div className="p-6 rounded-2xl border border-border bg-card">
                                <div className="flex items-center justify-between pb-4 border-b border-border/60">
                                    <div className="flex items-center gap-2">
                                        <Stethoscope className="size-5 text-sky-600 dark:text-sky-400" />
                                        <div>
                                            <h3 className="font-semibold text-foreground text-base">
                                                Recent Patient Consultations
                                            </h3>
                                            <p className="text-xs text-muted-foreground mt-0.5">
                                                Patients under your clinical supervision
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab("patients")}
                                        className="text-xs font-semibold text-sky-600 hover:text-sky-500 inline-flex items-center gap-1 cursor-pointer"
                                    >
                                        <span>Manage all patients</span>
                                        <ArrowUpRight className="size-3.5" />
                                    </button>
                                </div>

                                <div className="mt-4 divide-y divide-border">
                                    {data.recentPatients.length === 0 ? (
                                        <p className="py-8 text-center text-xs text-muted-foreground">
                                            No patients currently assigned. Click &quot;My Patients&quot; to add or register a patient.
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
                                                        {p.admit ? "Ward Admitted" : "Outpatient"}
                                                    </p>
                                                    <p className="text-[11px] text-muted-foreground mt-0.5 max-w-md truncate">
                                                        {p.description}
                                                    </p>
                                                </div>
                                                <StatusBadge status={p.status} />
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : null}
                </>
            )}

            {/* Tab 2: My Patients Management */}
            {activeTab === "patients" && (
                <PatientManager
                    doctorId={data?.doctorProfile._id}
                    title="My Clinical Patients"
                    description="Record observations, update diagnoses, and manage hospital admissions"
                    userRole="doctor"
                />
            )}
        </div>
    );
}

