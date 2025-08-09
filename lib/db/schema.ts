import { pgTable, uuid, varchar, text, timestamp, inet, jsonb, pgEnum } from 'drizzle-orm/pg-core'

// Enums
export const leadTypeEnum = pgEnum('lead_type', ['consumer', 'domain', 'business'])
export const statusEnum = pgEnum('status', ['new', 'contacted', 'qualified', 'converted', 'archived'])

// Main leads table
export const leads = pgTable('leads', {
  id: uuid('id').primaryKey().defaultRandom(),
  leadType: leadTypeEnum('lead_type').notNull(),
  domain: varchar('domain', { length: 255 }).notNull(),
  
  // Contact info
  email: varchar('email', { length: 255 }).notNull(),
  firstName: varchar('first_name', { length: 100 }),
  lastName: varchar('last_name', { length: 100 }),
  phone: varchar('phone', { length: 50 }),
  company: varchar('company', { length: 255 }),
  
  // Lead details
  message: text('message'),
  metadata: jsonb('metadata'),
  
  // Tracking
  ipAddress: inet('ip_address'),
  userAgent: text('user_agent'),
  referrer: text('referrer'),
  utmSource: varchar('utm_source', { length: 100 }),
  utmMedium: varchar('utm_medium', { length: 100 }),
  utmCampaign: varchar('utm_campaign', { length: 100 }),
  
  // Status
  status: statusEnum('status').default('new').notNull(),
  notes: text('notes'),
  
  // Timestamps
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

// Lead interactions table for tracking follow-ups
export const leadInteractions = pgTable('lead_interactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  leadId: uuid('lead_id').references(() => leads.id, { onDelete: 'cascade' }).notNull(),
  interactionType: varchar('interaction_type', { length: 50 }).notNull(),
  notes: text('notes'),
  createdBy: varchar('created_by', { length: 100 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

// Type exports for TypeScript
export type Lead = typeof leads.$inferSelect
export type NewLead = typeof leads.$inferInsert
export type LeadInteraction = typeof leadInteractions.$inferSelect
export type NewLeadInteraction = typeof leadInteractions.$inferInsert