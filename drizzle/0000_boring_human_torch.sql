CREATE TABLE "volunteer_activations" (
	"id" serial PRIMARY KEY NOT NULL,
	"frequency" varchar(20) NOT NULL,
	"mode" varchar(16) NOT NULL,
	"operator_name" varchar(40) NOT NULL,
	"state" varchar(2) NOT NULL,
	"start_time" varchar(32) NOT NULL,
	"end_time" varchar(32) NOT NULL
);
