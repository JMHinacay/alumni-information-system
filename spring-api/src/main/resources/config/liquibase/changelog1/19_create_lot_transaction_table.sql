DROP TABLE IF EXISTS lot.lot_transaction;
CREATE TABLE lot.lot_transaction (
id                      uuid primary key,
created_by             varchar(50),
created_date           timestamp(6) default CURRENT_TIMESTAMP,
service                uuid null,
lot_info               uuid null,
office                 uuid null,
status                 varchar (30),
foreign key (service) references public.service(id),
foreign key (lot_info) references lot.lot_info(id),
foreign key (office) references public.office(id)
);








