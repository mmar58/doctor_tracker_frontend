"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2, UserPlus } from "lucide-react";
import { registerApi } from "@/lib/auth-api";
import { useAuthStore } from "@/store/auth-store";
import { ApiError } from "@/lib/api-core";

export default function RegisterPage() {
    const router = useRouter();
    const setUser = useAuthStore((s) => s.setUser);

    const [isPending, startTransition] = useTransition();
    const [showPassword, setShowPassword] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    const [form, setForm] = useState({ name: "", email: "", password: "" });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setFieldErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        startTransition(async () => {
            try {
                const user = await registerApi(form);
                setUser(user);
                toast.success(`Account created! Welcome, ${user.name}.`);
                router.push("/dashboard");
            } catch (err) {
                if (err instanceof ApiError) {
                    if (err.fieldErrors) {
                        const flat: Record<string, string> = {};
                        Object.entries(err.fieldErrors).forEach(([k, v]) => {
                            flat[k] = Array.isArray(v) ? v[0] : String(v);
                        });
                        setFieldErrors(flat);
                    } else {
                        toast.error(err.message);
                    }
                } else {
                    toast.error("Something went wrong. Please try again.");
                }
            }
        });
    };

    return (
        <div className="flex-1 flex items-center justify-center py-16 px-4">
            <div className="w-full max-w-md">
                {/* Card */}
                <div className="bg-card border border-border rounded-2xl shadow-xl p-8 sm:p-10">
                    {/* Heading */}
                    <div className="mb-8 text-center">
                        <div className="inline-flex items-center justify-center size-12 rounded-xl bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400 mb-4">
                            <UserPlus className="size-6" />
                        </div>
                        <h1 className="text-2xl font-bold text-foreground">Create your account</h1>
                        <p className="text-muted-foreground text-sm mt-1">
                            Join Doctor Tracker and manage your healthcare journey
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} noValidate className="space-y-5">
                        {/* Full Name */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1.5">
                                Full name
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                autoComplete="name"
                                required
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Jane Smith"
                                className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-sky-400/60 focus:border-sky-400 transition"
                                aria-invalid={!!fieldErrors.name}
                            />
                            {fieldErrors.name && (
                                <p className="mt-1 text-xs text-destructive">{fieldErrors.name}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={form.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-sky-400/60 focus:border-sky-400 transition"
                                aria-invalid={!!fieldErrors.email}
                            />
                            {fieldErrors.email && (
                                <p className="mt-1 text-xs text-destructive">{fieldErrors.email}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1.5">
                                Password
                                <span className="ml-1 text-xs font-normal text-muted-foreground">(min. 8 characters)</span>
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="new-password"
                                    required
                                    minLength={8}
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full px-4 py-2.5 pr-11 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-sky-400/60 focus:border-sky-400 transition"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                </button>
                            </div>
                            {fieldErrors.password && (
                                <p className="mt-1 text-xs text-destructive">{fieldErrors.password}</p>
                            )}
                        </div>

                        {/* Role note */}
                        <p className="text-xs text-muted-foreground bg-muted/60 rounded-lg px-3 py-2 border border-border">
                            All new accounts are created with the <strong>Doctor</strong> role. Contact an administrator to change your role.
                        </p>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-sky-600 hover:bg-sky-500 disabled:opacity-60 text-white font-semibold text-sm transition-colors shadow-sm cursor-pointer"
                        >
                            {isPending ? (
                                <><Loader2 className="size-4 animate-spin" /> Creating account…</>
                            ) : (
                                "Create account"
                            )}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link href="/login" className="text-sky-600 hover:text-sky-500 font-medium underline underline-offset-4">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

