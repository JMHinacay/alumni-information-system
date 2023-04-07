ALTER TABLE public.uploaded_files
ADD COLUMN doc_type varchar null ,
ADD COLUMN is_deleted bool null
;