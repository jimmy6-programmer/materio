-- Enable RLS on articles table if not already
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- Create policy for admins to insert articles
CREATE POLICY "Admins can insert articles"
ON public.articles
FOR INSERT
WITH CHECK (public.is_admin());

-- Allow admins to select, update, delete articles
CREATE POLICY "Admins can select articles"
ON public.articles
FOR SELECT
USING (public.is_admin());

CREATE POLICY "Admins can update articles"
ON public.articles
FOR UPDATE
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete articles"
ON public.articles
FOR DELETE
USING (public.is_admin());