import { pgTable, varchar, serial } from 'drizzle-orm/pg-core';

export const volunteer_activations = pgTable('volunteer_activations', {
  id: serial('id').primaryKey(),
  frequency: varchar('frequency', { length: 20 }).notNull(),
  mode: varchar('mode', { length: 16 }).notNull(),
  operator_name: varchar('operator_name', { length: 40 }).notNull(),
  callsign: varchar('callsign', { length: 12 }).notNull(),    // <--- new line
  state: varchar('state', { length: 2 }).notNull(),
  start_time: varchar('start_time', { length: 32 }).notNull(),
  end_time: varchar('end_time', { length: 32 }).notNull(),
});