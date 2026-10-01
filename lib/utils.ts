import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface BmiResult {
  bmi: number;
  bmiFormatted: string;
  category: string;
  badgeClass: string;
  heightCm: number;
}

export function calculateBMI(heightStr: string | undefined, weightStr: string | number | undefined): BmiResult | null {
  if (!heightStr || weightStr === undefined || weightStr === null || weightStr === '') return null;

  const wNum = typeof weightStr === 'number' ? weightStr : parseFloat(String(weightStr).replace(',', '.'));
  if (isNaN(wNum) || wNum <= 0) return null;

  const hRaw = String(heightStr).trim();
  if (!hRaw) return null;

  let heightInCm = 0;

  // Handle formats like "5,8", "5.8", "5'8", "5'8\"", "5 8", "172", "172.5"
  const clean = hRaw.replace(/["'ftin]/gi, '').trim();

  if (clean.includes(',') || clean.includes('.') || clean.includes(' ')) {
    const parts = clean.split(/[,.\s]+/);
    const num1 = parseFloat(parts[0]);
    const num2 = parts.length > 1 && parts[1] !== '' ? parseFloat(parts[1]) : NaN;

    if (!isNaN(num1)) {
      if (num1 < 10) {
        // Feet & inches (e.g. 5,8 -> 5 ft 8 in)
        const feet = num1;
        const inches = !isNaN(num2) ? num2 : 0;
        heightInCm = (feet * 12 + inches) * 2.54;
      } else {
        // Direct cm (e.g. 172.5)
        heightInCm = parseFloat(clean.replace(',', '.'));
      }
    }
  } else {
    const val = parseFloat(clean);
    if (!isNaN(val)) {
      if (val < 10) {
        // e.g. 5 -> 5 ft
        heightInCm = val * 30.48;
      } else {
        // e.g. 172
        heightInCm = val;
      }
    }
  }

  if (isNaN(heightInCm) || heightInCm <= 0) return null;

  const heightInMeters = heightInCm / 100;
  const bmi = wNum / (heightInMeters * heightInMeters);

  if (isNaN(bmi) || bmi <= 0 || bmi > 100) return null;

  let category = "Normal Weight";
  let badgeClass = "bg-emerald-100 text-emerald-800 border-emerald-300";

  if (bmi < 18.5) {
    category = "Underweight";
    badgeClass = "bg-sky-100 text-sky-800 border-sky-300";
  } else if (bmi < 25) {
    category = "Normal Weight";
    badgeClass = "bg-emerald-100 text-emerald-800 border-emerald-300";
  } else if (bmi < 30) {
    category = "Overweight";
    badgeClass = "bg-amber-100 text-amber-800 border-amber-300";
  } else {
    category = "Obese";
    badgeClass = "bg-red-100 text-red-800 border-red-300";
  }

  return {
    bmi,
    bmiFormatted: bmi.toFixed(1),
    category,
    badgeClass,
    heightCm: Math.round(heightInCm * 10) / 10
  };
}

/** Minimal follow-up fields for resolving the next follow date (no Firestore import). */
export interface FollowUpDateLike {
  date: string;
  time?: string;
  status: string;
}

export interface NextFollowPatientLike {
  nextAppointmentDate?: string;
  lastVisit?: string;
  treatment_days?: number;
}

export type NextFollowQuality = 'good' | 'bad';

export type NextFollowSource =
  | 'pending_follow_up'
  | 'manual'
  | 'appointment'
  | 'inferred_treatment_days'
  | 'none';

export interface ResolvedNextFollow {
  date?: string;
  quality: NextFollowQuality;
  source: NextFollowSource;
}

export interface AppointmentDateLike {
  date: string;
  status?: string;
}

function isPendingFollowUpStatus(status: string | undefined): boolean {
  return String(status ?? '').trim().toLowerCase() === 'pending';
}

function normalizeYmd(date: string): string | undefined {
  const trimmed = date.trim();
  const ymd = /^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/.exec(trimmed);
  if (!ymd) return undefined;
  const [, yyyy, mm, dd] = ymd;
  return `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
}

function todayYmdLocal(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function isCancelledAppointmentStatus(status: string | undefined): boolean {
  const s = String(status ?? '').trim().toLowerCase();
  return s === 'cancelled' || s === 'canceled';
}

function addDaysToYmd(ymd: string, days: number): string {
  const [y, m, d] = ymd.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + days);
  const yy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, '0');
  const dd = String(dt.getDate()).padStart(2, '0');
  return `${yy}-${mm}-${dd}`;
}

function followUpDateTimeSortValue(date: string, time?: string): number {
  const timePart = (time || '00:00').replace(/\s*(AM|PM)/i, '').trim();
  const parsed = Date.parse(`${date}T${timePart}`);
  if (!isNaN(parsed)) return parsed;
  const ymd = /^(\d{4})-(\d{2})-(\d{2})/.exec(date);
  if (ymd) return Date.UTC(Number(ymd[1]), Number(ymd[2]) - 1, Number(ymd[3]));
  return 0;
}

/**
 * Next follow (read-only, client-side — no backend):
 * 1) Earliest pending follow-up
 * 2) patient.nextAppointmentDate (Edit Patient)
 * 3) Earliest upcoming appointment
 * 4) lastVisit + treatment_days (estimate when nothing else is set)
 */
export function resolveNextFollow(
  patient: NextFollowPatientLike,
  followUps?: FollowUpDateLike[],
  appointments?: AppointmentDateLike[]
): ResolvedNextFollow {
  const pending = (followUps ?? []).filter(
    (f) => isPendingFollowUpStatus(f.status) && f.date?.trim()
  );
  if (pending.length > 0) {
    const next = [...pending].sort(
      (a, b) =>
        followUpDateTimeSortValue(a.date, a.time) -
        followUpDateTimeSortValue(b.date, b.time)
    )[0];
    const date = normalizeYmd(next.date) ?? next.date;
    return { date, quality: 'good', source: 'pending_follow_up' };
  }

  const manual = patient.nextAppointmentDate?.trim();
  if (manual) {
    const date = normalizeYmd(manual) ?? manual;
    return { date, quality: 'good', source: 'manual' };
  }

  const today = todayYmdLocal();
  const upcoming = (appointments ?? [])
    .filter((a) => a.date?.trim() && !isCancelledAppointmentStatus(a.status))
    .map((a) => ({ ymd: normalizeYmd(a.date), raw: a.date }))
    .filter((a): a is { ymd: string; raw: string } => Boolean(a.ymd && a.ymd >= today))
    .sort((a, b) => a.ymd.localeCompare(b.ymd));

  if (upcoming[0]?.ymd) {
    return { date: upcoming[0].ymd, quality: 'good', source: 'appointment' };
  }

  const lastVisit = patient.lastVisit?.trim();
  const treatmentDays = patient.treatment_days;
  if (lastVisit && treatmentDays != null && treatmentDays > 0) {
    const base = normalizeYmd(lastVisit);
    if (base) {
      return {
        date: addDaysToYmd(base, treatmentDays),
        quality: 'good',
        source: 'inferred_treatment_days',
      };
    }
  }

  return { quality: 'bad', source: 'none' };
}

export function resolveNextFollowDate(
  patient: NextFollowPatientLike,
  followUps?: FollowUpDateLike[],
  appointments?: AppointmentDateLike[]
): string | undefined {
  return resolveNextFollow(patient, followUps, appointments).date;
}

export function formatNextFollowPresentation(resolved: ResolvedNextFollow): {
  label: string;
  quality: NextFollowQuality;
  className: string;
  hint?: string;
} {
  if (!resolved.date) {
    return {
      label: 'N/A',
      quality: 'bad',
      className: 'text-amber-700 font-medium',
      hint: 'Add pending follow-up or set Next Follow Date on Edit Patient',
    };
  }

  const label = formatDateToDDMMYYYY(resolved.date);
  if (resolved.source === 'inferred_treatment_days') {
    return {
      label,
      quality: 'good',
      className: 'text-teal-700 font-semibold',
      hint: 'Estimated from last visit + treatment days',
    };
  }

  return {
    label,
    quality: 'good',
    className: 'text-emerald-800 font-semibold',
  };
}

export function formatDateToDDMMYYYY(dateInput: string | Date | number | undefined | null): string {
  if (!dateInput) return "N/A";

  if (typeof dateInput === 'string') {
    const trimmed = dateInput.trim();
    if (!trimmed) return "N/A";

    // Handle YYYY-MM-DD format directly to avoid timezone shift issues
    const ymdMatch = /^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/.exec(trimmed);
    if (ymdMatch) {
      const [, yyyy, mm, dd] = ymdMatch;
      return `${dd.padStart(2, '0')}-${mm.padStart(2, '0')}-${yyyy}`;
    }

    // Handle DD-MM-YYYY or DD/MM/YYYY
    const dmyMatch = /^(\d{1,2})[-/](\d{1,2})[-/](\d{4})/.exec(trimmed);
    if (dmyMatch) {
      const [, dd, mm, yyyy] = dmyMatch;
      return `${dd.padStart(2, '0')}-${mm.padStart(2, '0')}-${yyyy}`;
    }
  }

  // Fallback to JS Date object
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return String(dateInput);

  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();

  return `${day}-${month}-${year}`;
}

export const DEMO_EMAILS = ['admin@sadhak.com', 'demo@sadhak.com', 'showcase@sadhak.com'];

export function isDemoUserEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return DEMO_EMAILS.includes(email.toLowerCase());
}


