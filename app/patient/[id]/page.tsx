"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getDocument, queryDocuments, createDocument, COLLECTIONS, Patient, FollowUp, Payment, Appointment } from '@/lib/firestore-service';
import { where } from 'firebase/firestore';

export default function PatientDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'profile' | 'payments'>('profile');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientData, followUpData, paymentData, appointmentData] = await Promise.all([
          getDocument<Patient>(COLLECTIONS.PATIENTS, params.id),
          queryDocuments<FollowUp>(COLLECTIONS.FOLLOW_UPS, [where('patientId', '==', params.id)]),
          queryDocuments<Payment>(COLLECTIONS.PAYMENTS, [where('patientId', '==', params.id)]),
          queryDocuments<Appointment>(COLLECTIONS.APPOINTMENTS, [where('patientId', '==', params.id)])
        ]);
        setPatient(patientData);
        setFollowUps(followUpData);
        setPayments(paymentData);
        setAppointments(appointmentData);
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
                <span className="text-amber-100 font-bold">S</span>
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

          {/* Tab Navigation */}
          <div className="flex border-b border-amber-200">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-6 py-2 font-medium text-sm transition-colors duration-200 ${activeTab === 'profile' ? 'border-b-2 border-emerald-600 text-emerald-700' : 'text-stone-500 hover:text-emerald-600'}`}
            >
              Patient File
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`px-6 py-2 font-medium text-sm transition-colors duration-200 ${activeTab === 'payments' ? 'border-b-2 border-emerald-600 text-emerald-700' : 'text-stone-500 hover:text-emerald-600'}`}
            >
              Payments
            </button>
          </div>

          {activeTab === 'profile' ? (
            <div className="space-y-6">
              {/* Stats Highlights */}
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <div className="rounded-lg border border-amber-200 bg-white p-4 shadow-sm">
                  <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">Total Billed</p>
                  <p className="mt-1 text-2xl font-bold text-stone-800">₹{payments.reduce((sum: number, p: Payment) => sum + p.totalAmount, 0)}</p>
                </div>
                <div className="rounded-lg border border-amber-200 bg-white p-4 shadow-sm">
                  <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">Total Paid</p>
                  <p className="mt-1 text-2xl font-bold text-emerald-600">₹{payments.reduce((sum: number, p: Payment) => sum + p.paidAmount, 0)}</p>
                </div>
                <div className="rounded-lg border border-amber-200 bg-white p-4 shadow-sm">
                  <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">Outstanding Bal.</p>
                  <p className="mt-1 text-2xl font-bold text-red-600">₹{payments.reduce((sum: number, p: Payment) => sum + p.balanceAmount, 0)}</p>
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
                        <label className="text-sm font-medium text-stone-500">Name</label>
                        <p className="font-semibold text-stone-800">{patient.name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-stone-500">Age</label>
                        <p className="text-stone-700">{patient.age} years</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-stone-500">Address</label>
                        <p className="text-stone-700">{patient.address}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-stone-500">Phone</label>
                        <p className="text-stone-700">{patient.phoneNumber}</p>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-stone-500">Job</label>
                      <p className="text-stone-700">{patient.job}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-stone-500">Reference</label>
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
                      <label className="text-sm font-medium text-stone-500">Symptoms</label>
                      <p className="text-stone-700">{patient.symptoms}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-stone-500">Treatment Plan</label>
                      <p className="text-stone-700">{patient.treatmentPlan}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-stone-500">Last Visit</label>
                        <p className="text-stone-700">{patient.lastVisit || "N/A"}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-stone-500">Status</label>
                        <div className="mt-1">
                          <span className={`inline-block rounded-full px-3 py-0.5 text-xs font-medium ${patient.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                            {patient.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ayurvedic Assessment */}
              <div className="border-amber-200 rounded-lg border bg-white p-6 shadow-sm">
                <div className="border-b border-amber-100 bg-gradient-to-r from-teal-50 to-emerald-50 p-4 -m-6 mb-6 rounded-t-lg">
                  <h3 className="text-stone-800 font-semibold">Ayurvedic Assessment</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  <div>
                    <label className="text-sm font-medium text-stone-500">Nadi Parikshan</label>
                    <p className="text-stone-700">{patient.nadiParikshan}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-stone-500">Condition (Lakshana)</label>
                    <p className="text-stone-700">{patient.condition}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-stone-500">H/O</label>
                    <p className="text-stone-700">{patient.ho}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-stone-500">Treatment</label>
                    <p className="text-stone-700">{patient.treatment}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-stone-500">Parikshan (General Assessment)</label>
                    <p className="text-stone-700">{patient.parikshan}</p>
                  </div>
                </div>
              </div>

              {/* Appointment History */}
              <div className="border-amber-200 rounded-lg border bg-white p-6 shadow-sm">
                <div className="border-b border-amber-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 -m-6 mb-6 rounded-t-lg">
                  <h3 className="text-stone-800 font-semibold">Appointment History</h3>
                </div>
                {appointments.length === 0 ? (
                  <p className="text-stone-500 italic">No appointments recorded.</p>
                ) : (
                  <div className="overflow-x-auto mt-2">
                    <table className="min-w-full divide-y divide-stone-200">
                      <thead>
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-semibold text-stone-500 uppercase tracking-wider">Date</th>
                          <th className="px-4 py-2 text-left text-xs font-semibold text-stone-500 uppercase tracking-wider">Time</th>
                          <th className="px-4 py-2 text-left text-xs font-semibold text-stone-500 uppercase tracking-wider">Type</th>
                          <th className="px-4 py-2 text-left text-xs font-semibold text-stone-500 uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-stone-100">
                        {[...appointments].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((apt) => (
                          <tr key={apt.id}>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-stone-700">{apt.date}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-stone-700">{apt.time}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-stone-700">{apt.type}</td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${apt.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                                {apt.status || 'Scheduled'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Follow Ups History */}
              <div className="border-amber-200 rounded-lg border bg-white p-6 shadow-sm">
                <div className="border-b border-amber-100 bg-gradient-to-r from-orange-50 to-amber-50 p-4 -m-6 mb-6 rounded-t-lg">
                  <h3 className="text-stone-800 font-semibold">Follow-Up History</h3>
                </div>

                {followUps.length === 0 ? (
                  <p className="text-stone-500 italic">No follow-up records found.</p>
                ) : (
                  <div className="space-y-4 mt-2">
                    {[...followUps].sort((a, b) => new Date(b.date + (b.time ? 'T' + b.time : '')).getTime() - new Date(a.date + (a.time ? 'T' + a.time : '')).getTime()).reverse().map((followUp: FollowUp) => (
                      <div key={followUp.id} className="border border-amber-100 rounded-md p-4 bg-amber-50/30">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="font-semibold text-stone-800 text-sm">{followUp.date} {followUp.time && <span className="text-stone-500 ml-1">at {followUp.time}</span>}</span>
                            <p className="text-xs text-stone-500 mt-1 uppercase tracking-tighter">Reason: <span className="font-medium text-stone-700">{followUp.reason}</span></p>
                          </div>
                          <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${followUp.status === "Completed" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                            {followUp.status}
                          </span>
                        </div>
                        <p className="text-sm text-stone-700 bg-white p-3 rounded border border-stone-100 mt-2">{followUp.notes || "No notes provided."}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Manual Payment Entry and History will go here */}
              <PaymentTabContent patientId={params.id} payments={payments} onPaymentAdded={() => {
                // Refresh payments
                queryDocuments<Payment>(COLLECTIONS.PAYMENTS, [where('patientId', '==', params.id)])
                  .then(setPayments);
              }} />
            </div>
          )}

          <div className="flex justify-end space-x-4 pt-4">
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

function PaymentTabContent({ patientId, payments, onPaymentAdded }: { patientId: string, payments: Payment[], onPaymentAdded: () => void }) {
  const [formData, setFormData] = useState({
    consultingFee: 0,
    medicineCharges: 0,
    procedureCharges: 0,
    panchakarmaCharges: 0,
    extraCharges: 0,
    paidAmount: 0,
    date: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);

  const totalAmount = formData.consultingFee + formData.medicineCharges + formData.procedureCharges + formData.panchakarmaCharges + formData.extraCharges;
  const balanceAmount = totalAmount - formData.paidAmount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const paymentData: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'> = {
        patientId,
        ...formData,
        totalAmount,
        balanceAmount,
      };
      await createDocument(COLLECTIONS.PAYMENTS, paymentData);
      onPaymentAdded();
      setFormData({
        consultingFee: 0,
        medicineCharges: 0,
        procedureCharges: 0,
        panchakarmaCharges: 0,
        extraCharges: 0,
        paidAmount: 0,
        date: new Date().toISOString().split('T')[0]
      });
      alert('Payment added successfully');
    } catch (error) {
      console.error("Error adding payment:", error);
      alert('Failed to add payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-amber-200 rounded-lg border bg-white p-6 shadow-sm">
        <div className="border-b border-amber-100 bg-gradient-to-r from-emerald-50 to-teal-50 p-4 -m-6 mb-6 rounded-t-lg">
          <h3 className="text-stone-800 font-semibold">Add Manual Payment</h3>
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-medium text-stone-500">Date</label>
            <input type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-emerald-500" required />
          </div>
          <div>
            <label className="text-xs font-medium text-stone-500">Consulting Fee (₹)</label>
            <input type="number" value={formData.consultingFee} onChange={e => setFormData({ ...formData, consultingFee: Number(e.target.value) })} className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="text-xs font-medium text-stone-500">Medicine Charges (₹)</label>
            <input type="number" value={formData.medicineCharges} onChange={e => setFormData({ ...formData, medicineCharges: Number(e.target.value) })} className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="text-xs font-medium text-stone-500">Procedure Charges (₹)</label>
            <input type="number" value={formData.procedureCharges} onChange={e => setFormData({ ...formData, procedureCharges: Number(e.target.value) })} className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="text-xs font-medium text-stone-500">Panchakarma (₹)</label>
            <input type="number" value={formData.panchakarmaCharges} onChange={e => setFormData({ ...formData, panchakarmaCharges: Number(e.target.value) })} className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="text-xs font-medium text-stone-500">Extra Charges (₹)</label>
            <input type="number" value={formData.extraCharges} onChange={e => setFormData({ ...formData, extraCharges: Number(e.target.value) })} className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-emerald-500" />
          </div>
          <div className="md:col-span-1 bg-emerald-50 p-2 rounded border border-emerald-100">
            <label className="text-xs font-semibold text-emerald-800">Total Billed</label>
            <p className="text-lg font-bold text-emerald-900">₹{totalAmount}</p>
          </div>
          <div>
            <label className="text-xs font-medium text-stone-500">Paid Amount (₹)</label>
            <input type="number" value={formData.paidAmount} onChange={e => setFormData({ ...formData, paidAmount: Number(e.target.value) })} className="mt-1 block w-full rounded-md border border-emerald-500 px-3 py-2 text-sm focus:ring-emerald-500 font-semibold" />
          </div>
          <div className="md:col-span-1 bg-red-50 p-2 rounded border border-red-100">
            <label className="text-xs font-semibold text-red-800">Balance Due</label>
            <p className="text-lg font-bold text-red-900">₹{balanceAmount}</p>
          </div>
          <div className="md:col-span-3 flex justify-end">
            <button type="submit" disabled={loading} className="rounded-md bg-emerald-600 px-6 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50 transition-all">
              {loading ? "Saving..." : "Record Payment"}
            </button>
          </div>
        </form>
      </div>

      <div className="border-amber-200 rounded-lg border bg-white p-6 shadow-sm overflow-hidden">
        <div className="border-b border-amber-100 bg-gradient-to-r from-amber-50 to-orange-50 p-4 -m-6 mb-6 rounded-t-lg">
          <h3 className="text-stone-800 font-semibold">Payment History</h3>
        </div>
        {payments.length === 0 ? (
          <p className="text-stone-500 italic mt-4">No payment history found.</p>
        ) : (
          <div className="overflow-x-auto mt-2">
            <table className="min-w-full divide-y divide-stone-200">
              <thead className="bg-stone-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-stone-500 uppercase">Date</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-stone-500 uppercase">Breakdown</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-stone-500 uppercase text-right">Total</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-stone-500 uppercase text-right">Paid</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-stone-500 uppercase text-right">Balance</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-stone-100">
                {[...payments].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((p: Payment) => (
                  <tr key={p.id}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-stone-700 font-medium">{p.date}</td>
                    <td className="px-4 py-3 text-xs text-stone-500">
                      <div className="grid grid-cols-2 gap-x-2">
                        <span>Consult: ₹{p.consultingFee}</span>
                        <span>Med: ₹{p.medicineCharges}</span>
                        <span>Proc: ₹{p.procedureCharges}</span>
                        <span>Panch: ₹{p.panchakarmaCharges}</span>
                        {p.extraCharges > 0 && <span>Extra: ₹{p.extraCharges}</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-stone-800 text-right font-bold">₹{p.totalAmount}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-emerald-600 text-right font-bold">₹{p.paidAmount}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-red-600 text-right font-bold">₹{p.balanceAmount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

