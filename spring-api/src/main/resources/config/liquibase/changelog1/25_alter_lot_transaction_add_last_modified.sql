ALTER TABLE lot.lot_transaction

ADD COLUMN last_modified_by       varchar(50),
ADD COLUMN last_modified_date     timestamp(6) default CURRENT_TIMESTAMP;

