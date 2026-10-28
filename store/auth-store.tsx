import { AuthUser } from "@/lib/types";
import { create } from "zustand";
import { getMeApi, logoutApi } from "@/lib/auth-api";

type AuthStore = {
    user: AuthUser | null;
    loading: boolean;
    setUser: (user: AuthUser | null) => void;
    fetchMe: () => Promise<void>;
    logout: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
    user: null,
    loading: true,

    setUser: (user) => set({ user }),

    fetchMe: async () => {
        try {
            set({ loading: true });
            const user = await getMeApi();
            set({ user });
        } catch {
            set({ user: null });
        } finally {
            set({ loading: false });
        }
    },

    logout: async () => {
        try {
            await logoutApi();
        } catch {
            // swallow — session might already be dead
        }
        set({ user: null });
        if (typeof window !== "undefined") {
            window.location.href = "/";
        }
    },
}));
