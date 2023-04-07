ALTER TABLE billing.billing
ADD COLUMN is_locked bool default false,
ADD COLUMN locked_by VARCHAR NULL

;

ALTER TABLE billing.billing_item
ADD COLUMN debit numeric,
ADD COLUMN credit numeric,
ADD COLUMN status VARCHAR NULL
;

ALTER TABLE billing.payment
ADD COLUMN status VARCHAR NULL,
ADD COLUMN billing_item uuid null,
ADD CONSTRAINT billing_item_fkey FOREIGN KEY (billing_item) REFERENCES billing.billing_item(id);
;


DROP TABLE IF EXISTS billing.deduction;
CREATE TABLE billing.deduction (
id                      uuid primary key,
created_by             varchar(50),
created_date           timestamp(6) default CURRENT_TIMESTAMP,
last_modified_by       varchar(50),
last_modified_date     timestamp(6) default CURRENT_TIMESTAMP,

amount                  numeric,
remarks                 varchar null,
status                  VARCHAR NULL,
type                    VARCHAR NULL,
discount_rate           VARCHAR NULL,

deleted                bool default false,
billing_item                   uuid null,
billing                   uuid null,
FOREIGN KEY (billing) REFERENCES billing.billing(id),
foreign key (billing_item) references billing.billing_item(id)

);