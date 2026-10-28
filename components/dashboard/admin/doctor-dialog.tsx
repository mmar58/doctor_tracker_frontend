"use client";

import { useState, useEffect } from "react";
import { Doctor } from "@/lib/types";
import { createDoctorApi, updateDoctorApi, CreateDoctorPayload } from "@/lib/doctors-api";
import { toast } from "sonner";
import { X, Loader2 } from "lucide-react";

interface DoctorDialogProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    doctor?: Doctor | null;
}

export function DoctorDialog({ open, onClose, onSuccess, doctor }: DoctorDialogProps) {
    const isEdit = Boolean(doctor);

    const [form, setForm] = useState<CreateDoctorPayload>({
        name: "",
        email: "",
        password: "",
        hospital: "",
        phone: "",
        isActive: true,
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (doctor) {
            setForm({
                name: doctor.name || "",
                email: doctor.userId?.email || "",
                password: "",
                hospital: doctor.hospital || "",
                phone: doctor.phone || "",
                isActive: doctor.userId?.isActive !== false,
            });
        } else {
            setForm({
                name: "",
                email: "",
                password: "",
                hospital: "",
                phone: "",
                isActive: true,
            });
        }
    }, [doctor, open]);

    if (!open) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            if (isEdit && doctor) {
                const payload: Partial<CreateDoctorPayload> = {
                    name: form.name,
                    email: form.email,
                    hospital: form.hospital,
                    phone: form.phone,
                    isActive: form.isActive,
                };
                if (form.password) {
                    payload.password = form.password;
                }
                await updateDoctorApi(doctor._id, payload);
                toast.success("Doctor updated successfully");
            } else {
                await createDoctorApi(form);
                toast.success("Doctor created successfully");
            }
            onSuccess();
            onClose();
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Failed to save doctor";
            toast.error(msg);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="relative w-full max-w-lg rounded-2xl bg-card border border-border p-6 sm:p-8 shadow-2xl">
                <div className="flex items-center justify-between pb-4 border-b border-border">
                    <h2 className="text-xl font-bold text-foreground">
                        {isEdit ? "Edit Doctor Profile" : "Add New Doctor"}
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
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                            Doctor Name *
                        </label>
                        <input
                            type="text"
                            required
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            placeholder="Dr. John Smith"
                            className="w-full px-3.5 py-2 rounded-lg border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-sky-500"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                                Email Address *
                            </label>
                            <input
                                type="email"
                                required
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                placeholder="doctor@hospital.org"
                                className="w-full px-3.5 py-2 rounded-lg border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-sky-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                                {isEdit ? "New Password (optional)" : "Password *"}
                            </label>
                            <input
                                type="password"
                                required={!isEdit}
                                minLength={8}
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                placeholder="••••••••"
                                className="w-full px-3.5 py-2 rounded-lg border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-sky-500"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                                Hospital / Clinic *
                            </label>
                            <input
                                type="text"
                                required
                                value={form.hospital}
                                onChange={(e) => setForm({ ...form, hospital: e.target.value })}
                                placeholder="Central Hospital"
                                className="w-full px-3.5 py-2 rounded-lg border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-sky-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                value={form.phone}
                                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                placeholder="+1 (555) 000-0000"
                                className="w-full px-3.5 py-2 rounded-lg border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-sky-500"
                            />
                        </div>
                    </div>

                    {isEdit && (
                        <div className="flex items-center gap-2 pt-2">
                            <input
                                type="checkbox"
                                id="isActive"
                                checked={form.isActive}
                                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                                className="size-4 rounded border-border text-sky-600 focus:ring-sky-500"
                            />
                            <label htmlFor="isActive" className="text-sm font-medium text-foreground cursor-pointer">
                                Active Doctor Account
                            </label>
                        </div>
                    )}

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
                            {isEdit ? "Save Changes" : "Create Doctor"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

