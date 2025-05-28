import { pgTable, serial, text, timestamp, integer } from 'drizzle-orm/pg-core';

export const activations = pgTable('activations', {
  id: serial('id').primaryKey(),
  frequency: text('frequency').notNull(),
  mode: text('mode').notNull(),
  operator_name: text('operator_name').notNull(),
  state: text('state').notNull(),
  start_time: timestamp('start_time', { withTimezone: true }).notNull(),
  end_time: timestamp('end_time', { withTimezone: true }),
  activation_number: integer('activation_number').notNull(), // cumulative
  operator_activation_number: integer('operator_activation_number').notNull(), // per-operator
});