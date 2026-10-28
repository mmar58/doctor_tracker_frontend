"use client";

import { useState, useEffect, useCallback } from "react";
import { Patient } from "@/lib/types";
import { getPatientsApi, deletePatientApi } from "@/lib/patients-api";
import { PatientDialog } from "./patient-dialog";
import { StatusBadge, AdmitBadge } from "../shared/status-badge";
import { toast } from "sonner";
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    Filter,
    Loader2,
    Calendar,
    Stethoscope,
    User,
} from "lucide-react";

interface PatientManagerProps {
    doctorId?: string;
    title?: string;
    description?: string;
    userRole: "admin" | "doctor";
}

export function PatientManager({
    doctorId,
    title = "Patient Records",
    description = "Monitor and manage patient records and treatments",
    userRole,
}: PatientManagerProps) {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("");
    const [admitFilter, setAdmitFilter] = useState<string>("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalPatients, setTotalPatients] = useState(0);

    // Dialog state
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

    // Deleting state
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const loadPatients = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getPatientsApi({
                search: search.trim() || undefined,
                status: statusFilter || undefined,
                admit: admitFilter === "true" ? true : admitFilter === "false" ? false : undefined,
                doctorId: doctorId || undefined,
                page,
                limit: 10,
            });
            setPatients(res.data);
            setTotalPages(res.pagination.totalPages);
            setTotalPatients(res.pagination.total);
        } catch {
            toast.error("Failed to load patient records");
        } finally {
            setLoading(false);
        }
    }, [search, statusFilter, admitFilter, doctorId, page]);

    useEffect(() => {
        loadPatients();
    }, [loadPatients]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        loadPatients();
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to remove this patient record?")) return;

        setDeletingId(id);
        try {
            await deletePatientApi(id);
            toast.success("Patient record removed");
            loadPatients();
        } catch {
            toast.error("Failed to delete patient");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="space-y-6">
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-foreground">{title}</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        {description} ({totalPatients} total)
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {/* Search */}
                    <form onSubmit={handleSearchSubmit} className="relative">
                        <input
                            type="text"
                            placeholder="Search patient, symptoms..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-48 sm:w-56 pl-9 pr-3 py-2 text-xs rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-sky-500"
                        />
                        <Search className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                    </form>

                    {/* Status filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                            setPage(1);
                        }}
                        className="px-3 py-2 text-xs rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-sky-500"
                    >
                        <option value="">All Statuses</option>
                        <option value="very-ill">Very Ill</option>
                        <option value="ill">Ill</option>
                        <option value="stable">Stable</option>
                        <option value="good">Good</option>
                    </select>

                    {/* Admit filter */}
                    <select
                        value={admitFilter}
                        onChange={(e) => {
                            setAdmitFilter(e.target.value);
                            setPage(1);
                        }}
                        className="px-3 py-2 text-xs rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-sky-500"
                    >
                        <option value="">All Patients</option>
                        <option value="true">Admitted</option>
                        <option value="false">Outpatient</option>
                    </select>

                    {/* Add Patient Button */}
                    <button
                        type="button"
                        onClick={() => {
                            setSelectedPatient(null);
                            setDialogOpen(true);
                        }}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                    >
                        <Plus className="size-4" />
                        <span>Add Patient</span>
                    </button>
                </div>
            </div>

            {/* Patients Table */}
            <div className="border border-border rounded-2xl bg-card overflow-hidden shadow-xs">
                {loading ? (
                    <div className="py-20 flex flex-col items-center justify-center gap-2 text-muted-foreground">
                        <Loader2 className="size-6 animate-spin text-sky-600" />
                        <span className="text-xs">Loading patient records...</span>
                    </div>
                ) : patients.length === 0 ? (
                    <div className="py-16 text-center text-sm text-muted-foreground">
                        No patient records found. Click &quot;Add Patient&quot; to register a new one.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-muted/50 border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                                <tr>
                                    <th className="px-6 py-3.5 font-semibold">Patient</th>
                                    <th className="px-6 py-3.5 font-semibold">Condition</th>
                                    <th className="px-6 py-3.5 font-semibold">Hospital Stay</th>
                                    <th className="px-6 py-3.5 font-semibold">Doctor Assigned</th>
                                    <th className="px-6 py-3.5 font-semibold">Date Registered</th>
                                    <th className="px-6 py-3.5 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {patients.map((p) => {
                                    const primaryDoctor =
                                        Array.isArray(p.doctors) && p.doctors.length > 0
                                            ? typeof p.doctors[0] === "object"
                                                ? p.doctors[0].name
                                                : "Doctor Assigned"
                                            : "Unassigned";

                                    const dateStr = p.createdAt
                                        ? new Date(p.createdAt).toLocaleDateString()
                                        : "—";

                                    return (
                                        <tr key={p._id} className="hover:bg-muted/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="size-9 rounded-full bg-muted flex items-center justify-center font-bold text-foreground text-sm">
                                                        <User className="size-4 text-muted-foreground" />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-foreground">{p.name}</p>
                                                        <p className="text-xs text-muted-foreground capitalize">
                                                            {p.gender}, {p.age} yrs
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4">
                                                <StatusBadge status={p.status} />
                                                <p className="text-[11px] text-muted-foreground mt-1 max-w-xs truncate">
                                                    {p.description}
                                                </p>
                                            </td>

                                            <td className="px-6 py-4">
                                                <AdmitBadge admit={p.admit} />
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                    <Stethoscope className="size-3.5 text-sky-600" />
                                                    <span className="font-medium text-foreground">{primaryDoctor}</span>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                    <Calendar className="size-3.5" />
                                                    <span>{dateStr}</span>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 text-right">
                                                <div className="inline-flex items-center gap-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setSelectedPatient(p);
                                                            setDialogOpen(true);
                                                        }}
                                                        className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                                                        title="Edit patient"
                                                    >
                                                        <Edit2 className="size-4" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        disabled={deletingId === p._id}
                                                        onClick={() => handleDelete(p._id)}
                                                        className="p-1.5 rounded-lg text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors cursor-pointer disabled:opacity-50"
                                                        title="Delete patient"
                                                    >
                                                        {deletingId === p._id ? (
                                                            <Loader2 className="size-4 animate-spin" />
                                                        ) : (
                                                            <Trash2 className="size-4" />
                                                        )}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                        <span>
                            Page {page} of {totalPages}
                        </span>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                disabled={page <= 1}
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                className="px-3 py-1.5 rounded-lg border border-border hover:bg-muted disabled:opacity-40 cursor-pointer"
                            >
                                Previous
                            </button>
                            <button
                                type="button"
                                disabled={page >= totalPages}
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                className="px-3 py-1.5 rounded-lg border border-border hover:bg-muted disabled:opacity-40 cursor-pointer"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal Dialog */}
            <PatientDialog
                open={dialogOpen}
                patient={selectedPatient}
                onClose={() => setDialogOpen(false)}
                onSuccess={loadPatients}
                userRole={userRole}
            />
        </div>
    );
}

