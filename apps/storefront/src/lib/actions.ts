"use server";

import { createClient } from '@supabase/supabase-js';
import { createNotification } from '@ecommerce-platform/shared';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

async function createSupabaseClient() {
  return createClient(supabaseUrl, supabaseServiceRoleKey);
}

export async function createInquiryServer(inquiry: {
  name: string;
  email: string;
  subject?: string;
  message: string;
}) {
  const supabase = await createSupabaseClient();

  const payload = {
    name: inquiry.name,
    email: inquiry.email,
    subject: inquiry.subject ?? '',
    message: inquiry.message,
  };

  const { data, error } = await supabase
    .from('inquiries')
    .insert([payload])
    .select();

  if (error) {
    console.error('Error creating inquiry:', error);
    throw new Error('Failed to submit inquiry');
  }

  // Create notification
  try {
    await createNotification({
      title: 'New Inquiry Submitted',
      message: `Inquiry from ${inquiry.name}: ${inquiry.subject || 'No subject'}`,
      type: 'inquiry',
    });
  } catch (notificationError) {
    console.error('Error creating notification:', notificationError);
    // Don't throw, as inquiry creation succeeded
  }

  return data;
}

export async function createOrderServer(order: {
  userId: string;
  status: string;
  deliveryAddress: {
    district: string;
    village: string;
    cell: string;
    phone: string;
    notes?: string;
  };
  items: {
    product_id: string;
    product_name: string;
    quantity: number;
    price: number;
  }[];
}) {
  console.log('🚀 Starting order creation process');
  console.log('Order data:', {
    userId: order.userId,
    userIdType: typeof order.userId,
    userIdLength: order.userId?.length,
    status: order.status,
    deliveryAddress: order.deliveryAddress,
    itemsCount: order.items.length
  });

  const supabase = await createSupabaseClient();
  console.log('✅ Supabase client created');

  // Verify user exists in profiles table
  console.log('🔍 Verifying user exists in profiles...');
  console.log('Looking for user ID:', order.userId);

  try {
    const { data: profileUser, error: profileError } = await supabase
      .from('profiles')
      .select('id, email')
      .eq('id', order.userId)
      .single();

    if (profileError) {
      console.error('❌ Profile user lookup failed:', profileError);
      console.error('Profile error details:', {
        code: profileError.code,
        message: profileError.message,
        details: profileError.details
      });

      // Try to see what users exist in profiles
      const { data: allProfiles, error: listError } = await supabase
        .from('profiles')
        .select('id, email')
        .limit(5);

      if (!listError && allProfiles) {
        console.log('📋 Existing profiles:', allProfiles);
      }

      throw new Error(`User verification failed: ${profileError.message}`);
    }
    if (!profileUser) {
      console.error('❌ User not found in profiles table');
      throw new Error('User not found in profiles table');
    }
    console.log('✅ User verified in profiles:', profileUser.email);
  } catch (verifyError) {
    console.error('❌ User verification error:', verifyError);
    throw verifyError;
  }
  console.log('✅ Supabase client created');

  // Calculate total price on server from product data
  let totalPrice = 0;
  console.log('🛒 Calculating total price from products...');

  for (const item of order.items) {
    console.log(`Fetching price for product ${item.product_id} (${item.product_name})`);

    // Fetch current product price to ensure accuracy
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('price')
      .eq('id', item.product_id)
      .single();

    if (productError) {
      console.error('❌ Error fetching product price:', productError);
      throw new Error(`Failed to verify product ${item.product_name}: ${productError.message}`);
    }

    if (!product) {
      console.error('❌ Product not found:', item.product_id);
      throw new Error(`Product ${item.product_name} not found`);
    }

    const itemTotal = product.price * item.quantity;
    totalPrice += itemTotal;
    console.log(`✅ Product ${item.product_name}: $${product.price} × ${item.quantity} = $${itemTotal}`);
  }

  console.log(`💰 Total calculated: $${totalPrice}`);

  // Start transaction-like behavior: insert order first
  console.log('📝 Inserting order...');
  const orderPayload = {
    user_id: order.userId,
    status: order.status,
    total_price: totalPrice,
    delivery_address: order.deliveryAddress,
    // created_at column will be auto-populated with default now()
  };
  console.log('Order payload:', orderPayload);

  const { data: orderData, error: orderError } = await supabase
    .from('orders')
    .insert([orderPayload])
    .select('id')
    .single();

  if (orderError) {
    console.error('❌ Error creating order:', orderError);
    console.error('Order error details:', {
      code: orderError.code,
      message: orderError.message,
      details: orderError.details,
      hint: orderError.hint
    });
    throw new Error(`Failed to create order: ${orderError.message}`);
  }

  const orderId = orderData.id;
  console.log(`✅ Order created with ID: ${orderId}`);

  // Insert order items
  console.log('📦 Inserting order items...');
  const itemsToInsert = order.items.map(item => ({
    order_id: orderId,
    product_id: item.product_id,
    quantity: item.quantity,
    price: item.price, // Use the price passed (should match product price)
  }));

  console.log('Order items to insert:', itemsToInsert);

  // Check if order_items table exists
  console.log('🔍 Checking order_items table...');
  const { data: tableCheck, error: tableError } = await supabase
    .from('order_items')
    .select('id')
    .limit(1);

  if (tableError) {
    console.error('❌ order_items table check failed:', tableError);
  } else {
    console.log('✅ order_items table exists');
  }

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(itemsToInsert);

  if (itemsError) {
    console.error('❌ Error creating order items:', itemsError);
    console.error('Order items error details:', {
      code: itemsError.code,
      message: itemsError.message,
      details: itemsError.details,
      hint: itemsError.hint
    });

    // Attempt to delete the order to prevent orphaned data
    console.log('🧹 Attempting to clean up orphaned order...');
    await supabase.from('orders').delete().eq('id', orderId);
    throw new Error(`Failed to create order items: ${itemsError.message}`);
  }

  console.log('✅ Order items created successfully');

  // Create notification
  try {
    console.log('📢 Creating notification...');
    await createNotification({
      title: 'New Order Placed',
      message: `Order #${orderId} for $${totalPrice.toFixed(2)}`,
      type: 'order',
    });
    console.log('✅ Notification created');
  } catch (notificationError) {
    console.error('⚠️ Error creating notification:', notificationError);
    // Don't throw, as order creation succeeded
  }

  console.log(`🎉 Order creation completed successfully! Order ID: ${orderId}`);
  return orderId;
}

export async function createReservationServer(reservation: {
  userId: string;
  serviceName: string;
  fullName: string;
  email: string;
  phone: string;
  preferredDate: string;
  preferredTime: string;
  serviceAddress: string;
  notes?: string | null;
}) {
  console.log('🚀 Starting reservation creation process');
  console.log('Reservation data:', {
    userId: reservation.userId,
    serviceName: reservation.serviceName,
    fullName: reservation.fullName,
    email: reservation.email,
    phone: reservation.phone,
    preferredDate: reservation.preferredDate,
    preferredTime: reservation.preferredTime,
    serviceAddress: reservation.serviceAddress,
  });

  const supabase = await createSupabaseClient();
  console.log('✅ Supabase client created');

  // Verify user exists in profiles table
  console.log('🔍 Verifying user exists in profiles...');
  console.log('Looking for user ID:', reservation.userId);

  try {
    const { data: profileUser, error: profileError } = await supabase
      .from('profiles')
      .select('id, email')
      .eq('id', reservation.userId)
      .single();

    if (profileError) {
      console.error('❌ Profile user lookup failed:', profileError);
      console.error('Profile error details:', {
        code: profileError.code,
        message: profileError.message,
        details: profileError.details
      });

      // Try to see what users exist in profiles
      const { data: allProfiles, error: listError } = await supabase
        .from('profiles')
        .select('id, email')
        .limit(5);

      if (!listError && allProfiles) {
        console.log('📋 Existing profiles:', allProfiles);
      }

      throw new Error(`User verification failed: ${profileError.message}`);
    }
    if (!profileUser) {
      console.error('❌ User not found in profiles table');
      throw new Error('User not found in profiles table');
    }
    console.log('✅ User verified in profiles:', profileUser.email);
  } catch (verifyError) {
    console.error('❌ User verification error:', verifyError);
    throw verifyError;
  }

  // Insert reservation
  console.log('📝 Inserting reservation...');
  const reservationPayload = {
    user_id: reservation.userId,
    service_name: reservation.serviceName,
    full_name: reservation.fullName,
    email: reservation.email,
    phone: reservation.phone,
    preferred_date: reservation.preferredDate,
    preferred_time: reservation.preferredTime,
    service_address: reservation.serviceAddress,
    notes: reservation.notes || null,
  };
  console.log('Reservation payload:', reservationPayload);

  const { data: reservationData, error: reservationError } = await supabase
    .from('reservations')
    .insert([reservationPayload])
    .select('id')
    .single();

  if (reservationError) {
    console.error('❌ Error creating reservation:', reservationError);
    console.error('Reservation error details:', {
      code: reservationError.code,
      message: reservationError.message,
      details: reservationError.details,
      hint: reservationError.hint
    });
    throw new Error(`Failed to create reservation: ${reservationError.message}`);
  }

  const reservationId = reservationData.id;
  console.log(`✅ Reservation created with ID: ${reservationId}`);

  // Create notification
  try {
    console.log('📢 Creating notification...');
    await createNotification({
      title: 'New Service Booking',
      message: `Booking #${reservationId} for ${reservation.serviceName} by ${reservation.fullName}`,
      type: 'reservation',
    });
    console.log('✅ Notification created');
  } catch (notificationError) {
    console.error('⚠️ Error creating notification:', notificationError);
    // Don't throw, as reservation creation succeeded
  }

  console.log(`🎉 Reservation creation completed successfully! Reservation ID: ${reservationId}`);
  return reservationId;
}