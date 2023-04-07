ALTER TABLE lot.lot_transaction
ADD COLUMN uploaded_file_flags json  NULL

;

ALTER TABLE public.uploaded_files
ALTER COLUMN file_name TYPE varchar,
ALTER COLUMN file_path TYPE varchar,
ADD COLUMN file_extension  varchar
;