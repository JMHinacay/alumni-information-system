
DROP TABLE IF EXISTS public.survey_team;
CREATE TABLE public.survey_team (
id                      uuid primary key,
created_by             varchar(50),
created_date           timestamp(6) default CURRENT_TIMESTAMP,
last_modified_by       varchar(50),
last_modified_date     timestamp(6) default CURRENT_TIMESTAMP,
survey_sched                uuid null,
survey_team_member               uuid null,
foreign key (survey_team_member) references public.survey_team_member(id),
foreign key (survey_sched) references public.survey_sched(id)
);



ALTER TABLE public.survey_team_member
add column isActive bool default true
;



