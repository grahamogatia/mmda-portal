import z from "zod";

export const loginSchema = z.object({
    username: z.string().min(4, "Username must not be empty.").max(100),
    password: z.string().min(4, "Password must not be empty.").max(100),
});

const LocationSchema = z.object({
    id:z.number(),
    name: z.string(),
    address: z.string(),
})
export const advisorySchema = z.object({
    content: z.string().min(1, "Advisory content must not be empty."),
    location: z.array(LocationSchema).min(1, "At least one location must be selected."),
});