export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    role?: string;
    nim?: string;
    no_telp?: string;
    asal_instansi?: string;
    prodi?: string;
    semester?: string;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
    global_settings?: Record<string, string>;
};
