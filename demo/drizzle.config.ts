import { defineConfig } from 'drizzle-kit';

/** 要和 src/db/db.module.ts 里的 DATABASE_URL 保持一致 */
const DATABASE_URL =
  process.env.DATABASE_URL ?? 'postgres://postgres:postgres@localhost:5432/postgres';

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/db/schema.ts',
  out: './drizzle', // 生成的 .sql 迁移文件放这里
  dbCredentials: { url: DATABASE_URL },
});
