DROP TABLE IF EXISTS public.jurisdiction;
CREATE TABLE public.jurisdiction (
id                      uuid primary key,
description             varchar null,
office                  uuid null,
foreign key (office) references public.office(id)
);


DROP TABLE IF EXISTS public.jurisd_province;
CREATE TABLE public.jurisd_province (
id                      uuid primary key,
jurisdiction            uuid null,
barangay            uuid null,
city            uuid null,
province            uuid null,
foreign key (jurisdiction) references public.jurisdiction(id),
foreign key (barangay) references public.barangay(id),
foreign key (city) references public.city(id),
foreign key (province) references public.province(id)
);







