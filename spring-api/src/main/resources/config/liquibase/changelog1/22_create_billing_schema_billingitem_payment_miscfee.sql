CREATE SCHEMA IF NOT EXISTS billing;
DROP TABLE IF EXISTS billing.billing;
CREATE TABLE billing.billing (
id                      uuid primary key,
billing_no               varchar(15),
billing_status          varchar,
lot_transaction         uuid null,
balance                 numeric,

created_by             varchar(50),
created_date           timestamp(6) default CURRENT_TIMESTAMP,
last_modified_by       varchar(50),
last_modified_date     timestamp(6) default CURRENT_TIMESTAMP,
foreign key (lot_transaction) references lot.lot_transaction(id)
);

DROP TABLE IF EXISTS billing.misc_fee;
CREATE TABLE billing.misc_fee (
id                      uuid primary key,
misc_fee_cost            numeric,
misc_fee_desc            varchar,
status                   bool,

created_by             varchar(50),
created_date           timestamp(6) default CURRENT_TIMESTAMP,
last_modified_by       varchar(50),
last_modified_date     timestamp(6) default CURRENT_TIMESTAMP,
deleted                bool default false
);


DROP TABLE IF EXISTS billing.payment;
CREATE TABLE billing.payment (
id                      uuid primary key,
billing             uuid null,
amount                 numeric,
payment_method          varchar,
created_by             varchar(50),
created_date           timestamp(6) default CURRENT_TIMESTAMP,
foreign key (billing) references billing.billing(id)
);

DROP TABLE IF EXISTS billing.billing_item;
CREATE TABLE billing.billing_item (
id                      uuid primary key,
billing                 uuid null,
service                 uuid null,
item_cost               numeric,
item_no                 varchar,
item_desc               varchar,
item_type               varchar,
item_qty                int,
misc_fee                uuid null,
deleted                 bool default false,

foreign key (billing) references billing.billing(id),
foreign key (service) references public.service(id),
foreign key (misc_fee) references billing.misc_fee(id)
);



