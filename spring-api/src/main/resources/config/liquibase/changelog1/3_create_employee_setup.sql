DROP TABLE IF EXISTS hrm.employees;
CREATE TABLE hrm.employees (
id                      uuid primary key,
emp_no                  varchar null,
title_initials          varchar null,
first_name              varchar null,
middle_name             varchar null,
last_name               varchar null,
name_suffix             varchar null,
gender                  varchar(7) null,
dob                     date,
email_address           varchar null,
employee_tel_no         varchar null,
employee_cel_no         varchar null,
nationality             varchar null,
civil_status            varchar null,
blood_type              varchar null,

street                  varchar null,
country                 varchar null,
province                varchar null,
municipality            varchar null,
barangay                varchar null,
zipcode                 varchar null,

emergency_contact_name  varchar null,
emergency_contact_address   varchar null,
emergency_contact_relationship  varchar null,
emergency_contact_no    varchar null,

employee_type           varchar null,
philhealth_no           varchar null,
sss_no                  varchar null,
tin_no                  varchar null,
pag_ibig_id             varchar null,
monthly_basic_salary    numeric,

is_active               bool,

position                uuid null,
office                  uuid null,
"user"                  bigserial not null,

created_by              varchar(50),
created_date            timestamp(6) default CURRENT_TIMESTAMP,
last_modified_by        varchar(50),
last_modified_date      timestamp(6) default CURRENT_TIMESTAMP,
deleted                 bool default false,

foreign key (position)  references public.position(id),
foreign key (office)    references public.office(id),
foreign key ("user")    references public.t_user(id)
);