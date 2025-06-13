// db/schema.ts
import { 
  pgTable,
  serial,
  varchar,
  timestamp 
} from "drizzle-orm/pg-core";

// Volunteer Activations Table
export const volunteer_activations = pgTable('volunteer_activations', {
  id: serial('id').primaryKey(),
  frequency: varchar('frequency', { length: 10 }).notNull(),
  mode: varchar('mode', { length: 12 }).notNull(),
  operator_name: varchar('operator_name', { length: 24 }).notNull(),
  callsign: varchar('callsign', { length: 12 }).notNull(),
  state: varchar('state', { length: 2 }).notNull(),
  start_time: varchar('start_time', { length: 8 }).notNull(),  // "HH:mm:ss" UTC
  end_time: varchar('end_time', { length: 8 })                 // Nullable for active sessions
});

// PIN Management Table
export const pins = pgTable("pins", {
  id: serial("id").primaryKey(),
  pin: varchar("pin", { length: 16 }).notNull().unique(),
  volunteer: varchar("volunteer", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// TypeScript Types
export type Pin = typeof pins.$inferSelect;
export type Activation = typeof volunteer_activations.$inferSelect;
