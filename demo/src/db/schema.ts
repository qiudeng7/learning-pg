import { pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';

/**
 *   CREATE TABLE "users" (
 *     "id" serial PRIMARY KEY NOT NULL,
 *     "name" varchar(100) NOT NULL,
 *     "email" varchar(255) NOT NULL,
 *     "created_at" timestamp with time zone DEFAULT now() NOT NULL,
 *     CONSTRAINT "users_email_unique" UNIQUE("email")
 *   );
 */
export const users = pgTable('users', {
  id: serial('id').primaryKey(), // serial PRIMARY KEY
  name: varchar('name', { length: 100 }).notNull(), // varchar(100) NOT NULL
  email: varchar('email', { length: 255 }).notNull().unique(), // varchar(255) NOT NULL UNIQUE
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(), // timestamp with time zone DEFAULT now() NOT NULL
});
