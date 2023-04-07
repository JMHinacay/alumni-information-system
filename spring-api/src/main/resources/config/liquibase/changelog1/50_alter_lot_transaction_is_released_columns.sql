

ALTER TABLE lot.lot_transaction
    ADD COLUMN is_released_sketch_plan  bool null,
    ADD COLUMN is_released_approved_plan  bool null;

ALTER TABLE public.service_step
    ADD COLUMN is_end_of_steps  bool null;

ALTER TABLE public.service
    ADD COLUMN last_step  varchar null;