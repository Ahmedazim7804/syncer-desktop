import { z } from "zod";

const loginSchema = z.object({
    serverUrl: z.string().url({
        message: "Please enter a valid URL",
    }),
    username: z
        .string()
        .nonempty()
        .min(6, {
            message: "Username must be at least 6 characters",
        })
        .max(16, {
            message: "Username must be at most 16 characters",
        }),
    password: z
        .string()
        .nonempty()
        .min(8, {
            message: "Password must be at least 8 characters",
        })
        .max(32, {
            message: "Password must be at most 32 characters",
        }),
});

export { loginSchema };
