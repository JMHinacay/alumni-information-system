

ALTER TABLE public.user_activity
ALTER COLUMN forwarded_by TYPE VARCHAR,
ALTER COLUMN activity_type TYPE VARCHAR,
ALTER COLUMN land_status TYPE VARCHAR,
add column is_override bool,
add column pending_type varchar null,
add column remarks varchar null,
add column pending_by varchar null,
add column is_pending bool default false
;



