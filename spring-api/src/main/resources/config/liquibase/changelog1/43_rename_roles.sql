
DELETE FROM public.t_authority WHERE name = 'ROLE_CREATE_SKETCH_PLAN';
DELETE FROM public.t_authority WHERE name = 'ROLE_CREATE_DENR_SKETCH_PLAN';
DELETE FROM public.t_authority WHERE name = 'ROLE_CREATE_BL_PLAN';

insert into public.t_authority VALUES('ROLE_TRANSMIT_SKETCH_PLAN');
insert into public.t_authority VALUES('ROLE_TRANSMIT_DENR_SKETCH_PLAN');
insert into public.t_authority VALUES('ROLE_TRANSMIT_BL_PLAN');








