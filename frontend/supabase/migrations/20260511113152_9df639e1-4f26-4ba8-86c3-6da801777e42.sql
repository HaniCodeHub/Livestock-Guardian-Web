ALTER TABLE public.animals
  ADD COLUMN IF NOT EXISTS front_image_url text,
  ADD COLUMN IF NOT EXISTS left_image_url text,
  ADD COLUMN IF NOT EXISTS right_image_url text;