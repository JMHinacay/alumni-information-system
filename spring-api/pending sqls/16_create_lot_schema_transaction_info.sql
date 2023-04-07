CREATE SCHEMA IF NOT EXISTS lot;

DROP TABLE IF EXISTS lot.lot_info;
CREATE TABLE lot.lot_info (
id                     uuid primary key,
lot_type               varchar null,
lot_province           uuid null,
lot_municipality       uuid null,
lot_barangay           uuid null,
owner_firstname        varchar null,
owner_middlename       varchar null,
owner_lastname         varchar null,

created_by             varchar(50),
created_date           timestamp(6) default CURRENT_TIMESTAMP,
last_modified_by       varchar(50),
last_modified_date     timestamp(6) default CURRENT_TIMESTAMP,
deleted                bool default false
);



DROP TABLE IF EXISTS lot.lot_area_info;
CREATE TABLE lot.lot_area_info (
id                      uuid primary key,
foreign key (lot_info) references lot.lot_info(id),
lot_no                 varchar null,
lot_province           varchar null,
lot_area_size          varchar null,

created_by             varchar(50),
created_date           timestamp(6) default CURRENT_TIMESTAMP,
last_modified_by       varchar(50),
last_modified_date     timestamp(6) default CURRENT_TIMESTAMP,
deleted                bool default false
);
