import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const serverEnv = createEnv({
    server: {
        AUTH_SECRET: z.string().min(1),
        AUTH_GITHUB_ID: z.string().min(1),
        AUTH_GITHUB_SECRET: z.string().min(1),
    },
    runtimeEnv: {
        AUTH_SECRET: process.env.AUTH_SECRET,
        AUTH_GITHUB_ID: process.env.AUTH_GITHUB_ID,
        AUTH_GITHUB_SECRET: process.env.AUTH_GITHUB_SECRET,
    },
});
