import z from "zod";

export const loginSchema = z.object({
    username: z.string().min(4, "Username must not be empty.").max(100),
    password: z.string().min(4, "Password must not be empty.").max(100),
});

// TODO: Advisory Schema