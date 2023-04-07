DROP TABLE IF EXISTS public.position;
CREATE TABLE public.position (
id                      uuid primary key,
pos_code                varchar null,
pos_description         varchar null,
status                  bool,


created_by              varchar(50),
created_date            timestamp(6) default CURRENT_TIMESTAMP,
last_modified_by        varchar(50),
last_modified_date      timestamp(6) default CURRENT_TIMESTAMP,
deleted                 bool default false
);



DROP TABLE IF EXISTS public.office;
CREATE TABLE public.office (
id                      uuid primary key,
office_code             varchar null,
office_description      varchar null,
office_type             varchar null,
office_country          varchar null,
office_province         varchar null,
office_municipality     varchar null,
office_barangay         varchar null,
office_street           varchar null,
office_zipcode          varchar null,
status                  bool,


created_by              varchar(50),
created_date            timestamp(6) default CURRENT_TIMESTAMP,
last_modified_by        varchar(50),
last_modified_date      timestamp(6) default CURRENT_TIMESTAMP,
deleted                 bool default false
);