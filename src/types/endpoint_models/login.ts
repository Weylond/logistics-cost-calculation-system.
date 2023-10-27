import { UUID } from "crypto";

export interface LoginResponse {
    err: string;
    access_token: number;
    refresh_token: UUID
}

export interface LoginBody {
    email: string;
    pass: string;
    device_id: string;
}