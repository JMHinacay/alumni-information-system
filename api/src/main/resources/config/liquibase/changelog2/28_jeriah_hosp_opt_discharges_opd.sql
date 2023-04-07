CREATE TABLE "hospital_configuration"."hosp_opt_discharges_opd" (
  "id" uuid NOT NULL,
  "opdconsultations" varchar(255),
  "number" int4,
  "icd10code" varchar(50),
  "reportingyear" int4,


  "created_by" varchar(50) COLLATE "pg_catalog"."default",
  "created_date" timestamp(6) DEFAULT now(),
  "last_modified_by" varchar(50) COLLATE "pg_catalog"."default",
  "last_modified_date" timestamp(6) DEFAULT now(),
  "deleted" bool,
  PRIMARY KEY ("id")
);