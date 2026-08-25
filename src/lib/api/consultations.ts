export interface PublicConsultation {
  id: string;
  slug: string;
  sessionTitle: string;
  category: string;
  sessionType: string;
  emirates: string;
  maritalStage: string;
  language: string;
  date: string | null;
  startTime: string;
  endTime: string;
  duration: string;
  isFree: boolean;
  fee: string;
  seatsLeft: number | null;
  coverImage: string;
  status: string;
}

export interface PublicConsultationDetail extends PublicConsultation {
  sessionTitleAr: string;
  publishedDate: string | null;
  timeZone: string;
  meetingFormat: string;
  sessionLink: string;
  maxParticipants: number | null;
  processingFee: string;
  discount: string;
  counselor: string;
  counselorPhoto: string;
  counselorTitle: string;
  counselorBio: string;
  learnMore: unknown;
  gallery: string[];
  description: string;
  objectives: string[];
  whatYouWillLearn: string[];
  whoShouldAttend: string[];
  schedule: Record<string, string>;
  bookingNotice: string;
  showDoctor: boolean;
  showLearnMore: boolean;
  showGallery: boolean;
  showSchedule: boolean;
  showBooking: boolean;
  isBookable: boolean;
}

export interface PublicBooking {
  id: string;
  reference: string;
  consultationId: string;
  fullName: string;
  contactNumber: string;
  email: string;
  userType: string;
  companyOrOrganization: string;
  seats: number;
  sessionDate: string | null;
  sessionSnapshot: {
    sessionTitle: string;
    sessionType: string;
    date: string | null;
    startTime: string;
    endTime: string;
    duration: string;
    timeZone: string;
    meetingFormat: string;
    location: string;
    counselor: string;
  };
  notes: string;
  paymentMethod: string;
  amount: string;
  paymentReference: string;
  paymentSuccess: boolean;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface CreateBookingPayload {
  consultationId: string;
  fullName: string;
  contactNumber: string;
  email: string;
  userType?: string;
  seats?: number;
  sessionDate?: string | null;
  paymentMethod?: string;
  notes?: string;
}

export interface PaginationMeta {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000/api';

export async function getPublishedConsultations(
  params: Record<string, string> = {},
): Promise<PublicConsultation[]> {
  const qs = new URLSearchParams(params).toString();
  try {
    const res = await fetch(`${API_URL}/consultations${qs ? `?${qs}` : ''}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error(`Failed to load consultations (${res.status})`);
    const json = await res.json();
    if (Array.isArray(json)) return json;
    return (json?.data as PublicConsultation[]) ?? [];
  } catch (e) {
    console.warn('[consultations] Falling back to empty list:', e);
    return [];
  }
}

export async function getPublishedConsultationsPage(
  params: Record<string, string> = {},
): Promise<{ data: PublicConsultation[]; meta: PaginationMeta }> {
  const qs = new URLSearchParams(params).toString();
  try {
    const res = await fetch(`${API_URL}/consultations${qs ? `?${qs}` : ''}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error(`Failed to load consultations (${res.status})`);
    const json = await res.json();
    if (Array.isArray(json)) {
      return { data: json, meta: { page: 1, perPage: json.length, total: json.length, totalPages: 1 } };
    }
    return {
      data: (json?.data as PublicConsultation[]) ?? [],
      meta: (json?.meta as PaginationMeta) ?? { page: 1, perPage: 10, total: 0, totalPages: 1 },
    };
  } catch (e) {
    console.warn('[consultations] Falling back to empty list:', e);
    return { data: [], meta: { page: 1, perPage: 6, total: 0, totalPages: 1 } };
  }
}

export async function getConsultationBySlug(
  slug: string,
): Promise<PublicConsultationDetail | null> {
  try {
    const res = await fetch(`${API_URL}/consultations/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`Failed to load consultation (${res.status})`);
    }
    return res.json();
  } catch (e) {
    console.warn(`[consultations] Failed to fetch session "${slug}":`, e);
    return null;
  }
}

export async function createBooking(
  payload: CreateBookingPayload,
): Promise<PublicBooking> {
  const res = await fetch(`${API_URL}/consultations/book`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!res.ok) {
    const message =
      json?.error?.message ?? 'Failed to submit your booking. Please try again.';
    const details = json?.error?.details ?? {};
    const err = new Error(message) as Error & { details?: Record<string, string[]> };
    err.details = details;
    throw err;
  }
  return json as PublicBooking;
}

export async function getBookingByReference(
  reference: string,
): Promise<PublicBooking | null> {
  try {
    const res = await fetch(`${API_URL}/consultations/bookings/${encodeURIComponent(reference)}`, {
      next: { revalidate: 0 },
    });
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`Failed to load booking (${res.status})`);
    }
    return res.json();
  } catch (e) {
    console.warn(`[consultations] Failed to fetch booking "${reference}":`, e);
    return null;
  }
}