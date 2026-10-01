import * as XLSX from "xlsx";
import type {
  Patient,
  Appointment,
  Payment,
  Medicine,
  Treatment,
  FollowUp,
} from "./firestore-service";
import {
  calculateBMI,
  formatDateToDDMMYYYY,
  formatNextFollowPresentation,
  resolveNextFollow,
} from "./utils";

/** Strip HTML for plain-text Excel cells */
export function stripHtml(html: string | undefined): string {
  if (!html) return "";
  const withBreaks = html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<\/div>/gi, "\n");
  return withBreaks.replace(/<[^>]+>/g, "").replace(/\n{3,}/g, "\n\n").trim();
}

function sanitizeFilename(name: string): string {
  return name.replace(/[^\w\s-]/g, "").replace(/\s+/g, "_").slice(0, 80);
}

function downloadWorkbook(wb: XLSX.WorkBook, filename: string) {
  XLSX.writeFile(wb, filename, { bookType: "xlsx", cellStyles: false });
}

/** Set column widths from sheet content */
function autoColumnWidths(sheet: XLSX.WorkSheet, rows: Record<string, unknown>[]) {
  if (rows.length === 0) return;
  const keys = Object.keys(rows[0]);
  const widths = keys.map((key) => {
    const maxLen = Math.max(
      key.length,
      ...rows.map((r) => String(r[key] ?? "").length)
    );
    return { wch: Math.min(Math.max(maxLen + 2, 10), 50) };
  });
  sheet["!cols"] = widths;
}

function sheetFromRows(rows: Record<string, unknown>[], sheetName: string): XLSX.WorkSheet {
  const sheet = XLSX.utils.json_to_sheet(rows);
  autoColumnWidths(sheet, rows);
  return sheet;
}

function textCell(value: string): string {
  return value;
}

export function exportPatientsToExcel(
  patients: Patient[],
  followUps: FollowUp[],
  appointments: Appointment[],
  searchFiltered?: Patient[]
) {
  const list = searchFiltered ?? patients;
  const followByPatient = new Map<string, FollowUp[]>();
  for (const f of followUps) {
    const arr = followByPatient.get(f.patientId) ?? [];
    arr.push(f);
    followByPatient.set(f.patientId, arr);
  }
  const aptByPatient = new Map<string, Appointment[]>();
  for (const a of appointments) {
    const arr = aptByPatient.get(a.patientId) ?? [];
    arr.push(a);
    aptByPatient.set(a.patientId, arr);
  }

  const rows = list.map((p) => {
    const bmi = calculateBMI(p.height, p.weight);
    const nextFollow = formatNextFollowPresentation(
      resolveNextFollow(p, followByPatient.get(p.id), aptByPatient.get(p.id))
    );
    return {
      "Patient ID": p.id,
      Name: p.name,
      Age: p.age,
      "Date of Birth": formatDateToDDMMYYYY(p.dob),
      Phone: textCell(p.phoneNumber),
      Address: p.address,
      Job: p.job ?? "",
      Reference: p.reference ?? "",
      Height: p.height ?? "",
      "Weight (kg)": p.weight ?? "",
      BMI: bmi?.bmiFormatted ?? "",
      "BMI Category": bmi?.category ?? "",
      Status: p.status,
      "Last Visit": formatDateToDDMMYYYY(p.lastVisit),
      "Next Follow": nextFollow.label,
      Symptoms: stripHtml(p.symptoms),
      "Treatment Plan": stripHtml(p.treatmentPlan),
    };
  });

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, sheetFromRows(rows, "Patients"), "Patients");
  const date = new Date().toISOString().split("T")[0];
  downloadWorkbook(wb, `Sadhak_Patients_${date}.xlsx`);
}

export function exportAppointmentsToExcel(appointments: Appointment[]) {
  const rows = appointments.map((a) => ({
    Date: formatDateToDDMMYYYY(a.date),
    Time: a.time,
    "Patient Name": a.patientName,
    "Patient ID": a.patientId,
    Type: a.type,
    Duration: a.duration,
    Status: a.status ?? "Scheduled",
  }));

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, sheetFromRows(rows, "Appointments"), "Appointments");
  downloadWorkbook(wb, `Sadhak_Appointments_${new Date().toISOString().split("T")[0]}.xlsx`);
}

export function exportMedicinesToExcel(medicines: Medicine[]) {
  const rows = medicines.map((m) => ({
    Name: m.name,
    Category: m.category,
    "Stock Quantity": m.stock,
    "Low Stock": m.lowStock ? "Yes" : "No",
    Price: m.price,
  }));

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, sheetFromRows(rows, "Medicines"), "Medicine Inventory");
  downloadWorkbook(wb, `Sadhak_Medicines_${new Date().toISOString().split("T")[0]}.xlsx`);
}

export function exportTreatmentsToExcel(treatments: Treatment[]) {
  const rows = treatments.map((t) => ({
    Name: t.name,
    Category: t.category,
    Duration: t.duration,
    Description: t.description,
  }));

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, sheetFromRows(rows, "Treatments"), "Treatment Plans");
  downloadWorkbook(wb, `Sadhak_Treatments_${new Date().toISOString().split("T")[0]}.xlsx`);
}

export function exportPaymentsReportToExcel(
  payments: Payment[],
  patients: Patient[]
) {
  const patientMap = new Map(patients.map((p) => [p.id, p.name]));
  const sorted = [...payments].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const detailRows = sorted.map((p) => ({
    Date: formatDateToDDMMYYYY(p.date),
    Patient: patientMap.get(p.patientId) ?? "Unknown",
    "Patient ID": p.patientId,
    "Consulting Fee": p.consultingFee,
    "Medicine Charges": p.medicineCharges,
    "Procedure Charges": p.procedureCharges,
    "Panchakarma Charges": p.panchakarmaCharges,
    "Extra Charges": p.extraCharges,
    "Total Billed": p.totalAmount,
    "Amount Paid": p.paidAmount,
    Balance: p.balanceAmount,
  }));

  const totalPaid = payments.reduce((s, p) => s + p.paidAmount, 0);
  const totalBalance = payments.reduce((s, p) => s + p.balanceAmount, 0);
  const summaryRows = [
    { Metric: "Total Revenue (Paid)", Value: totalPaid },
    { Metric: "Total Outstanding", Value: totalBalance },
    { Metric: "Transaction Count", Value: payments.length },
    {
      Metric: "Average Transaction",
      Value: payments.length ? Math.round(totalPaid / payments.length) : 0,
    },
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, sheetFromRows(summaryRows, "Summary"), "Summary");
  XLSX.utils.book_append_sheet(wb, sheetFromRows(detailRows, "Transactions"), "Transactions");
  downloadWorkbook(wb, `Sadhak_Financial_Report_${new Date().toISOString().split("T")[0]}.xlsx`);
}

export function exportPatientDetailToExcel(
  patient: Patient,
  followUps: FollowUp[],
  payments: Payment[],
  appointments: Appointment[]
) {
  const bmi = calculateBMI(patient.height, patient.weight);
  const nextFollow = formatNextFollowPresentation(
    resolveNextFollow(patient, followUps, appointments)
  );

  const profileRows = [
    { Field: "Patient ID", Value: patient.id },
    { Field: "Name", Value: patient.name },
    { Field: "Age", Value: patient.age },
    { Field: "Date of Birth", Value: formatDateToDDMMYYYY(patient.dob) },
    { Field: "Phone", Value: textCell(patient.phoneNumber) },
    { Field: "Address", Value: patient.address },
    { Field: "Job", Value: patient.job ?? "" },
    { Field: "Reference", Value: patient.reference ?? "" },
    { Field: "Height", Value: patient.height ?? "" },
    { Field: "Weight (kg)", Value: patient.weight ?? "" },
    { Field: "BMI", Value: bmi?.bmiFormatted ?? "" },
    { Field: "Status", Value: patient.status },
    { Field: "Last Visit", Value: formatDateToDDMMYYYY(patient.lastVisit) },
    { Field: "Next Follow", Value: nextFollow.label },
    { Field: "Symptoms", Value: stripHtml(patient.symptoms) },
    { Field: "Treatment Plan", Value: stripHtml(patient.treatmentPlan) },
    { Field: "Nadi Parikshan", Value: stripHtml(patient.nadiParikshan) },
    { Field: "Condition (Lakshana)", Value: stripHtml(patient.condition) },
    { Field: "History", Value: stripHtml(patient.history) },
    { Field: "Parikshan", Value: stripHtml(patient.parikshan) },
    { Field: "Treatment Days", Value: patient.treatment_days ?? "" },
  ];

  const followRows = [...followUps]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map((f) => ({
      Date: formatDateToDDMMYYYY(f.date),
      Time: f.time ?? "",
      "Nadi Parikshan": stripHtml(f.nadiParikshan),
      Lakshan: stripHtml(f.lakshan),
      History: stripHtml(f.history),
      "General Assessment": stripHtml(f.generalAssessment),
      "Treatment Plan": stripHtml(f.treatmentPlan),
      "Treatment Days": f.treatment_days ?? "",
      Notes: stripHtml(f.notes),
      "Payment (₹)": f.paymentAmount ?? 0,
      Status: f.status,
    }));

  const paymentRows = [...payments]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map((p) => ({
      Date: formatDateToDDMMYYYY(p.date),
      "Consulting Fee": p.consultingFee,
      "Medicine Charges": p.medicineCharges,
      "Procedure Charges": p.procedureCharges,
      "Panchakarma Charges": p.panchakarmaCharges,
      "Extra Charges": p.extraCharges,
      "Total Billed": p.totalAmount,
      "Amount Paid": p.paidAmount,
      Balance: p.balanceAmount,
    }));

  const aptRows = [...appointments]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map((a) => ({
      Date: formatDateToDDMMYYYY(a.date),
      Time: a.time,
      Type: a.type,
      Duration: a.duration,
      Status: a.status ?? "Scheduled",
    }));

  const panchRows =
    patient.panchakarmaTherapies?.map((t) => ({
      Therapy: t.name,
      Duration: t.duration,
      Schedule: t.schedule,
      Notes: t.notes ?? "",
    })) ?? [];

  const procRows =
    patient.extraProcedures?.map((p) => ({
      Procedure: p.name,
      Purpose: p.purpose,
      Frequency: p.durationFrequency,
      Remarks: p.remarks ?? "",
    })) ?? [];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, sheetFromRows(profileRows, "Profile"), "Profile");
  if (followRows.length) {
    XLSX.utils.book_append_sheet(wb, sheetFromRows(followRows, "Follow-Ups"), "Follow-Ups");
  }
  if (paymentRows.length) {
    XLSX.utils.book_append_sheet(wb, sheetFromRows(paymentRows, "Payments"), "Payments");
  }
  if (aptRows.length) {
    XLSX.utils.book_append_sheet(wb, sheetFromRows(aptRows, "Appointments"), "Appointments");
  }
  if (panchRows.length) {
    XLSX.utils.book_append_sheet(
      wb,
      sheetFromRows(panchRows, "Panchakarma"),
      "Panchakarma"
    );
  }
  if (procRows.length) {
    XLSX.utils.book_append_sheet(
      wb,
      sheetFromRows(procRows, "Procedures"),
      "Extra Procedures"
    );
  }

  const fname = sanitizeFilename(patient.name);
  downloadWorkbook(wb, `Sadhak_Patient_${fname}_${new Date().toISOString().split("T")[0]}.xlsx`);
}
