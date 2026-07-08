import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const requestsTable = pgTable("requests", {
  id: serial("id").primaryKey(),
  type: text("type", {
    enum: [
      "Add dependent",
      "Remove dependent",
      "Update details",
      "Reinstate",
    ],
  }).notNull(),
  policyNo: text("policy_no").notNull(),
  memberName: text("member_name").notNull(),
  insurer: text("insurer").notNull(),
  stage: text("stage", {
    enum: ["Received", "Reviewed", "Actioned", "Confirmed"],
  })
    .notNull()
    .default("Received"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const insertRequestSchema = createInsertSchema(requestsTable).omit({
  id: true,
  stage: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertRequest = z.infer<typeof insertRequestSchema>;
export type InsurerRequestRow = typeof requestsTable.$inferSelect;
