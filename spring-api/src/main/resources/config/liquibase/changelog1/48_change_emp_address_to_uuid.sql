ALTER TABLE hrm.employees
ADD COLUMN full_address varchar  NULL


;

insert into public.t_authority VALUES('ROLE_MANAGE_LOT_TRANSACTION_INFORMATION');
insert into public.t_authority VALUES('ROLE_MANAGE_MISC_FEES');

