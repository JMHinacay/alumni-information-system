DROP TABLE IF EXISTS lot.claimant;
CREATE TABLE lot.claimant (
id                      uuid primary key,
claimant_fullname       varchar(45),
claimant_address        varchar(45),
claimant_contact_no     varchar(10),
lot_area_info           uuid null,
foreign key (lot_area_info) references lot.lot_area_info(id)
);

DROP TABLE IF EXISTS lot.map;
CREATE TABLE lot.map (
id                      uuid primary key,
map_desc                varchar(45),
lot_info                uuid null,
lot_area_info           uuid null,
is_consolidated         bool null,
foreign key (lot_info) references lot.lot_info(id),
foreign key (lot_area_info) references lot.lot_area_info(id)
);

DROP TABLE IF EXISTS lot.map_coordinates;
CREATE TABLE lot.map_coordinates (
id                      uuid primary key,
map_desc                varchar(45),
lat                     varchar(45),
lng                     varchar(45),
map                     uuid null,
foreign key (map) references lot.map(id)

);






