ALTER TABLE lot.lot_area_info DROP COLUMN lot_area_size,
DROP COLUMN lot_province;


ALTER TABLE lot.map_coordinates
DROP COLUMN map_desc;


ALTER TABLE lot.lot_area_info
ADD COLUMN lot_area_size numeric ;
