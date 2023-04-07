
ALTER TABLE public.user_activity
ADD COLUMN denr_update_status varchar null,
ADD COLUMN denr_tracking_no varchar null
;




ALTER TABLE public.service
ADD COLUMN excess_hectare_cost numeric,
ADD COLUMN excess_corner_cost numeric
;








