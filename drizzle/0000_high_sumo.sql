CREATE TABLE "pins" (
	"id" serial PRIMARY KEY NOT NULL,
	"pin" varchar(16) NOT NULL,
	"volunteer" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "pins_pin_unique" UNIQUE("pin")
);
--> statement-breakpoint
CREATE TABLE "volunteer_activations" (
	"id" serial PRIMARY KEY NOT NULL,
	"frequency" varchar(10) NOT NULL,
	"mode" varchar(10) NOT NULL,
	"operator_name" varchar(255) NOT NULL,
	"callsign" varchar(10) NOT NULL,
	"state" varchar(2) NOT NULL,
	"start_time" timestamp with time zone NOT NULL,
	"end_time" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "volunteers" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"callsign" varchar(10) NOT NULL,
	"state" varchar(2) NOT NULL,
	"pin" varchar(8) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "volunteers_callsign_unique" UNIQUE("callsign"),
	CONSTRAINT "volunteers_pin_unique" UNIQUE("pin")
);
