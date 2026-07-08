import { pgTable, text, serial } from "drizzle-orm/pg-core";

export const settingsTable = pgTable("settings", {
  id: serial("id").primaryKey(),
  facilityName: text("facility_name").notNull().default("AfricMed Hospital"),
});

export type SettingsRow = typeof settingsTable.$inferSelect;
