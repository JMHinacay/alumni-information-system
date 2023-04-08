

Alter Table hrm.employees rename to person;



CREATE TABLE public.forum (
    id uuid NOT NULL,
    person uuid NOT NULL,
    approved_by uuid,
    status varchar,
    description varchar,
    
    created_by varchar(50),
    created_date timestamp DEFAULT CURRENT_TIMESTAMP,
    last_modified_by varchar(50),
    last_modified_date timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT person_fk FOREIGN KEY (person) REFERENCES hrm.person(id),
    CONSTRAINT approved_by_fk FOREIGN KEY (person) REFERENCES hrm.person(id)
);


CREATE TABLE public.job_hiring (
    id uuid NOT NULL,
    person uuid NOT NULL,
    
    position varchar,
    company varchar,
    address varchar,
    qualifications varchar,
    
    status varchar,
    created_by varchar(50),
    created_date timestamp DEFAULT CURRENT_TIMESTAMP,
    last_modified_by varchar(50),
    last_modified_date timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT person_fk FOREIGN KEY (person) REFERENCES hrm.person(id)
);


CREATE TABLE public.events (
    id uuid NOT NULL,
    person uuid NOT NULL,
    approved_by uuid,
    status varchar,
    
    start_date timestamp DEFAULT CURRENT_TIMESTAMP,
  	description varchar,

    created_by varchar(50),
    created_date timestamp DEFAULT CURRENT_TIMESTAMP,
    last_modified_by varchar(50),
    last_modified_date timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT person_fk FOREIGN KEY (person) REFERENCES hrm.person(id),
    CONSTRAINT approved_by_fk FOREIGN KEY (person) REFERENCES hrm.person(id)
);

CREATE TABLE public.comment (
    id uuid NOT NULL,
    person uuid NOT NULL,
	
	
    status varchar,
  	description varchar,

    created_by varchar(50),
    created_date timestamp DEFAULT CURRENT_TIMESTAMP,
    last_modified_by varchar(50),
    last_modified_date timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT person_fk FOREIGN KEY (person) REFERENCES hrm.person(id)
);


CREATE TABLE public.project (
    id uuid NOT NULL,
    person uuid,

  	description varchar,
  	
  	total_expenses numeric,

    created_by varchar(50),
    created_date timestamp DEFAULT CURRENT_TIMESTAMP,
    last_modified_by varchar(50),
    last_modified_date timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT person_fk FOREIGN KEY (person) REFERENCES hrm.person(id)
);



CREATE TABLE public.donation (
    id uuid NOT NULL,
    person uuid NOT NULL,
	
	
	amount numeric,
  	description varchar,
  	donor varchar,
    status varchar,
    
    created_by varchar(50),
    created_date timestamp DEFAULT CURRENT_TIMESTAMP,
    last_modified_by varchar(50),
    last_modified_date timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT person_fk FOREIGN KEY (person) REFERENCES hrm.person(id)
);
