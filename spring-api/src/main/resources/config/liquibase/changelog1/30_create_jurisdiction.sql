-- noinspection SqlNoDataSourceInspectionForFile
DROP TABLE IF EXISTS public.jurisd_province;

DROP TABLE IF EXISTS public.jurisdiction;


CREATE TABLE public.jurisdiction (
id                      uuid primary key,
barangay                uuid null,
city                    uuid null,
province                uuid null,
office                  uuid null,
foreign key (barangay) references public.barangay(id),
foreign key (city) references public.city(id),
foreign key (province) references public.province(id),
foreign key (office) references public.office(id)

);









