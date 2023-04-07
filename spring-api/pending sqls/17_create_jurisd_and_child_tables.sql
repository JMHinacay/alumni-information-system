DROP TABLE IF EXISTS public.jurisd_province;
CREATE TABLE public.jurisd_province (
id                      uuid primary key,
province_name      varchar null
);


DROP TABLE IF EXISTS public.jurisd_municipality;
CREATE TABLE public.jurisd_municipality (
id                      uuid primary key,
municipality_name       varchar null,
jurisd_province         uuid null,
foreign key (jurisd_province) references public.jurisd_province(id)
);


DROP TABLE IF EXISTS public.jurisd_barangay;
CREATE TABLE public.jurisd_barangay (
id                      uuid primary key,
barangay_name           varchar null,
jurisd_municipality         uuid null,
foreign key (jurisd_municipality) references public.jurisd_municipality(id)
);



DROP TABLE IF EXISTS public.jurisdiction;
CREATE TABLE public.jurisdiction (
id                      uuid primary key,
description             varchar null,
jurisd_barangay         uuid null,
office                  uuid null,
foreign key (jurisd_barangay) references public.jurisd_barangay(id),
foreign key (office) references public.office(id)
);




