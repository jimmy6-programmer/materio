"use server";

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Category } from './queries/categories'
import type { Product } from './queries/products'
import type { Inquiry } from './queries/inquiries'
export type { Category } from './queries/categories'
export type { Product } from './queries/products'
export type { Inquiry } from './queries/inquiries'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

async function createSupabaseServerClient() {
  const cookieStore = await cookies()

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: any) {
        // Server actions can't set cookies, but for auth it should work
      },
      remove(name: string, options: any) {
        // Server actions can't remove cookies
      },
    },
  })
}

export async function getCategories(): Promise<Category[]> {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from('categories')
    .select('*')

  if (error) {
    console.error('Error fetching categories:', error)
    throw new Error('Failed to fetch categories')
  }

  return data as Category[]
}

export async function createCategory(category: Omit<Category, 'id'>): Promise<void> {
  const supabase = await createSupabaseServerClient()

  const { error } = await supabase
    .from('categories')
    .insert([category])

  if (error) {
    console.error('Error creating category:', error)
    throw new Error('Failed to create category')
  }

  // Create notification
  try {
    const { createNotification } = await import('@ecommerce-platform/shared');
    await createNotification({
      title: 'New Category Created',
      message: `Category "${category.name}" has been created.`,
      type: 'category',
    });
  } catch (notificationError) {
    console.error('Error creating notification:', notificationError);
    // Don't throw, as category creation succeeded
  }
}

export async function updateCategory(id: string, category: Partial<Omit<Category, 'id'>>): Promise<void> {
  const supabase = await createSupabaseServerClient()

  const { error } = await supabase
    .from('categories')
    .update(category)
    .eq('id', id)

  if (error) {
    console.error('Error updating category:', error)
    throw new Error('Failed to update category')
  }
}

export async function deleteCategory(id: string): Promise<void> {
  const supabase = await createSupabaseServerClient()

  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting category:', error)
    throw new Error('Failed to delete category')
  }
}

export async function getProducts(): Promise<Product[]> {
  const supabase = await createSupabaseServerClient()

  // Fetch products
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('*')

  if (productsError) {
    console.error('Error fetching products:', productsError)
    throw new Error('Failed to fetch products')
  }

  // Fetch categories
  const { data: categories, error: categoriesError } = await supabase
    .from('categories')
    .select('id, name')

  if (categoriesError) {
    console.error('Error fetching categories:', categoriesError)
    throw new Error('Failed to fetch categories')
  }

  // Create category map
  const categoryMap = new Map(categories?.map(cat => [cat.id, cat.name]) || [])

  // Transform the data to include category name
  const transformedData = products?.map(product => ({
    ...product,
    category: categoryMap.get(product.category_id) || 'N/A'
  })) as Product[]

  return transformedData
}

export async function createProduct(product: Omit<Product, 'id'>): Promise<void> {
  const supabase = await createSupabaseServerClient()

  const { error } = await supabase
    .from('products')
    .insert([product])

  if (error) {
    console.error('Error creating product:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    })
    throw new Error(`Failed to create product: ${error.message}`)
  }

  // Create notification
  try {
    const { createNotification } = await import('@ecommerce-platform/shared');
    await createNotification({
      title: 'New Product Created',
      message: `Product "${product.name}" has been created.`,
      type: 'product',
    });
  } catch (notificationError) {
    console.error('Error creating notification:', notificationError);
    // Don't throw, as product creation succeeded
  }
}

export async function updateProduct(id: string, product: Partial<Omit<Product, 'id'>>): Promise<void> {
  const supabase = await createSupabaseServerClient()

  const { error } = await supabase
    .from('products')
    .update(product)
    .eq('id', id)

  if (error) {
    console.error('Error updating product:', error)
    throw new Error('Failed to update product')
  }

  // Create notification
  try {
    const { createNotification } = await import('@ecommerce-platform/shared');
    await createNotification({
      title: 'Product Updated',
      message: `Product with ID ${id} has been updated.`,
      type: 'product',
    });
  } catch (notificationError) {
    console.error('Error creating notification:', notificationError);
    // Don't throw, as product update succeeded
  }
}

export async function deleteProduct(id: string): Promise<void> {
  const supabase = await createSupabaseServerClient()

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting product:', error)
    throw new Error('Failed to delete product')
  }
}

export async function getInquiries(): Promise<Inquiry[]> {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from('inquiries')
    .select('*')


  if (error) {
    console.error('Error fetching inquiries:', error)
    throw new Error('Failed to fetch inquiries')
  }

  return data as Inquiry[]
}

export async function getOrders(): Promise<any[]> {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from('orders')
    .select('*')

  if (error) {
    console.error('Error fetching orders:', error)
    throw new Error('Failed to fetch orders')
  }

  return data
}

export async function getUsers(): Promise<any[]> {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from('users')
    .select('*')

  if (error) {
    console.error('Error fetching users:', error)
    throw new Error('Failed to fetch users')
  }

  return data
}

export async function getCurrentUser() {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase.auth.getUser()


  if (error) {
    console.error('Error getting user:', error)
    throw new Error('Failed to get user')
  }

  return data
}

// Home Services CRUD
export async function getHomeServices(): Promise<any[]> {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from('home_services')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching home services:', error)
    throw new Error('Failed to fetch home services')
  }

  return data
}

export async function createHomeService(service: Omit<any, 'id' | 'created_at'>): Promise<void> {
  const supabase = await createSupabaseServerClient()

  const { error } = await supabase
    .from('home_services')
    .insert([service])

  if (error) {
    console.error('Error creating home service:', error)
    throw new Error('Failed to create home service')
  }
}

export async function updateHomeService(id: string, service: Partial<any>): Promise<void> {
  const supabase = await createSupabaseServerClient()

  const { error } = await supabase
    .from('home_services')
    .update(service)
    .eq('id', id)

  if (error) {
    console.error('Error updating home service:', error)
    throw new Error('Failed to update home service')
  }
}

export async function deleteHomeService(id: string): Promise<void> {
  const supabase = await createSupabaseServerClient()

  const { error } = await supabase
    .from('home_services')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting home service:', error)
    throw new Error('Failed to delete home service')
  }
}