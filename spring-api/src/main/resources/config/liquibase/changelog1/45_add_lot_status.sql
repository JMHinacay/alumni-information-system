
ALTER TABLE public.user_activity
ADD COLUMN lot_status varchar null;

DROP TABLE IF EXISTS public.denr_updates;
CREATE TABLE public.denr_updates (
id                      uuid primary key,
date                    timestamp(6) default CURRENT_TIMESTAMP,
update_type             varchar ,
current_unit            varchar ,
current_name            varchar ,
assigned_unit           varchar ,
assigned_name           varchar ,
lot_transaction         uuid null,
remarks                 varchar null,
status varchar null,
currently_handled_by varchar null,

last_modified_by       varchar(50),
last_modified_date     timestamp(6) default CURRENT_TIMESTAMP,
created_by             varchar(50),
created_date           timestamp(6) default CURRENT_TIMESTAMP,
foreign key (lot_transaction) references lot.lot_transaction(id)
);















