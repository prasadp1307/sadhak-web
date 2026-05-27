"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getDocument, queryDocuments, createDocument, updateDocument, deleteDocument, COLLECTIONS, Patient, FollowUp, Payment, Appointment } from '@/lib/firestore-service';
import { where } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Edit, Trash2 } from 'lucide-react';
import { RichTextEditor } from '@/components/ui/RichTextEditor';

function formatDisplayHtml(text: string | undefined): string {
  if (!text) return "N/A";
  // If the text does not contain any HTML tags, convert newlines to <br />
  if (!/<[a-z][\s\S]*>/i.test(text)) {
    return text.replace(/\n/g, '<br />');
  }
  return text;
}

export default function PatientDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'profile' | 'payments' | 'follow-ups'>('profile');
  const [showEditPayment, setShowEditPayment] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const [editPaymentForm, setEditPaymentForm] = useState({date: '', consultingFee: 0, medicineCharges: 0, procedureCharges: 0, panchakarmaCharges: 0, extraCharges: 0, paidAmount: 0, notes: ''});

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

  const handleEditPaymentClick = (p: Payment) => {
    setEditingPayment(p);
    setEditPaymentForm({date: p.date, consultingFee: p.consultingFee, medicineCharges: p.medicineCharges, procedureCharges: p.procedureCharges, panchakarmaCharges: p.panchakarmaCharges, extraCharges: p.extraCharges, paidAmount: p.paidAmount, notes: (p as any).notes || ''});
    setShowEditPayment(true);
  };

  const handleSavePayment = async () => {
    if (!editingPayment) return;
    const totalAmount = editPaymentForm.consultingFee + editPaymentForm.medicineCharges + editPaymentForm.procedureCharges + editPaymentForm.panchakarmaCharges + editPaymentForm.extraCharges;
    const balanceAmount = totalAmount - editPaymentForm.paidAmount;
    await updateDocument(COLLECTIONS.PAYMENTS, editingPayment.id, {...editPaymentForm, totalAmount, balanceAmount});
    setPayments(payments.map(p => p.id === editingPayment.id ? {...p, ...editPaymentForm, totalAmount, balanceAmount} : p));
    setShowEditPayment(false);
  };

  const handleDeletePaymentClick = (p: Payment) => {
    if (confirm('Delete this payment? This cannot be undone.')) {
      deleteDocument(COLLECTIONS.PAYMENTS, p.id).then(() => setPayments(payments.filter(x => x.id !== p.id)));
    }
  };

  const editTotal = editPaymentForm.consultingFee + editPaymentForm.medicineCharges + editPaymentForm.procedureCharges + editPaymentForm.panchakarmaCharges + editPaymentForm.extraCharges;
  const editBalance = editTotal - editPaymentForm.paidAmount;

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
              onClick={() => setActiveTab('follow-ups')}
              className={`px-6 py-2 font-medium text-sm transition-colors duration-200 ${activeTab === 'follow-ups' ? 'border-b-2 border-emerald-600 text-emerald-700' : 'text-stone-500 hover:text-emerald-600'}`}
            >
              Follow-Ups
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`px-6 py-2 font-medium text-sm transition-colors duration-200 ${activeTab === 'payments' ? 'border-b-2 border-emerald-600 text-emerald-700' : 'text-stone-500 hover:text-emerald-600'}`}
            >
              Payments
            </button>
          </div>

          {activeTab === 'profile' && (
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
                        <label className="text-sm font-medium text-stone-500">Date of Birth</label>
                        <p className="text-stone-700">{patient.dob || "N/A"}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-stone-500">Phone</label>
                        <p className="text-stone-700">{patient.phoneNumber}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-stone-500">Height</label>
                        <p className="text-stone-700">{patient.height ? `${patient.height} cm` : "N/A"}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-stone-500">Weight</label>
                        <p className="text-stone-700">{patient.weight ? `${patient.weight} kg` : "N/A"}</p>
                      </div>
                      <div className="col-span-2">
                        <label className="text-sm font-medium text-stone-500">Address</label>
                        <p className="text-stone-700">{patient.address}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-stone-500">Job</label>
                        <p className="text-stone-700">{patient.job || "N/A"}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-stone-500">Reference</label>
                        <p className="text-stone-700">{patient.reference || "N/A"}</p>
                      </div>
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

              {/* Ayurvedic Assessment - Patient Profile */}
              <div className="border-amber-200 rounded-lg border bg-white p-6 shadow-sm">
                <div className="border-b border-amber-100 bg-gradient-to-r from-teal-50 to-emerald-50 p-4 -m-6 mb-6 rounded-t-lg">
                  <h3 className="text-stone-800 font-semibold">Ayurvedic Profile</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-stone-500">Nadi Parikshan</label>
                    <div className="text-stone-700 whitespace-pre-wrap prose prose-stone max-w-none" dangerouslySetInnerHTML={{ __html: formatDisplayHtml(patient.nadiParikshan) }} />
                  </div>
                  <div className="md:col-span-1">
                    <label className="text-sm font-medium text-stone-500">Condition (Lakshana)</label>
                    <div className="text-stone-700 whitespace-pre-wrap prose prose-stone max-w-none" dangerouslySetInnerHTML={{ __html: formatDisplayHtml(patient.condition) }} />
                  </div>
                  <div className="md:col-span-1">
                    <label className="text-sm font-medium text-stone-500">History</label>
                    <div className="text-stone-700 whitespace-pre-wrap prose prose-stone max-w-none" dangerouslySetInnerHTML={{ __html: formatDisplayHtml(patient.history) }} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-stone-500">Parikshan (General Assessment)</label>
                    <div className="text-stone-700 whitespace-pre-wrap prose prose-stone max-w-none" dangerouslySetInnerHTML={{ __html: formatDisplayHtml(patient.parikshan) }} />
                  </div>
                  <div className="md:col-span-1">
                    <label className="text-sm font-medium text-stone-500">Treatment Plan (Ayurvedic)</label>
                    <div className="text-stone-700 whitespace-pre-wrap prose prose-stone max-w-none" dangerouslySetInnerHTML={{ __html: formatDisplayHtml(patient.treatmentPlan) }} />
                  </div>
                  <div className="md:col-span-1 space-y-4">
                    <div>
                      <label className="text-sm font-medium text-stone-500">Treatment Days</label>
                      <p className="text-stone-700 font-semibold">{patient.treatment_days ? `${patient.treatment_days} Days` : "N/A"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-stone-500">Status</label>
                      <div className="mt-1">
                        <span className={`inline-block rounded-full px-3 py-0.5 text-xs font-medium ${patient.status === "Active" ? "bg-emerald-100 text-emerald-700" : patient.status === "Under Treatment" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"}`}>
                          {patient.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Panchakarma Therapies */}
              <div className="border-amber-200 rounded-lg border bg-white p-6 shadow-sm">
                <div className="border-b border-amber-100 bg-gradient-to-r from-orange-50 to-amber-50 p-4 -m-6 mb-6 rounded-t-lg">
                  <h3 className="text-stone-800 font-semibold">Panchakarma Therapies</h3>
                </div>
                {!patient.panchakarmaTherapies || patient.panchakarmaTherapies.length === 0 ? (
                  <p className="text-stone-500 italic">No Panchakarma therapies recorded.</p>
                ) : (
                  <div className="space-y-4">
                    {patient.panchakarmaTherapies.map((therapy, idx) => (
                      <div key={idx} className="border border-amber-100 rounded-md p-4 bg-amber-50/20">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          <div>
                            <label className="text-xs font-medium text-stone-500 uppercase">Therapy</label>
                            <p className="font-semibold text-stone-800">{therapy.name}</p>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-stone-500 uppercase">Duration</label>
                            <p className="text-stone-700">{therapy.duration}</p>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-stone-500 uppercase">Schedule</label>
                            <p className="text-stone-700">{therapy.schedule}</p>
                          </div>
                        </div>
                        {therapy.notes && (
                          <div className="mt-2 pt-2 border-t border-amber-50">
                            <label className="text-xs font-medium text-stone-500 uppercase">Notes</label>
                            <p className="text-sm text-stone-700">{therapy.notes}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Extra Procedures */}
              <div className="border-amber-200 rounded-lg border bg-white p-6 shadow-sm">
                <div className="border-b border-amber-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 -m-6 mb-6 rounded-t-lg">
                  <h3 className="text-stone-800 font-semibold">Extra Procedures</h3>
                </div>
                {!patient.extraProcedures || patient.extraProcedures.length === 0 ? (
                  <p className="text-stone-500 italic">No extra procedures recorded.</p>
                ) : (
                  <div className="space-y-4">
                    {patient.extraProcedures.map((proc, idx) => (
                      <div key={idx} className="border border-indigo-100 rounded-md p-4 bg-indigo-50/20">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          <div>
                            <label className="text-xs font-medium text-stone-500 uppercase">Procedure</label>
                            <p className="font-semibold text-stone-800">{proc.name}</p>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-stone-500 uppercase">Purpose</label>
                            <p className="text-stone-700">{proc.purpose}</p>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-stone-500 uppercase">Frequency</label>
                            <p className="text-stone-700">{proc.durationFrequency}</p>
                          </div>
                        </div>
                        {proc.remarks && (
                          <div className="mt-2 pt-2 border-t border-indigo-50">
                            <label className="text-xs font-medium text-stone-500 uppercase">Remarks</label>
                            <p className="text-sm text-stone-700">{proc.remarks}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Appointment History */}
              <div className="border-amber-200 rounded-lg border bg-white p-6 shadow-sm">
                <div className="border-b border-amber-100 bg-gradient-to-r from-amber-50 to-teal-50 p-4 -m-6 mb-6 rounded-t-lg">
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
            </div>
          )}

          {activeTab === 'follow-ups' && (
            <div className="space-y-6">
              <FollowUpTabContent
                patientId={params.id}
                followUps={followUps}
                onFollowUpAdded={async () => {
                  const data = await queryDocuments<FollowUp>(COLLECTIONS.FOLLOW_UPS, [where('patientId', '==', params.id)]);
                  setFollowUps(data);
                }}
              />
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="space-y-6">
              <PaymentTabContent patientId={params.id} payments={payments} onPaymentAdded={() => {
                queryDocuments<Payment>(COLLECTIONS.PAYMENTS, [where('patientId', '==', params.id)])
                  .then(setPayments);
              }} onEditPayment={handleEditPaymentClick} onDeletePayment={handleDeletePaymentClick} />
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

      {showEditPayment && editingPayment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-4">Edit Payment</h3>
            <div className="space-y-4">
              <div><Label className="text-sm font-medium">Date</Label><Input type="date" value={editPaymentForm.date} onChange={e => setEditPaymentForm({...editPaymentForm, date: e.target.value})} className="mt-1" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label className="text-sm font-medium">Consulting Fee</Label><Input type="number" value={editPaymentForm.consultingFee} onChange={e => setEditPaymentForm({...editPaymentForm, consultingFee: parseInt(e.target.value) || 0})} className="mt-1" /></div>
                <div><Label className="text-sm font-medium">Medicine Charges</Label><Input type="number" value={editPaymentForm.medicineCharges} onChange={e => setEditPaymentForm({...editPaymentForm, medicineCharges: parseInt(e.target.value) || 0})} className="mt-1" /></div>
                <div><Label className="text-sm font-medium">Extra Charges</Label><Input type="number" value={editPaymentForm.extraCharges} onChange={e => setEditPaymentForm({...editPaymentForm, extraCharges: parseInt(e.target.value) || 0})} className="mt-1" /></div>
                <div><Label className="text-sm font-medium">Procedure Charges</Label><Input type="number" value={editPaymentForm.procedureCharges} onChange={e => setEditPaymentForm({...editPaymentForm, procedureCharges: parseInt(e.target.value) || 0})} className="mt-1" /></div>
                <div><Label className="text-sm font-medium">Panchakarma</Label><Input type="number" value={editPaymentForm.panchakarmaCharges} onChange={e => setEditPaymentForm({...editPaymentForm, panchakarmaCharges: parseInt(e.target.value) || 0})} className="mt-1" /></div>
                <div><Label className="text-sm font-medium">Paid Amount</Label><Input type="number" value={editPaymentForm.paidAmount} onChange={e => setEditPaymentForm({...editPaymentForm, paidAmount: parseInt(e.target.value) || 0})} className="mt-1" /></div>
              </div>
              <div><Label className="text-sm font-medium">Notes</Label><Input value={editPaymentForm.notes} onChange={e => setEditPaymentForm({...editPaymentForm, notes: e.target.value})} className="mt-1" placeholder="Optional notes..." /></div>
              <div className="bg-stone-100 p-3 rounded-md">
                <div className="flex justify-between text-sm"><span>Total:</span><span className="font-bold">₹{editTotal}</span></div>
                <div className="flex justify-between text-sm"><span>Balance:</span><span className={`font-bold ${editBalance > 0 ? 'text-red-600' : 'text-emerald-600'}`}>₹{editBalance}</span></div>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button variant="outline" onClick={() => setShowEditPayment(false)} className="flex-1">Cancel</Button>
              <Button onClick={handleSavePayment} className="flex-1">Save</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FollowUpTabContent({ patientId, followUps, onFollowUpAdded }: { patientId: string, followUps: FollowUp[], onFollowUpAdded: () => void }) {
  const [view, setView] = useState<'details' | 'add'>('add');
  const [selectedFollowUp, setSelectedFollowUp] = useState<FollowUp | null>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
    nadiParikshan: '',
    lakshan: '',
    generalAssessment: '',
    paymentAmount: 0,
    notes: '',
    treatmentPlan: '',
    treatment_days: undefined as number | undefined,
    history: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const followUpData: Omit<FollowUp, 'id' | 'createdAt' | 'updatedAt'> = {
        patientId,
        ...formData,
        status: 'Completed',
        reason: 'Follow-up'
      };
      await createDocument(COLLECTIONS.FOLLOW_UPS, followUpData);
      onFollowUpAdded();
      setFormData({
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
        nadiParikshan: '',
        lakshan: '',
        generalAssessment: '',
        paymentAmount: 0,
        notes: '',
        treatmentPlan: '',
        treatment_days: undefined,
        history: ''
      });
      alert('Follow-up recorded successfully');
    } catch (error) {
      console.error("Error adding follow-up:", error);
      alert('Failed to add follow-up');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Sidebar: Follow-Up History List */}
      <div className="lg:col-span-1 space-y-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold text-stone-800">History</h3>
          <button
            onClick={() => setView('add')}
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-100"
          >
            + New Follow-Up
          </button>
        </div>
        <div className="border-amber-200 rounded-lg border bg-white shadow-sm overflow-hidden h-fit max-h-[600px] overflow-y-auto">
          {followUps.length === 0 ? (
            <div className="p-4 text-center bg-stone-50/50">
              <p className="text-xs text-stone-500 italic">No records.</p>
            </div>
          ) : (
            <div className="divide-y divide-stone-100">
              {[...followUps].sort((a, b) => new Date(b.date + 'T' + (b.time || '00:00')).getTime() - new Date(a.date + 'T' + (a.time || '00:00')).getTime()).map((followUp: FollowUp) => (
                <div
                  key={followUp.id}
                  onClick={() => { setSelectedFollowUp(followUp); setView('details'); }}
                  className={`p-3 cursor-pointer transition-colors ${selectedFollowUp?.id === followUp.id ? 'bg-emerald-50 border-l-4 border-emerald-500' : 'hover:bg-amber-50/30'}`}
                >
                  <p className="font-bold text-sm text-stone-800">{followUp.date}</p>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-stone-500">{followUp.time || '--:--'}</span>
                    <span className="text-xs font-semibold text-emerald-600">₹{followUp.paymentAmount || 0}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content: Form or Details */}
      <div className="lg:col-span-2">
        {view === 'add' ? (
          <div className="border-amber-200 rounded-lg border bg-white p-6 shadow-sm">
            <div className="border-b border-amber-100 bg-gradient-to-r from-emerald-50 to-teal-50 p-4 -m-6 mb-6 rounded-t-lg">
              <h3 className="text-stone-800 font-semibold">Log New Follow-Up</h3>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-stone-500">Date</label>
                  <input type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-emerald-500" required />
                </div>
                <div>
                  <label className="text-xs font-medium text-stone-500">Time</label>
                  <input type="time" value={formData.time} onChange={e => setFormData({ ...formData, time: e.target.value })} className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-emerald-500" required />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="text-xs font-medium text-stone-500">Nadi Parikshan</label>
                  <RichTextEditor value={formData.nadiParikshan || ""} onChange={val => setFormData({ ...formData, nadiParikshan: val })} placeholder="Nadi details..." className="mt-1" />
                </div>
                <div className="md:col-span-1">
                  <label className="text-xs font-medium text-stone-500">Lakshan</label>
                  <RichTextEditor value={formData.lakshan || ""} onChange={val => setFormData({ ...formData, lakshan: val })} placeholder="Symptoms and signs..." className="mt-1" />
                </div>
                <div className="md:col-span-1">
                  <label className="text-xs font-medium text-stone-500">History</label>
                  <RichTextEditor value={formData.history || ""} onChange={val => setFormData({ ...formData, history: val })} placeholder="Past treatment notes..." className="mt-1" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-medium text-stone-500">General Assessment (Parikshan)</label>
                  <RichTextEditor value={formData.generalAssessment || ""} onChange={val => setFormData({ ...formData, generalAssessment: val })} placeholder="General assessment details..." className="mt-1" />
                </div>
                <div className="md:col-span-1">
                  <label className="text-xs font-medium text-stone-500">Treatment Plan (Ayurvedic)</label>
                  <RichTextEditor value={formData.treatmentPlan || ""} onChange={val => setFormData({ ...formData, treatmentPlan: val })} placeholder="Treatment plan details..." className="mt-1" />
                </div>
                <div className="md:col-span-1">
                  <label className="text-xs font-medium text-stone-500">Treatment Days</label>
                  <input type="number" value={formData.treatment_days || ""} onChange={e => setFormData({ ...formData, treatment_days: parseInt(e.target.value) || undefined })} className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-emerald-500" placeholder="Number of days" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-stone-500">Notes / Treatment</label>
                <RichTextEditor value={formData.notes || ""} onChange={val => setFormData({ ...formData, notes: val })} placeholder="Any specific details..." className="mt-1" />
              </div>
              <div className="w-1/2">
                <label className="text-xs font-medium text-stone-500">Payment (₹)</label>
                <input type="number" value={formData.paymentAmount} onChange={e => setFormData({ ...formData, paymentAmount: Number(e.target.value) })} className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-emerald-500" />
              </div>
              <div className="flex justify-end pt-2">
                <button type="submit" disabled={loading} className="rounded-md bg-emerald-600 px-6 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50 transition-all">
                  {loading ? "Saving..." : "Save Follow-Up"}
                </button>
              </div>
            </form>
          </div>
        ) : selectedFollowUp ? (
          <div className="border-amber-200 rounded-lg border bg-white p-6 shadow-sm">
            <div className="border-b border-amber-100 bg-gradient-to-r from-amber-50 to-orange-50 p-4 -m-6 mb-6 rounded-t-lg flex justify-between items-center">
              <h3 className="text-stone-800 font-semibold">Entry Details - {selectedFollowUp.date}</h3>
              <button
                onClick={() => setView('add')}
                className="text-stone-500 hover:text-stone-700 text-sm font-medium border border-stone-300 px-3 py-1 rounded bg-white shadow-sm"
              >
                Back to New Entry
              </button>
            </div>
            <div className="space-y-6 pt-2">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">Date & Time</p>
                  <p className="font-semibold text-stone-800">{selectedFollowUp.date} at {selectedFollowUp.time}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">Payment</p>
                  <p className="font-bold text-emerald-600 text-lg">₹{selectedFollowUp.paymentAmount || 0}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-amber-50/30 p-4 rounded-md border border-amber-100 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="text-xs font-semibold text-amber-800 uppercase">Nadi Parikshan</label>
                      <div className="text-sm text-stone-800 bg-white p-2 rounded mt-1 border border-amber-50 prose prose-stone max-w-none" dangerouslySetInnerHTML={{ __html: formatDisplayHtml(selectedFollowUp.nadiParikshan) }} />
                    </div>
                    <div className="md:col-span-1">
                      <label className="text-xs font-semibold text-amber-800 uppercase">Lakshan</label>
                      <div className="text-sm text-stone-800 bg-white p-2 rounded mt-1 border border-amber-50 prose prose-stone max-w-none" dangerouslySetInnerHTML={{ __html: formatDisplayHtml(selectedFollowUp.lakshan) }} />
                    </div>
                    <div className="md:col-span-1">
                      <label className="text-xs font-semibold text-amber-800 uppercase">History</label>
                      <div className="text-sm text-stone-800 bg-white p-2 rounded mt-1 border border-amber-50 prose prose-stone max-w-none" dangerouslySetInnerHTML={{ __html: formatDisplayHtml(selectedFollowUp.history) }} />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs font-semibold text-amber-800 uppercase">General Assessment</label>
                      <div className="text-sm text-stone-800 bg-white p-2 rounded mt-1 border border-amber-50 prose prose-stone max-w-none" dangerouslySetInnerHTML={{ __html: formatDisplayHtml(selectedFollowUp.generalAssessment) }} />
                    </div>
                    <div className="md:col-span-1">
                      <label className="text-xs font-semibold text-amber-800 uppercase">Treatment Plan (Ayurvedic)</label>
                      <div className="text-sm text-stone-800 bg-white p-2 rounded mt-1 border border-amber-50 prose prose-stone max-w-none" dangerouslySetInnerHTML={{ __html: formatDisplayHtml(selectedFollowUp.treatmentPlan) }} />
                    </div>
                    <div className="md:col-span-1">
                      <label className="text-xs font-semibold text-amber-800 uppercase">Treatment Days</label>
                      <p className="text-sm text-stone-800 bg-white p-2 rounded mt-1 border border-amber-50 font-semibold">{selectedFollowUp.treatment_days ? `${selectedFollowUp.treatment_days} Days` : 'N/A'}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-emerald-50/30 p-4 rounded-md border border-emerald-100">
                  <label className="text-xs font-semibold text-emerald-800 uppercase">Notes & Treatment</label>
                  <div className="text-sm text-stone-800 bg-white p-3 rounded mt-1 border border-emerald-50 prose prose-stone max-w-none" dangerouslySetInnerHTML={{ __html: formatDisplayHtml(selectedFollowUp.notes) }} />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center p-12 border-2 border-dashed border-stone-200 rounded-lg">
            <p className="text-stone-500">Select a follow-up from the history list to view details.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function PaymentTabContent({ patientId, payments, onPaymentAdded, onEditPayment, onDeletePayment }: { patientId: string, payments: Payment[], onPaymentAdded: () => void, onEditPayment?: (p: Payment) => void, onDeletePayment?: (p: Payment) => void }) {
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
            <label className="text-xs font-medium text-stone-500">Extra Charges (₹)</label>
            <input type="number" value={formData.extraCharges} onChange={e => setFormData({ ...formData, extraCharges: Number(e.target.value) })} className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="text-xs font-medium text-stone-500">Procedure Charges (₹)</label>
            <input type="number" value={formData.procedureCharges} onChange={e => setFormData({ ...formData, procedureCharges: Number(e.target.value) })} className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="text-xs font-medium text-stone-500">Panchakarma (₹)</label>
            <input type="number" value={formData.panchakarmaCharges} onChange={e => setFormData({ ...formData, panchakarmaCharges: Number(e.target.value) })} className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-emerald-500" />
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
                  <th className="px-4 py-2 text-left text-xs font-semibold text-stone-500 uppercase whitespace-nowrap">Date of Pay</th>
                  <th className="px-4 py-2 text-right text-xs font-semibold text-stone-500 uppercase whitespace-nowrap">Consulting Fee</th>
                  <th className="px-4 py-2 text-right text-xs font-semibold text-stone-500 uppercase whitespace-nowrap">Medicine Fee</th>
                  <th className="px-4 py-2 text-right text-xs font-semibold text-stone-500 uppercase whitespace-nowrap">Extra Fee</th>
                  <th className="px-4 py-2 text-right text-xs font-semibold text-stone-500 uppercase whitespace-nowrap">Procedure Charge</th>
                  <th className="px-4 py-2 text-right text-xs font-semibold text-stone-500 uppercase whitespace-nowrap">Panchakarma Charge</th>
                  <th className="px-4 py-2 text-right text-xs font-semibold text-stone-500 uppercase whitespace-nowrap">Total Fee</th>
                  <th className="px-4 py-2 text-right text-xs font-semibold text-stone-500 uppercase whitespace-nowrap">Paid Fee</th>
                  <th className="px-4 py-2 text-right text-xs font-semibold text-stone-500 uppercase whitespace-nowrap">Balance Fee</th>
                  <th className="px-4 py-2 text-center text-xs font-semibold text-stone-500 uppercase whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-stone-100">
                {[...payments].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((p: Payment) => (
                  <tr key={p.id}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-stone-700 font-medium">{p.date}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-stone-700 text-right">₹{p.consultingFee || 0}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-stone-700 text-right">₹{p.medicineCharges || 0}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-stone-700 text-right">₹{p.extraCharges || 0}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-stone-700 text-right">₹{p.procedureCharges || 0}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-stone-700 text-right">₹{p.panchakarmaCharges || 0}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-stone-800 text-right font-bold">₹{p.totalAmount || 0}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-emerald-600 text-right font-bold">₹{p.paidAmount || 0}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-red-600 text-right font-bold">₹{p.balanceAmount || 0}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-center">
                      <div className="flex gap-1 justify-center">
                        <button onClick={() => onEditPayment?.(p)} className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors" title="Edit"><Edit className="h-4 w-4" /></button>
                        <button onClick={() => onDeletePayment?.(p)} className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors" title="Delete"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
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

