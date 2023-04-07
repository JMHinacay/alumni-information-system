DROP TABLE IF EXISTS public.service;
CREATE TABLE public.service (
id                      uuid primary key,
service_name            varchar null,
service_cost            numeric,
status                  bool,
allow_multiple_lot      bool,
created_by              varchar(50),
created_date            timestamp(6) default CURRENT_TIMESTAMP,
last_modified_by        varchar(50),
last_modified_date      timestamp(6) default CURRENT_TIMESTAMP,
deleted                 bool default false
);



