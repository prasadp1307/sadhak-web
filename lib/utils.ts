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


