CREATE TABLE "hospital_configuration"."gen_info_bed_capacity" (
  "id" uuid NOT NULL,
  "abc" int4,
  "implementingbeds" int4,
  "bor" int4,
  "reportingyear" int4,
  "created_by" varchar(50) COLLATE "pg_catalog"."default",
  "created_date" timestamp(6) DEFAULT now(),
  "last_modified_by" varchar(50) COLLATE "pg_catalog"."default",
  "last_modified_date" timestamp(6) DEFAULT now(),
  "deleted" bool,
  PRIMARY KEY ("id")
);