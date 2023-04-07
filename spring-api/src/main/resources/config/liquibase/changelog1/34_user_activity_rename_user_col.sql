

ALTER TABLE public.user_activity

rename COLUMN "user " TO t_user;



ALTER TABLE lot.claimant
DROP column  claimant_contact_no,
Add COLUMN claimant_contact_no     varchar;

