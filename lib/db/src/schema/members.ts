import { pgTable, text, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const membersTable = pgTable("members", {
  id: serial("id").primaryKey(),
  policyNo: text("policy_no").notNull().unique(),
  name: text("name").notNull(),
  insurer: text("insurer").notNull(),
  employer: text("employer").notNull(),
  relationship: text("relationship", {
    enum: ["Principal", "Spouse", "Child", "Dependent"],
  }).notNull(),
  phone: text("phone").notNull(),
  dob: text("dob").notNull(),
  status: text("status", { enum: ["Active", "Inactive"] }).notNull(),
});

export const insertMemberSchema = createInsertSchema(membersTable).omit({
  id: true,
});
export type InsertMember = z.infer<typeof insertMemberSchema>;
export type Member = typeof membersTable.$inferSelect;
