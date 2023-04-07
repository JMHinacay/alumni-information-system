DROP TABLE IF EXISTS public.survey_sched;
CREATE TABLE public.survey_sched (
id                      uuid primary key,
lot_transaction         uuid null,
survey_date_start       date default CURRENT_DATE,
survey_date_end         date default CURRENT_DATE,
survey_remarks          varchar (100),
status                  varchar(20),
created_by             varchar(50),
created_date           timestamp(6) default CURRENT_TIMESTAMP,
last_modified_by       varchar(50),
last_modified_date     timestamp(6) default CURRENT_TIMESTAMP,
foreign key (lot_transaction) references lot.lot_transaction(id)
);


DROP TABLE IF EXISTS public.survey_team_member;
CREATE TABLE public.survey_team_member (
id                      uuid primary key,
created_by             varchar(50),
created_date           timestamp(6) default CURRENT_TIMESTAMP,
last_modified_by       varchar(50),
last_modified_date     timestamp(6) default CURRENT_TIMESTAMP,
employees                uuid null,
foreign key (employees) references hrm.employees(id)
);






