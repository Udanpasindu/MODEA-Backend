import 'dotenv/config';
import { z } from 'zod';
const schema = z.object({ NODE_ENV: z.enum(['development', 'test', 'production']).default('development'), PORT: z.coerce.number().default(5000), MONGODB_URI: z.string().min(1), MONGODB_DB_NAME: z.string().min(1).default('MODEA'), FRONTEND_URL: z.string().url(), JWT_SECRET: z.string().min(32), WHATSAPP_PHONE: z.string().regex(/^\d{8,15}$/), CURRENCY_CODE: z.string().length(3).default('LKR'), CLOUDINARY_CLOUD_NAME: z.string().optional(), CLOUDINARY_API_KEY: z.string().optional(), CLOUDINARY_API_SECRET: z.string().optional(), ADMIN_BOOTSTRAP_USERNAME: z.string().min(3).optional(), ADMIN_BOOTSTRAP_PASSWORD: z.string().min(8).optional() });
export const env = schema.parse(process.env);
