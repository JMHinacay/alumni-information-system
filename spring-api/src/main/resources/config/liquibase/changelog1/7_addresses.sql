CREATE TABLE public.country (
    id          uuid not null primary key,
    name        varchar
);

CREATE TABLE public.region (
    id          uuid not null primary key,
    name        varchar
);

CREATE TABLE public.province (
    id          uuid not null primary key,
    name        varchar,
    region      uuid null,
    foreign key (region) references public.region(id)
);

CREATE TABLE public.city (
    id          uuid not null primary key,
    name        varchar,
    region      uuid null,
    province    uuid null,
    foreign key (region) references public.region(id),
    foreign key (province) references public.province(id)
);

CREATE TABLE public.barangay (
    id          uuid not null primary key,
    name        varchar,
    region      uuid null,
    province    uuid null,
    city        uuid null,
    foreign key (region) references public.region(id),
    foreign key (province) references public.province(id),
    foreign key (city) references public.city(id)
);