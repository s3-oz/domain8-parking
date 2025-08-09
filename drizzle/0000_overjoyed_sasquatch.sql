CREATE TYPE "public"."lead_type" AS ENUM('consumer', 'domain', 'business');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('new', 'contacted', 'qualified', 'converted', 'archived');--> statement-breakpoint
CREATE TABLE "lead_interactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lead_id" uuid NOT NULL,
	"interaction_type" varchar(50) NOT NULL,
	"notes" text,
	"created_by" varchar(100),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lead_type" "lead_type" NOT NULL,
	"domain" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"first_name" varchar(100),
	"last_name" varchar(100),
	"phone" varchar(50),
	"company" varchar(255),
	"message" text,
	"metadata" jsonb,
	"ip_address" "inet",
	"user_agent" text,
	"referrer" text,
	"utm_source" varchar(100),
	"utm_medium" varchar(100),
	"utm_campaign" varchar(100),
	"status" "status" DEFAULT 'new' NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "lead_interactions" ADD CONSTRAINT "lead_interactions_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;