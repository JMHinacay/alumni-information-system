ALTER TABLE public.position
ADD COLUMN default_roles json  NULL;

ALTER TABLE lot.lot_transaction
ADD COLUMN transaction_id varchar null;

--DELETE FROM public.t_authority WHERE name = 'ROLE_GEODETIC';
---- DELETE FROM public.t_authority WHERE name = 'ROLE_STAFF';
--DELETE FROM public.t_authority WHERE name = 'ROLE_SURVEY_CREW';

--insert into public.t_authority VALUES('ROLE_MANAGE_LOTS_UNDER_JURISDICTION');
--insert into public.t_authority VALUES('ROLE_MANAGE_LOT_MASTER_LIST');
--insert into public.t_authority VALUES('ROLE_ADD_NEW_TRANSACTION');
--
--
--
--
--insert into public.t_authority VALUES('ROLE_MANAGE_EMPLOYEES');
--insert into public.t_authority VALUES('ROLE_MANAGE_OFFICES');
--insert into public.t_authority VALUES('ROLE_MANAGE_POSITIONS');
--
--insert into public.t_authority VALUES('ROLE_MANAGE_SERVICES');
--insert into public.t_authority VALUES('ROLE_MANAGE_AGENTS');
--insert into public.t_authority VALUES('ROLE_MANAGE_SURVEY_TEAM');
--insert into public.t_authority VALUES('ROLE_MANAGE_ADDRESSES');
--insert into public.t_authority VALUES('ROLE_MANAGE_BILLING');
--insert into public.t_authority VALUES('ROLE_MANAGE_USER_ACTIVITIES');












