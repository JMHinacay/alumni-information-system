-- public.t_permission definition

-- Drop table

-- DROP TABLE public.t_permission;

CREATE TABLE public.t_permission (
	"name" varchar(50) NOT NULL,
	description varchar NULL,
	CONSTRAINT t_permission_pkey PRIMARY KEY (name)
);


-- public.t_user_permission definition

-- Drop table

-- DROP TABLE public.t_user_permission;

CREATE TABLE public.t_user_permission (
	user_id int8 NOT NULL,
	permission_name varchar(50) NOT NULL,
	CONSTRAINT t_user_permission_pkey PRIMARY KEY (user_id, permission_name)
);


-- public.t_user_permission foreign keys

ALTER TABLE public.t_user_permission ADD CONSTRAINT fk_permission_name FOREIGN KEY (permission_name) REFERENCES t_permission(name);
ALTER TABLE public.t_user_permission ADD CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES t_user(id);