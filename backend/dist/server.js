import mongoose from 'mongoose';
import { app } from './app.js';
import { env } from './config/env.js';
import { seedDevelopmentData } from './scripts/seed.js';
await mongoose.connect(env.MONGODB_URI, { dbName: env.MONGODB_DB_NAME });
if (env.NODE_ENV === 'development')
    await seedDevelopmentData();
const server = app.listen(env.PORT, () => console.log(`MODEA API listening on ${env.PORT}`));
const stop = () => server.close(() => mongoose.disconnect().finally(() => process.exit(0)));
process.on('SIGTERM', stop);
process.on('SIGINT', stop);
