ALTER TABLE lot.lot_info
DROP COLUMN municipality,
ADD COLUMN city uuid null ;