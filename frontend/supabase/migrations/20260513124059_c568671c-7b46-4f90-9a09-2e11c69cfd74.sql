CREATE TYPE animal_gender AS ENUM ('male','female','unknown');
ALTER TABLE public.animals ADD COLUMN gender animal_gender NOT NULL DEFAULT 'unknown';
ALTER TABLE public.animals ADD COLUMN owner_name text;