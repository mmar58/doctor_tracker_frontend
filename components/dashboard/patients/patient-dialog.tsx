"use client";

import { useState, useEffect } from "react";
import { Patient, Doctor } from "@/lib/types";
import { createPatientApi, updatePatientApi, CreatePatientPayload } from "@/lib/patients-api";
import { getDoctorsApi } from "@/lib/doctors-api";
import { toast } from "sonner";
import { X, Loader2, Info } from "lucide-react";

interface PatientDialogProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    patient?: Patient | null;
    /** The role of the currently logged-in user — controls whether the doctor selector is shown. */
    userRole: "admin" | "doctor";
}

export function PatientDialog({ open, onClose, onSuccess, patient, userRole }: PatientDialogProps) {
    const isEdit = Boolean(patient);
    const isAdmin = userRole === "admin";

    const [form, setForm] = useState<CreatePatientPayload>({
        name: "",
        status: "stable",
        admit: false,
        gender: "male",
        age: 30,
        description: "",
        doctors: [],
    });
    const [doctorsList, setDoctorsList] = useState<Doctor[]>([]);
    const [submitting, setSubmitting] = useState(false);

    // Fetch doctors list only for admin (doctor role never needs it)
    useEffect(() => {
        if (open && isAdmin) {
            getDoctorsApi({ limit: 100 })
                .then((res) => setDoctorsList(res.data))
                .catch(() => { });
        }
    }, [open, isAdmin]);

    useEffect(() => {
        if (patient) {
            const assignedDoctorIds: string[] = Array.isArray(patient.doctors)
                ? patient.doctors.map((d) => (typeof d === "string" ? d : d._id))
                : [];

            setForm({
                name: patient.name || "",
                status: patient.status || "stable",
                admit: Boolean(patient.admit),
                gender: patient.gender || "male",
                age: patient.age || 30,
                description: patient.description || "",
                // Only carry assigned IDs for admin; for doctors it will be ignored by the backend anyway
                doctors: isAdmin ? assignedDoctorIds : [],
            });
        } else {
            setForm({
                name: "",
                status: "stable",
                admit: false,
                gender: "male",
                age: 30,
                description: "",
                doctors: [],
            });
        }
    }, [patient, open, isAdmin]);

    if (!open) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            // For doctor role, always send empty doctors — backend will auto-assign.
            const payload = isAdmin ? form : { ...form, doctors: [] };

            if (isEdit && patient) {
                await updatePatientApi(patient._id, payload);
                toast.success("Patient updated successfully");
            } else {
                await createPatientApi(payload);
                toast.success("Patient registered successfully");
            }
            onSuccess();
            onClose();
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Failed to save patient";
            toast.error(msg);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="relative w-full max-w-lg rounded-2xl bg-card border border-border p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between pb-4 border-b border-border">
                    <h2 className="text-xl font-bold text-foreground">
                        {isEdit ? "Edit Patient Record" : "Add New Patient"}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    >
                        <X className="size-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                    {/* Patient Name */}
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                            Patient Full Name *
                        </label>
                        <input
                            type="text"
                            required
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            placeholder="John Doe"
                            className="w-full px-3.5 py-2 rounded-lg border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-sky-500"
                        />
                    </div>

                    {/* Gender & Age */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                                Gender *
                            </label>
                            <select
                                value={form.gender}
                                onChange={(e) =>
                                    setForm({ ...form, gender: e.target.value as "male" | "female" })
                                }
                                className="w-full px-3.5 py-2 rounded-lg border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-sky-500"
                            >
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                                Age (years) *
                            </label>
                            <input
                                type="number"
                                required
                                min={0}
                                max={120}
                                value={form.age}
                                onChange={(e) => setForm({ ...form, age: Number(e.target.value) })}
                                className="w-full px-3.5 py-2 rounded-lg border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-sky-500"
                            />
                        </div>
                    </div>

                    {/* Status & Admission */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                                Health Status *
                            </label>
                            <select
                                value={form.status}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        status: e.target.value as "very-ill" | "ill" | "stable" | "good",
                                    })
                                }
                                className="w-full px-3.5 py-2 rounded-lg border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-sky-500"
                            >
                                <option value="good">Good (Healthy / Recovering)</option>
                                <option value="stable">Stable (Under Monitoring)</option>
                                <option value="ill">Ill (Requires Intervention)</option>
                                <option value="very-ill">Very Ill (Critical Care)</option>
                            </select>
                        </div>

                        <div className="flex flex-col justify-end pb-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={form.admit}
                                    onChange={(e) => setForm({ ...form, admit: e.target.checked })}
                                    className="size-4 rounded border-border text-rose-600 focus:ring-rose-500"
                                />
                                <span className="text-sm font-semibold text-foreground">
                                    Admit to Hospital Ward
                                </span>
                            </label>
                            <span className="text-[11px] text-muted-foreground ml-6">
                                Check if patient requires overnight hospitalization
                            </span>
                        </div>
                    </div>

                    {/*
                      ── Doctor Assignment ────────────────────────────────────
                      Only visible to admin. For doctors, the backend always
                      auto-assigns the patient to their own profile.
                    */}
                    {isAdmin ? (
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                                Assign Doctor
                            </label>
                            <select
                                value={form.doctors?.[0] || ""}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setForm({ ...form, doctors: val ? [val] : [] });
                                }}
                                className="w-full px-3.5 py-2 rounded-lg border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-sky-500"
                            >
                                <option value="">-- Select a Doctor --</option>
                                {doctorsList.map((doc) => (
                                    <option key={doc._id} value={doc._id}>
                                        {doc.name} ({doc.hospital})
                                    </option>
                                ))}
                            </select>
                        </div>
                    ) : (
                        <div>

                        </div>
                    )}

                    {/* Clinical Notes */}
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                            Clinical Notes / Description *
                        </label>
                        <textarea
                            required
                            rows={3}
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            placeholder="Symptoms, clinical findings, treatment plan..."
                            className="w-full px-3.5 py-2 rounded-lg border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-sky-500"
                        />
                    </div>

                    {/* Actions */}
                    <div className="mt-6 pt-4 border-t border-border flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-sm font-semibold text-white transition-colors disabled:opacity-60 cursor-pointer shadow-xs"
                        >
                            {submitting && <Loader2 className="size-4 animate-spin" />}
                            {isEdit ? "Update Patient" : "Register Patient"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
