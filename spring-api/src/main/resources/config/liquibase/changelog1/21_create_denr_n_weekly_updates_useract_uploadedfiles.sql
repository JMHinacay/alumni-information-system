DROP TABLE IF EXISTS public.denr_updates;
CREATE TABLE public.denr_updates (
id                      uuid primary key,
date                    timestamp(6) default CURRENT_TIMESTAMP,
update_type             varchar (45),
current_unit            varchar (20),
current_name            varchar (45),
assigned_unit           varchar (45),
assigned_name           varchar (45),
last_entry_date         timestamp(6),
lot_transaction         uuid null,
foreign key (lot_transaction) references lot.lot_transaction(id)
);


DROP TABLE IF EXISTS public.weekly_updates;
CREATE TABLE public.weekly_updates (
id                      uuid primary key,
wk_update_date          timestamp(6) default CURRENT_TIMESTAMP,
wk_update_remarks       varchar(100),
"user"                  bigserial not null,
lot_transaction         uuid null,
foreign key ("user") references public.t_user(id),
foreign key (lot_transaction) references lot.lot_transaction(id)
);


DROP TABLE IF EXISTS public.user_activity;
CREATE TABLE public.user_activity (
id                      uuid primary key,
position             uuid null,
date_assigned           timestamp(6) default CURRENT_TIMESTAMP,
activity_type           varchar(45),
status                  varchar(45),
forwarded_by            varchar(45),
land_status             varchar(45),
"user "                 bigserial not null,
lot_transaction         uuid null,
foreign key ("user " ) references public.t_user(id),
foreign key (lot_transaction) references lot.lot_transaction(id),
foreign key (position) references public.position(id)
);


DROP TABLE IF EXISTS public.uploaded_files;
CREATE TABLE public.uploaded_files (
id                      uuid primary key,
file_name               varchar(45),
file_date               timestamp(6) default CURRENT_TIMESTAMP,
file_path               varchar(45),
lot_transaction         uuid null,
foreign key (lot_transaction) references lot.lot_transaction(id)
);





