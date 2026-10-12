import { Module } from '@nestjs/common';
import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema.js';

export const DATABASE_URL =
  process.env.DATABASE_URL ?? 'postgres://postgres:postgres@localhost:5432/postgres';

export const DRIZZLE = 'DRIZZLE';

export type Database = NodePgDatabase<typeof schema>;

@Module({
  providers: [
    {
      provide: DRIZZLE,
      useFactory: (): Database => {
        const pool = new Pool({ connectionString: DATABASE_URL });
        // logger: true 会把每条语句真正发出的 SQL 打到控制台
        return drizzle(pool, { schema, logger: true });
      },
    },
  ],
  exports: [DRIZZLE],
})
export class DbModule {}
