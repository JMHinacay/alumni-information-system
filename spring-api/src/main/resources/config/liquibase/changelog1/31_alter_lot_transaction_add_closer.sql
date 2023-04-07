

ALTER TABLE lot.lot_transaction

    DROP COLUMN agent,
    ADD COLUMN closedBy  varchar null,
    ADD COLUMN closedType  varchar null;
