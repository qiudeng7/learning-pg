import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DRIZZLE, type Database } from '../db/db.module.js';
import { users } from '../db/schema.js';

@Injectable()
export class UsersService {
  constructor(@Inject(DRIZZLE) private readonly db: Database) {}

  /** 新增一个用户 */
  create(name: string, email: string) {
    // INSERT INTO "users" ("id", "name", "email", "created_at")
    // VALUES (DEFAULT, $1, $2, DEFAULT)
    // RETURNING "id", "name", "email", "created_at";
    return this.db.insert(users).values({ name, email }).returning();
  }

  /** 查全部用户 */
  findAll() {
    // SELECT "id", "name", "email", "created_at" FROM "users";
    return this.db.select().from(users);
  }

  /** 按 id 查一个用户 */
  async findOne(id: number) {
    // SELECT "id", "name", "email", "created_at" FROM "users"
    // WHERE "users"."id" = $1
    // LIMIT $2;
    const [user] = await this.db.select().from(users).where(eq(users.id, id)).limit(1);

    if (!user) {
      throw new NotFoundException(`user ${id} not found`);
    }
    return user;
  }

  /** 按 id 删除一个用户 */
  async remove(id: number) {
    // DELETE FROM "users" WHERE "users"."id" = $1
    // RETURNING "id", "name", "email", "created_at";
    const [user] = await this.db.delete(users).where(eq(users.id, id)).returning();

    if (!user) {
      throw new NotFoundException(`user ${id} not found`);
    }
    return user;
  }
}
