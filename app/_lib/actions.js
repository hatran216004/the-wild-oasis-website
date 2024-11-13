'use server';

import { revalidatePath } from 'next/cache';
import { auth, signIn, signOut } from './auth';
import { supabase } from './supabase';
import { getBookings } from './data-service';
import { redirect } from 'next/navigation';

export async function signInAction() {
  await signIn('google', { redirectTo: '/account' });
}

export async function signOutAction() {
  await signOut({ redirectTo: '/' });
}

export async function deleteBooking(bookingId) {
  const session = await auth();
  if (!session) throw new Error('You must be logged in');

  const guestBookings = await getBookings(session.user.guestId);
  const guestBookingsIds = guestBookings.map((booking) => booking.id);

  // Chỉ cho xóa reservations của chính mình
  if (!guestBookingsIds.includes(bookingId))
    throw new Error('You are not allowed to delete this booking');

  const { error } = await supabase
    .from('bookings')
    .delete()
    .eq('id', bookingId);

  if (error) {
    throw new Error('Booking could not be deleted');
  }
  revalidatePath('/account/reservations');
}

export async function updateGuest(formData) {
  const session = await auth();
  if (!session) throw new Error('You must be logged in');

  const [nationality, countryFlag] = formData.get('nationality').split('%');
  const nationalID = formData.get('nationalID');

  if (!/^[a-zA-Z0-9]{6,12}$/.test(nationalID))
    throw new Error('Please provide a valid national ID');

  const updateData = { nationality, countryFlag, nationalID };
  const { error } = await supabase
    .from('guests')
    .update(updateData)
    .eq('id', session.user.guestId);

  if (error) {
    throw new Error('Guest could not be updated');
  }
  revalidatePath('/account/profile');
}

export async function createBooking(bookingData, formData) {
  const session = await auth();
  if (!session) throw new Error('You must be logged in');

  const newBooking = {
    ...bookingData,
    extrasPrice: 0,
    totalPrice: bookingData.cabinPrice,
    guestId: session.user.guestId,
    status: 'unconfirmed',
    hasBreakfast: false,
    numGuests: Number(formData.get('numGuests')),
    observations: formData.get('observations').slice(0, 1000),
    isPaid: false
  };

  const { error } = await supabase.from('bookings').insert([newBooking]);
  // So that the newly created object gets returned!

  if (error) {
    throw new Error('Booking could not be created');
  }

  revalidatePath(`/cabins/${bookingData.cabinId}`);
  redirect('/cabins/thankyou');
}

export async function updateBooking(formData) {
  // 1) Authentication
  const session = await auth();
  if (!session) throw new Error('You must be logged in');

  // 2) Authorization
  const guestBookings = await getBookings(session.user.guestId);
  const bookingIds = guestBookings.map((booking) => booking.id);
  const bookingId = Number(formData.get('bookingId'));
  // Chỉ cho update booking của chính mình
  if (!bookingIds.includes(bookingId))
    throw new Error('You are not allowed to update this booking');

  // 3) Building update data
  const numGuests = Number(formData.get('numGuests'));
  const observations = formData.get('observations').slice(0, 1000);
  const dataUpdate = { numGuests, observations };

  // 4) Muatation
  const { error } = await supabase
    .from('bookings')
    .update(dataUpdate)
    .eq('id', bookingId);

  if (error) {
    throw new Error('Booking could not be updated');
  }

  revalidatePath(`/account/reservations/edit/${bookingId}`);
  redirect('/account/reservations');
}
