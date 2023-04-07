ALTER TABLE billing.payment

ADD COLUMN last_modified_by       varchar(50),
ADD COLUMN last_modified_date     timestamp(6) default CURRENT_TIMESTAMP;

