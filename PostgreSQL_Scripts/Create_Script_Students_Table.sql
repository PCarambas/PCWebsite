Drop Table IF EXISTS public.students;

CREATE SEQUENCE Students_id_seq;

CREATE TABLE IF NOT EXISTS public.students
(
    user_id integer NOT NULL DEFAULT nextval('Students_id_seq'), 
    first_name character varying(50) NOT NULL,
    last_name character varying(50) NOT NULL,
    email character varying(255),
    age integer,
    contact_details character varying(1000) ,
    CONSTRAINT students_pkey PRIMARY KEY (user_id)
)

TABLESPACE pg_default;

ALTER SEQUENCE Students_id_seq
OWNED BY Students.user_id;

ALTER TABLE IF EXISTS public.students
    OWNER to postgres;