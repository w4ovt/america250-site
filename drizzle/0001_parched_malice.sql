ALTER TABLE "volunteer_activations" ALTER COLUMN "frequency" SET DATA TYPE varchar(10);--> statement-breakpoint
ALTER TABLE "volunteer_activations" ALTER COLUMN "mode" SET DATA TYPE varchar(12);--> statement-breakpoint
ALTER TABLE "volunteer_activations" ALTER COLUMN "operator_name" SET DATA TYPE varchar(24);--> statement-breakpoint
ALTER TABLE "volunteer_activations" ALTER COLUMN "callsign" SET DATA TYPE varchar(12);--> statement-breakpoint
ALTER TABLE "volunteer_activations" ALTER COLUMN "end_time" DROP NOT NULL;