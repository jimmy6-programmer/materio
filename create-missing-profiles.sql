-- Create profiles for existing auth users who don't have them
-- This ensures all users have profile records for proper display in admin dashboard

INSERT INTO public.profiles (id, email, is_admin)
SELECT
  au.id,
  au.email,
  false as is_admin
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE p.id IS NULL
  AND au.email IS NOT NULL;

-- Verify the profiles were created
SELECT
  p.id,
  p.email,
  p.is_admin,
  p.created_at
FROM public.profiles p
ORDER BY p.created_at DESC
LIMIT 10;