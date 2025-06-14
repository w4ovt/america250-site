// db/schema.ts
import {
  pgTable,
  serial,
  varchar,
  timestamp,
  boolean as pgBoolean
} from "drizzle-orm/pg-core";

// Volunteer Activations Table (ON AIR SESSIONS)
export const volunteer_activations = pgTable('volunteer_activations', {
  id: serial('id').primaryKey(),
  frequency: varchar('frequency', { length: 10 }).notNull(),
  mode: varchar('mode', { length: 10 }).notNull(),
  operator_name: varchar('operator_name', { length: 255 }).notNull(),
  callsign: varchar('callsign', { length: 10 }).notNull(),
  state: varchar('state', { length: 2 }).notNull(),
  start_time: timestamp('start_time', { withTimezone: true }).notNull(),
  end_time: timestamp('end_time', { withTimezone: true })
});

// Volunteer Registry Table (VOLUNTEER CREDENTIALS)
export const volunteers = pgTable('volunteers', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  callsign: varchar('callsign', { length: 10 }).notNull().unique(),
  state: varchar('state', { length: 2 }).notNull(),
  pin: varchar('pin', { length: 8 }).notNull().unique(),
  is_admin: pgBoolean('is_admin').notNull().default(false),  // <-- FIXED HERE
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow()
});

// Admin PIN Management Table (LEGACY SYSTEM)
export const pins = pgTable("pins", {
  id: serial("id").primaryKey(),
  pin: varchar("pin", { length: 16 }).notNull().unique(),
  volunteer: varchar("volunteer", { length: 255 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow()
});

export const archived_activations = pgTable('archived_activations', {
  id: serial('id').primaryKey(),
  frequency: varchar('frequency', { length: 10 }),
  mode: varchar('mode', { length: 10 }),
  operator_name: varchar('operator_name', { length: 255 }),
  callsign: varchar('callsign', { length: 10 }),
  state: varchar('state', { length: 2 }),
  start_time: timestamp('start_time', { withTimezone: true }),
  end_time: timestamp('end_time', { withTimezone: true })
});

// TypeScript Types (these must come *after* the exports above)
export type Pin = typeof pins.$inferSelect;
export type Activation = typeof volunteer_activations.$inferSelect;
export type Volunteer = typeof volunteers.$inferSelect;
