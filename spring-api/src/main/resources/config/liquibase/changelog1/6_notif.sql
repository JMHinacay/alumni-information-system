CREATE TABLE public.notifications (
	id uuid NOT NULL,
	"from" uuid NULL,
	"to" uuid NULL,
	department uuid NULL,
	message varchar NULL,
	title varchar NULL,
	date_notified timestamp NULL,
	date_seen timestamp NULL,
	url varchar NULL,
	CONSTRAINT notifications_pkey PRIMARY KEY (id)
);
CREATE INDEX notifications_to_idx ON public.notifications USING btree ("to");