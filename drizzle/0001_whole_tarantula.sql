ALTER TABLE "data_streams" DROP CONSTRAINT "data_streams_label_unique";--> statement-breakpoint
ALTER TABLE "sensor_data" DROP CONSTRAINT "sensor_data_unit_id_measurement_units_id_fk";
--> statement-breakpoint
ALTER TABLE "sensor_data" DROP COLUMN "unit_id";