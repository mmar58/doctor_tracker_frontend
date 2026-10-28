"use client";

import { useState, useEffect, useCallback } from "react";
import { Doctor } from "@/lib/types";
import { getDoctorsApi, deleteDoctorApi } from "@/lib/doctors-api";
import { DoctorDialog } from "./doctor-dialog";
import { toast } from "sonner";
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    Building2,
    Phone,
    Users,
    Loader2,
    CheckCircle2,
    XCircle,
} from "lucide-react";

export function DoctorManager() {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalDoctors, setTotalDoctors] = useState(0);

    // Modal state
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

    // Delete confirm
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const loadDoctors = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getDoctorsApi({ search: search.trim() || undefined, page, limit: 10 });
            setDoctors(res.data);
            setTotalPages(res.pagination.totalPages);
            setTotalDoctors(res.pagination.total);
        } catch {
            toast.error("Failed to load doctors");
        } finally {
            setLoading(false);
        }
    }, [search, page]);

    useEffect(() => {
        loadDoctors();
    }, [loadDoctors]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        loadDoctors();
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to remove this doctor? This cannot be undone.")) return;

        setDeletingId(id);
        try {
            await deleteDoctorApi(id);
            toast.success("Doctor deleted");
            loadDoctors();
        } catch {
            toast.error("Failed to delete doctor");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="space-y-6">
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-foreground">Doctors Management</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        Manage all registered medical professionals ({totalDoctors} total)
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <form onSubmit={handleSearchSubmit} className="relative">
                        <input
                            type="text"
                            placeholder="Search name, hospital..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-56 sm:w-64 pl-9 pr-3 py-2 text-xs rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-sky-500"
                        />
                        <Search className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                    </form>

                    <button
                        type="button"
                        onClick={() => {
                            setSelectedDoctor(null);
                            setDialogOpen(true);
                        }}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                    >
                        <Plus className="size-4" />
                        <span>Add Doctor</span>
                    </button>
                </div>
            </div>

            {/* Doctors Table */}
            <div className="border border-border rounded-2xl bg-card overflow-hidden shadow-xs">
                {loading ? (
                    <div className="py-20 flex flex-col items-center justify-center gap-2 text-muted-foreground">
                        <Loader2 className="size-6 animate-spin text-sky-600" />
                        <span className="text-xs">Loading doctors...</span>
                    </div>
                ) : doctors.length === 0 ? (
                    <div className="py-16 text-center text-sm text-muted-foreground">
                        No doctors found. Try adjusting your search or add a new doctor.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-muted/50 border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                                <tr>
                                    <th className="px-6 py-3.5 font-semibold">Doctor Name</th>
                                    <th className="px-6 py-3.5 font-semibold">Hospital / Clinic</th>
                                    <th className="px-6 py-3.5 font-semibold">Contact</th>
                                    <th className="px-6 py-3.5 font-semibold">Assigned Patients</th>
                                    <th className="px-6 py-3.5 font-semibold">Status</th>
                                    <th className="px-6 py-3.5 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {doctors.map((doc) => {
                                    const isActive = doc.userId?.isActive !== false;

                                    return (
                                        <tr key={doc._id} className="hover:bg-muted/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="size-9 rounded-full bg-sky-100 dark:bg-sky-950 flex items-center justify-center font-bold text-sky-700 dark:text-sky-300 text-sm">
                                                        {doc.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-foreground">{doc.name}</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {doc.userId?.email || "No email"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                    <Building2 className="size-3.5" />
                                                    <span className="text-foreground">{doc.hospital}</span>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                    <Phone className="size-3.5" />
                                                    <span>{doc.phone || "—"}</span>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 text-xs font-semibold">
                                                    <Users className="size-3.5" />
                                                    <span>{doc.patientCount ?? 0}</span>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4">
                                                {isActive ? (
                                                    <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                                                        <CheckCircle2 className="size-3.5" /> Active
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground font-medium">
                                                        <XCircle className="size-3.5" /> Inactive
                                                    </span>
                                                )}
                                            </td>

                                            <td className="px-6 py-4 text-right">
                                                <div className="inline-flex items-center gap-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setSelectedDoctor(doc);
                                                            setDialogOpen(true);
                                                        }}
                                                        className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                                                        title="Edit doctor"
                                                    >
                                                        <Edit2 className="size-4" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        disabled={deletingId === doc._id}
                                                        onClick={() => handleDelete(doc._id)}
                                                        className="p-1.5 rounded-lg text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors cursor-pointer disabled:opacity-50"
                                                        title="Delete doctor"
                                                    >
                                                        {deletingId === doc._id ? (
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

            {/* Doctor Dialog */}
            <DoctorDialog
                open={dialogOpen}
                doctor={selectedDoctor}
                onClose={() => setDialogOpen(false)}
                onSuccess={loadDoctors}
            />
        </div>
    );
}

