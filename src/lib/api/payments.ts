import type { PublicBooking } from './consultations';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000/api';

export interface CreatePaymentIntentPayload {
  consultationId: string;
  fullName: string;
  contactNumber: string;
  email: string;
  userType?: string;
  seats?: number;
  sessionDate?: string | null;
  notes?: string;
}

export interface PaymentIntentResult {
  paymentIntentId: string;
  clientSecret: string;
  amount: number;
  currency: string;
  bookingReference: string;
}

interface ApiErrorBody {
  error?: { message?: string; details?: Record<string, string[]> };
}

/** Fire-and-forget helper reading errors from the contract `{ error: { message, details } }` envelope. */
function extractError(json: unknown, fallback: string): Error {
  const body = (json ?? {}) as ApiErrorBody;
  const message = body.error?.message ?? fallback;
  const details = body.error?.details ?? {};
  const err = new Error(message) as Error & { details: Record<string, string[]> };
  err.details = details;
  return err;
}

export async function createPaymentIntent(
  payload: CreatePaymentIntentPayload,
): Promise<PaymentIntentResult> {
  const res = await fetch(`${API_URL}/payments/create-intent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!res.ok) throw extractError(json, 'Could not initialize payment. Please try again.');
  return json as PaymentIntentResult;
}

export async function confirmBookingPayment(
  paymentIntentId: string,
): Promise<PublicBooking> {
  const res = await fetch(`${API_URL}/consultations/book`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ paymentIntentId }),
  });
  const json = await res.json();
  if (!res.ok) throw extractError(json, 'Could not confirm your booking. Please try again.');
  return json as PublicBooking;
}
