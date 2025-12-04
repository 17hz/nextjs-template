import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const app = pgTable("apps", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  version: varchar({ length: 255 }).notNull(),
});
