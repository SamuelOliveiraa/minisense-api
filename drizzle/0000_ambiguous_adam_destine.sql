CREATE TABLE "data_streams" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" uuid DEFAULT gen_random_uuid(),
	"label" text NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	"device_id" uuid NOT NULL,
	"unit_id" uuid NOT NULL,
	CONSTRAINT "data_streams_key_unique" UNIQUE("key"),
	CONSTRAINT "data_streams_label_unique" UNIQUE("label")
);
--> statement-breakpoint
CREATE TABLE "measurement_units" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"symbol" text NOT NULL,
	"description" text NOT NULL,
	CONSTRAINT "measurement_units_symbol_unique" UNIQUE("symbol"),
	CONSTRAINT "measurement_units_description_unique" UNIQUE("description")
);
--> statement-breakpoint
CREATE TABLE "sensor_data" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"timestamp" integer NOT NULL,
	"value" double precision NOT NULL,
	"stream_id" uuid NOT NULL,
	"unit_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sensor_devices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" uuid DEFAULT gen_random_uuid(),
	"label" text NOT NULL,
	"description" text NOT NULL,
	"user_id" uuid NOT NULL,
	CONSTRAINT "sensor_devices_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" text NOT NULL,
	"email" text NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "data_streams" ADD CONSTRAINT "data_streams_device_id_sensor_devices_id_fk" FOREIGN KEY ("device_id") REFERENCES "public"."sensor_devices"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "data_streams" ADD CONSTRAINT "data_streams_unit_id_measurement_units_id_fk" FOREIGN KEY ("unit_id") REFERENCES "public"."measurement_units"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sensor_data" ADD CONSTRAINT "sensor_data_stream_id_data_streams_id_fk" FOREIGN KEY ("stream_id") REFERENCES "public"."data_streams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sensor_data" ADD CONSTRAINT "sensor_data_unit_id_measurement_units_id_fk" FOREIGN KEY ("unit_id") REFERENCES "public"."measurement_units"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sensor_devices" ADD CONSTRAINT "sensor_devices_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "timestamp_index" ON "sensor_data" USING btree ("timestamp");