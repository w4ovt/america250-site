import { pgTable, varchar, serial } from 'drizzle-orm/pg-core';

export const volunteer_activations = pgTable('volunteer_activations', {
  id: serial('id').primaryKey(),
  frequency: varchar('frequency', { length: 10 }).notNull(),
  mode: varchar('mode', { length: 12 }).notNull(),
  operator_name: varchar('operator_name', { length: 24 }).notNull(),
  callsign: varchar('callsign', { length: 12 }).notNull(),
  state: varchar('state', { length: 2 }).notNull(),
  start_time: varchar('start_time', { length: 8 }).notNull(),        // "hh:mm:ss" Zulu/UTC
  end_time: varchar('end_time', { length: 8 })                       // nullable for active/ended logic
});
