

ALTER TABLE public.user_activity
DROP column  position,
DROP column date_assigned,
Add column created_by             varchar(50),
Add column created_date           timestamp(6) default CURRENT_TIMESTAMP;




ALTER TABLE public.denr_updates
DROP column  date,
DROP column last_entry_date,
Add column created_by             varchar(50),
Add column created_date           timestamp(6) default CURRENT_TIMESTAMP;



ALTER TABLE public.weekly_updates
DROP column  wk_update_date,
Add column created_by             varchar(50),
Add column created_date           timestamp(6) default CURRENT_TIMESTAMP;

ALTER TABLE public.weekly_updates
rename COLUMN wk_update_remarks TO remarks;

ALTER TABLE public.uploaded_files
DROP column  file_date,
Add column created_by             varchar(50),
Add column created_date           timestamp(6) default CURRENT_TIMESTAMP;


