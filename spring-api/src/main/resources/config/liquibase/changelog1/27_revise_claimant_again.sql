DROP TABLE IF EXISTS lot.claimant;
CREATE TABLE lot.claimant (
id                      uuid primary key,
claimant_fullname       varchar(45),
claimant_address        varchar(45),
claimant_contact_no     varchar(10),
lot_transaction           uuid null,
foreign key (lot_transaction) references lot.lot_transaction(id)
);