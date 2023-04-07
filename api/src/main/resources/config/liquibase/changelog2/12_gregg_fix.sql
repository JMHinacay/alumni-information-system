ALTER TABLE "inventory"."stock_request_item" DROP CONSTRAINT IF EXISTS "fk_sri_stock_request";
ALTER TABLE "inventory"."stock_request_item" ADD CONSTRAINT "fk_sri_stock_request" FOREIGN KEY ("stock_request") REFERENCES "inventory"."stock_request" ("id") ON UPDATE CASCADE ON DELETE RESTRICT NOT DEFERRABLE INITIALLY IMMEDIATE;