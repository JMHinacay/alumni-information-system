ALTER TABLE lot.map
ADD COLUMN path json  NULL

;

ALTER TABLE billing.billing_item
ADD COLUMN total_cost numeric  NULL

;