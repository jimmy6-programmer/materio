-- Clean up duplicate cart items
-- This removes duplicate entries for the same user, product, and variant combination
-- keeping only the most recent entry

WITH duplicates AS (
  SELECT
    id,
    ROW_NUMBER() OVER (
      PARTITION BY user_id, product_id, COALESCE(selected_variant, '')
      ORDER BY created_at DESC
    ) as rn
  FROM public.carts
)
DELETE FROM public.carts
WHERE id IN (
  SELECT id FROM duplicates WHERE rn > 1
);