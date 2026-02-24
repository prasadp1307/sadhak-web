"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getDocument, queryDocuments, COLLECTIONS, Patient, FollowUp, Payment } from '@/lib/firestore-service';
import { where } from 'firebase/firestore';

export default function PatientDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientData, followUpData, paymentData] = await Promise.all([
          getDocument<Patient>(COLLECTIONS.PATIENTS, params.id),
          queryDocuments<FollowUp>(COLLECTIONS.FOLLOW_UPS, [where('patientId', '==', params.id)]),
          queryDocuments<Payment>(COLLECTIONS.PAYMENTS, [where('patientId', '==', params.id)])
        ]);
        setPatient(patientData);
        setFollowUps(followUpData);
        setPayments(paymentData);
      } catch (error) {
        console.error("Error fetching patient details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50/40 to-emerald-50/60 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-stone-600">Loading patient data...</p>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50/40 to-emerald-50/60 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-stone-800">Patient Not Found</h1>
          <p className="text-stone-600">The requested patient could not be found.</p>
          <Link href="/">
            <button className="mt-4 rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700">
              Return to Dashboard
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50/40 to-emerald-50/60">
      <header className="sticky top-0 z-50 border-b-2 border-amber-300 bg-gradient-to-r from-amber-50 via-orange-50 to-emerald-50 shadow-lg backdrop-blur-sm">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-full border-2 border-amber-400 bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 shadow-lg">
                <svg className="h-5 w-5 text-amber-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <div>
                <h1 className="bg-gradient-to-r from-emerald-700 via-teal-600 to-amber-600 bg-clip-text text-xl font-black tracking-tight text-transparent">SADHAK</h1>
                <p className="text-xs font-medium tracking-wide text-amber-700">Patient Details</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="p-6">
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-stone-800">{patient.name}</h2>
              <p className="text-stone-600">Patient ID: #{patient.id}</p>
            </div>
          </div>

          {/* Practitioner Dashboard Metrics */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="rounded-lg border border-amber-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">Total Billed</p>
              <p className="mt-1 text-2xl font-bold text-stone-800">₹{payments.reduce((sum, p) => sum + p.totalAmount, 0)}</p>
            </div>
            <div className="rounded-lg border border-amber-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">Total Paid</p>
              <p className="mt-1 text-2xl font-bold text-emerald-600">₹{payments.reduce((sum, p) => sum + p.paidAmount, 0)}</p>
            </div>
            <div className="rounded-lg border border-amber-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">Outstanding Bal.</p>
              <p className="mt-1 text-2xl font-bold text-red-600">₹{payments.reduce((sum, p) => sum + p.balanceAmount, 0)}</p>
            </div>
            <div className="rounded-lg border border-amber-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">Latest Note</p>
              <p className="mt-1 text-sm font-medium text-stone-700 truncate line-clamp-2">
                {[...followUps].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]?.notes || "No notes"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="border-amber-200 rounded-lg border bg-white p-6 shadow-sm">
              <div className="border-b border-amber-100 bg-gradient-to-r from-emerald-50 to-teal-50 p-4 -m-6 mb-6 rounded-t-lg">
                <h3 className="text-stone-800 font-semibold">Basic Information</h3>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-stone-700">Name</label>
                    <p className="font-semibold text-stone-800">{patient.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-stone-700">Age</label>
                    <p className="text-stone-700">{patient.age} years</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-stone-700">Address</label>
                    <p className="text-stone-700">{patient.address}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-stone-700">Phone Number</label>
                    <p className="text-stone-700">{patient.phoneNumber}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-stone-700">Job</label>
                  <p className="text-stone-700">{patient.job}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-stone-700">Reference</label>
                  <p className="text-stone-700">{patient.reference}</p>
                </div>
              </div>
            </div>

            <div className="border-amber-200 rounded-lg border bg-white p-6 shadow-sm">
              <div className="border-b border-amber-100 bg-gradient-to-r from-amber-50 to-orange-50 p-4 -m-6 mb-6 rounded-t-lg">
                <h3 className="text-stone-800 font-semibold">Medical Details</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-stone-700">Symptoms</label>
                  <p className="text-stone-700">{patient.symptoms}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-stone-700">Treatment Plan</label>
                  <p className="text-stone-700">{patient.treatmentPlan}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-stone-700">Payment</label>
                  <p className="font-semibold text-emerald-700">₹{payments.reduce((sum, p) => sum + p.paidAmount, 0)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-stone-700">Last Visit</label>
                  <p className="text-stone-700">{patient.lastVisit || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-stone-700">Next Appointment</label>
                  <p className="font-semibold text-amber-600">{patient.nextAppointmentDate || "Not Scheduled"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-stone-700">Status</label>
                  <span className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${patient.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                    {patient.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-amber-200 rounded-lg border bg-white p-6 shadow-sm">
            <div className="border-b border-amber-100 bg-gradient-to-r from-teal-50 to-emerald-50 p-4 -m-6 mb-6 rounded-t-lg">
              <h3 className="text-stone-800 font-semibold">Ayurvedic Assessment</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-stone-700">Nadi Parikshan</label>
                <p className="text-stone-700">{patient.nadiParikshan}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-stone-700">Condition (Lakshana)</label>
                <p className="text-stone-700">{patient.condition}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-stone-700">H/O</label>
                <p className="text-stone-700">{patient.ho}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-stone-700">Treatment</label>
                <p className="text-stone-700">{patient.treatment}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-stone-700">Parikshan</label>
                <p className="text-stone-700">{patient.parikshan}</p>
              </div>
            </div>
          </div>

          {/* Follow Ups Section */}
          <div className="border-amber-200 rounded-lg border bg-white p-6 shadow-sm">
            <div className="border-b border-amber-100 bg-gradient-to-r from-orange-50 to-amber-50 p-4 -m-6 mb-6 rounded-t-lg">
              <h3 className="text-stone-800 font-semibold">Follow-Up History</h3>
            </div>

            {followUps.length === 0 ? (
              <p className="text-stone-500 italic">No follow-up records found.</p>
            ) : (
              <div className="space-y-4">
                {followUps.map(followUp => (
                  <div key={followUp.id} className="border border-amber-100 rounded-md p-4 bg-amber-50/30">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="font-semibold text-stone-800 text-sm">{new Date(followUp.date).toLocaleDateString()}</span>
                        <p className="text-xs text-stone-500 mt-1">Reason: <span className="font-medium text-stone-700">{followUp.reason}</span></p>
                      </div>
                      <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${followUp.status === "Completed" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                        {followUp.status}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-stone-700 bg-white p-3 rounded border border-stone-200 mt-2">{followUp.notes}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-4">
            <button onClick={() => router.back()} className="rounded-md border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 shadow-sm hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2">
              Back
            </button>
            <Link href={`/patient/${patient.id}/edit`}>
              <button className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2">
                Edit Patient
              </button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
