DROP TABLE IF EXISTS public.service_step;
CREATE TABLE public.service_step (
id                            uuid primary key,
step                varchar null,
service                  uuid null,
step_no int,
foreign key (service) references public.service(id)

);

