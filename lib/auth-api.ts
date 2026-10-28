import { request } from "./api-core";
import { AuthUser } from "./types";

export interface LoginPayload {
    email: string;
    password: string;
}

export interface RegisterPayload {
    name: string;
    email: string;
    password: string;
}

export async function loginApi(payload: LoginPayload): Promise<AuthUser> {
    return request<AuthUser>("/auth/login", { method: "POST", body: payload });
}

export async function registerApi(payload: RegisterPayload): Promise<AuthUser> {
    return request<AuthUser>("/auth/register", { method: "POST", body: payload });
}

export async function logoutApi(): Promise<void> {
    await request("/auth/logout", { method: "POST" });
}

export async function getMeApi(): Promise<AuthUser> {
    return request<AuthUser>("/auth/me");
}

