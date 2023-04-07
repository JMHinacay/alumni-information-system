

ALTER TABLE public.user_activity
ADD COLUMN last_modified_by       varchar(50),
ADD COLUMN last_modified_date     timestamp(6) default CURRENT_TIMESTAMP;




ALTER TABLE public.denr_updates
ADD COLUMN last_modified_by       varchar(50),
ADD COLUMN last_modified_date     timestamp(6) default CURRENT_TIMESTAMP;



ALTER TABLE public.weekly_updates
ADD COLUMN last_modified_by       varchar(50),
ADD COLUMN last_modified_date     timestamp(6) default CURRENT_TIMESTAMP;

ALTER TABLE public.uploaded_files
ADD COLUMN last_modified_by       varchar(50),
ADD COLUMN last_modified_date     timestamp(6) default CURRENT_TIMESTAMP;
