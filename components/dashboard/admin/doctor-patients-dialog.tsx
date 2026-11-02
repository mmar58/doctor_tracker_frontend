"use client";

import { useState, useEffect, useCallback } from "react";
import { Doctor, Patient } from "@/lib/types";
import { getPatientsApi, unassignDoctorFromPatientApi } from "@/lib/patients-api";
import { StatusBadge, AdmitBadge } from "../shared/status-badge";
import { toast } from "sonner";
import {
    X,
    Loader2,
    Users,
    Building2,
    Phone,
    Mail,
    Stethoscope,
    UserMinus,
    Search,
    AlertCircle,
} from "lucide-react";

interface DoctorPatientsDialogProps {
    open: boolean;
    doctor: Doctor | null;
    onClose: () => void;
    onPatientRemoved?: () => void;
}

export function DoctorPatientsDialog({
    open,
    doctor,
    onClose,
    onPatientRemoved,
}: DoctorPatientsDialogProps) {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [removingId, setRemovingId] = useState<string | null>(null);

    const loadDoctorPatients = useCallback(async () => {
        if (!doctor) return;
        setLoading(true);
        try {
            const res = await getPatientsApi({
                doctorId: doctor._id,
                limit: 100,
            });
            setPatients(res.data);
        } catch {
            toast.error("Failed to load doctor's patients");
        } finally {
            setLoading(false);
        }
    }, [doctor]);

    useEffect(() => {
        if (open && doctor) {
            setSearch("");
            loadDoctorPatients();
        } else {
            setPatients([]);
        }
    }, [open, doctor, loadDoctorPatients]);

    if (!open || !doctor) return null;

    const filteredPatients = patients.filter((p) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (
            p.name.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.gender.toLowerCase().includes(q)
        );
    });

    const handleUnassign = async (patient: Patient) => {
        if (
            !confirm(
                `Are you sure you want to remove ${patient.name} from Dr. ${doctor.name}'s assigned patients?`
            )
        ) {
            return;
        }

        setRemovingId(patient._id);
        try {
            await unassignDoctorFromPatientApi(patient._id, doctor._id);
            toast.success(`${patient.name} removed from ${doctor.name}`);
            setPatients((prev) => prev.filter((p) => p._id !== patient._id));
            onPatientRemoved?.();
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Failed to remove patient from doctor";
            toast.error(msg);
        } finally {
            setRemovingId(null);
        }
    };

    const specs = Array.isArray(doctor.specialization) ? doctor.specialization : [];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="relative w-full max-w-3xl rounded-2xl bg-card border border-border p-6 shadow-2xl flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-border">
                    <div className="flex items-center gap-3">
                        <div className="size-11 rounded-full bg-sky-100 dark:bg-sky-950 flex items-center justify-center font-bold text-sky-700 dark:text-sky-300 text-lg">
                            {doctor.name.charAt(0)}
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                                <span>{doctor.name}</span>
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800/60">
                                    <Users className="size-3" />
                                    {patients.length} {patients.length === 1 ? "Patient" : "Patients"}
                                </span>
                            </h2>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Assigned Patients List & Doctor Overview
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                        title="Close popup"
                    >
                        <X className="size-5" />
                    </button>
                </div>

                {/* Doctor Info Card */}
                <div className="mt-4 p-4 rounded-xl bg-muted/40 border border-border grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="flex items-center gap-2 text-foreground">
                        <Building2 className="size-4 text-sky-600 shrink-0" />
                        <div className="truncate">
                            <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Hospital</span>
                            <span className="font-medium truncate">{doctor.hospital}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-foreground">
                        <Mail className="size-4 text-sky-600 shrink-0" />
                        <div className="truncate">
                            <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Email</span>
                            <span className="font-medium truncate">{doctor.userId?.email || "—"}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-foreground">
                        <Phone className="size-4 text-sky-600 shrink-0" />
                        <div className="truncate">
                            <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Phone</span>
                            <span className="font-medium truncate">{doctor.phone || "—"}</span>
                        </div>
                    </div>

                    {specs.length > 0 && (
                        <div className="sm:col-span-3 flex items-center gap-2 pt-1 border-t border-border/50">
                            <Stethoscope className="size-3.5 text-sky-600 shrink-0" />
                            <span className="text-muted-foreground text-[10px] uppercase font-semibold">Specialization:</span>
                            <div className="flex flex-wrap gap-1">
                                {specs.map((s, idx) => {
                                    const name = typeof s === "string" ? s : s.name;
                                    const key = typeof s === "string" ? `${s}-${idx}` : s._id;
                                    return (
                                        <span
                                            key={key}
                                            className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-background text-foreground border border-border"
                                        >
                                            {name}
                                        </span>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Search Bar */}
                <div className="mt-4 flex items-center justify-between gap-3">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            placeholder="Filter assigned patients..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-sky-500"
                        />
                        <Search className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                </div>

                {/* Patients Table / List */}
                <div className="mt-3 border border-border rounded-xl bg-card overflow-hidden flex-1 overflow-y-auto">
                    {loading ? (
                        <div className="py-16 flex flex-col items-center justify-center gap-2 text-muted-foreground">
                            <Loader2 className="size-6 animate-spin text-sky-600" />
                            <span className="text-xs">Loading assigned patients...</span>
                        </div>
                    ) : filteredPatients.length === 0 ? (
                        <div className="py-12 flex flex-col items-center justify-center gap-2 text-center text-muted-foreground px-4">
                            <AlertCircle className="size-6 text-muted-foreground/60" />
                            <p className="text-xs">
                                {patients.length === 0
                                    ? "No patients are currently assigned to this doctor."
                                    : "No patients matched your filter."}
                            </p>
                        </div>
                    ) : (
                        <table className="w-full text-left text-sm">
                            <thead className="bg-muted/50 border-b border-border text-[11px] uppercase tracking-wider text-muted-foreground sticky top-0">
                                <tr>
                                    <th className="px-4 py-3 font-semibold">Patient</th>
                                    <th className="px-4 py-3 font-semibold">Age / Gender</th>
                                    <th className="px-4 py-3 font-semibold">Status</th>
                                    <th className="px-4 py-3 font-semibold">Admission</th>
                                    <th className="px-4 py-3 font-semibold text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {filteredPatients.map((patient) => {
                                    const isRemoving = removingId === patient._id;

                                    return (
                                        <tr key={patient._id} className="hover:bg-muted/30 transition-colors">
                                            <td className="px-4 py-3">
                                                <div>
                                                    <p className="font-semibold text-foreground text-xs">{patient.name}</p>
                                                    <p className="text-[11px] text-muted-foreground line-clamp-1 max-w-xs">
                                                        {patient.description}
                                                    </p>
                                                </div>
                                            </td>

                                            <td className="px-4 py-3 text-xs text-muted-foreground">
                                                {patient.age} yrs • <span className="capitalize">{patient.gender}</span>
                                            </td>

                                            <td className="px-4 py-3">
                                                <StatusBadge status={patient.status} />
                                            </td>

                                            <td className="px-4 py-3">
                                                <AdmitBadge admit={patient.admit} />
                                            </td>

                                            <td className="px-4 py-3 text-right">
                                                <button
                                                    type="button"
                                                    disabled={isRemoving}
                                                    onClick={() => handleUnassign(patient)}
                                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/60 border border-rose-200 dark:border-rose-900 transition-colors cursor-pointer disabled:opacity-50"
                                                    title={`Remove patient from Dr. ${doctor.name}`}
                                                >
                                                    {isRemoving ? (
                                                        <Loader2 className="size-3.5 animate-spin" />
                                                    ) : (
                                                        <UserMinus className="size-3.5" />
                                                    )}
                                                    <span>Remove</span>
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Footer */}
                <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                        Removing a patient here unassigns them from Dr. {doctor.name} while preserving the patient record in the system.
                    </span>
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-1.5 rounded-lg border border-border text-xs font-medium text-foreground hover:bg-muted transition-colors cursor-pointer"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

