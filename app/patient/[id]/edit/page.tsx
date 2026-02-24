"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getDocument, updateDocument, createDocument, queryDocuments, deleteDocument, COLLECTIONS, Patient, FollowUp } from '@/lib/firestore-service';
import { where } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

export default function EditPatientPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [newFollowUp, setNewFollowUp] = useState({
    date: new Date().toISOString().split('T')[0],
    reason: "",
    notes: "",
    status: "Pending" as const
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [data, followUpsData] = await Promise.all([
          getDocument<Patient>(COLLECTIONS.PATIENTS, params.id),
          queryDocuments<FollowUp>(COLLECTIONS.FOLLOW_UPS, [where('patientId', '==', params.id)])
        ]);
        setPatient(data);
        setFollowUps(followUpsData);
      } catch (error) {
        console.error("Error fetching patient details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [params.id]);

  const handleDeleteFollowUp = async (followUpId: string) => {
    if (window.confirm("Are you sure you want to delete this follow-up record?")) {
      try {
        await deleteDocument(COLLECTIONS.FOLLOW_UPS, followUpId);
        setFollowUps(followUps.filter(f => f.id !== followUpId));
      } catch (error) {
        console.error("Error deleting follow-up:", error);
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patient) return;

    setSaving(true);
    try {
      await updateDocument(COLLECTIONS.PATIENTS, params.id, patient);

      // Update existing follow-ups that were pending and might have been edited
      const updatePromises = followUps.map(f =>
        updateDocument(COLLECTIONS.FOLLOW_UPS, f.id, {
          notes: f.notes,
          reason: f.reason,
          status: f.status
        })
      );
      await Promise.all(updatePromises);

      if (newFollowUp.reason || newFollowUp.notes) {
        const followUpData: Omit<FollowUp, 'id' | 'createdAt' | 'updatedAt'> = {
          patientId: params.id,
          date: newFollowUp.date,
          reason: newFollowUp.reason,
          notes: newFollowUp.notes,
          status: newFollowUp.status
        };
        await createDocument(COLLECTIONS.FOLLOW_UPS, followUpData);
      }

      router.push(`/patient/${params.id}`);
    } catch (error) {
      console.error("Error updating patient:", error);
      alert("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
        <p className="mt-4 text-stone-600">Loading patient data...</p>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-stone-800">Patient Not Found</h1>
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
                <p className="text-xs font-medium tracking-wide text-amber-700">Edit Patient</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="p-6">
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-stone-800">Edit Patient Details</h2>
              <p className="text-stone-600">Patient ID: #{patient.id}</p>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSave}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="border-amber-200 rounded-lg border bg-white p-6 shadow-sm">
                <div className="border-b border-amber-100 bg-gradient-to-r from-emerald-50 to-teal-50 p-4 -m-6 mb-6 rounded-t-lg">
                  <h3 className="text-stone-800 font-semibold">Basic Information</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-700">Name</label>
                    <input type="text" value={patient.name} onChange={e => setPatient({ ...patient, name: e.target.value })} className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700">Age</label>
                    <input type="number" value={patient.age} onChange={e => setPatient({ ...patient, age: parseInt(e.target.value) || 0 })} className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700">Date of Birth</label>
                    <input type="date" value={patient.dob || ""} onChange={e => setPatient({ ...patient, dob: e.target.value })} className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700">Address</label>
                    <input type="text" value={patient.address} onChange={e => setPatient({ ...patient, address: e.target.value })} className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700">Phone Number</label>
                    <input type="text" value={patient.phoneNumber} onChange={e => setPatient({ ...patient, phoneNumber: e.target.value })} className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700">Job</label>
                    <input type="text" value={patient.job} onChange={e => setPatient({ ...patient, job: e.target.value })} className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700">Reference</label>
                    <input type="text" value={patient.reference} onChange={e => setPatient({ ...patient, reference: e.target.value })} className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500" />
                  </div>
                </div>
              </div>

              <div className="border-amber-200 rounded-lg border bg-white p-6 shadow-sm">
                <div className="border-b border-amber-100 bg-gradient-to-r from-amber-50 to-orange-50 p-4 -m-6 mb-6 rounded-t-lg">
                  <h3 className="text-stone-800 font-semibold">Medical Details</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-700">Symptoms</label>
                    <textarea value={patient.symptoms || ""} onChange={e => setPatient({ ...patient, symptoms: e.target.value })} rows={3} className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700">Treatment Plan</label>
                    <textarea value={patient.treatmentPlan || ""} onChange={e => setPatient({ ...patient, treatmentPlan: e.target.value })} rows={3} className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-700">Last Visit</label>
                    <input type="date" value={patient.lastVisit || ""} onChange={e => setPatient({ ...patient, lastVisit: e.target.value })} className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700">Next Appointment (Optional)</label>
                    <input type="date" value={patient.nextAppointmentDate || ""} onChange={e => setPatient({ ...patient, nextAppointmentDate: e.target.value })} className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-700">Status</label>
                    <select value={patient.status} onChange={e => setPatient({ ...patient, status: e.target.value })} className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500">
                      <option value="Active">Active</option>
                      <option value="Follow-up">Follow-up</option>
                      <option value="Inactive">Inactive</option>
                    </select>
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
                  <label className="block text-sm font-medium text-stone-700">Nadi Parikshan</label>
                  <textarea value={patient.nadiParikshan || ""} onChange={e => setPatient({ ...patient, nadiParikshan: e.target.value })} rows={3} placeholder="Pulse diagnosis details..." className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700">Condition (Lakshana)</label>
                  <textarea value={patient.condition || ""} onChange={e => setPatient({ ...patient, condition: e.target.value })} rows={3} placeholder="Symptoms and signs..." className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700">H/O</label>
                  <textarea value={patient.ho || ""} onChange={e => setPatient({ ...patient, ho: e.target.value })} rows={3} placeholder="History of present illness..." className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700">Treatment Details</label>
                  <textarea value={patient.treatment || ""} onChange={e => setPatient({ ...patient, treatment: e.target.value })} rows={3} placeholder="Prescribed treatment in depth..." className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700">General Assessment (Parikshan)</label>
                  <textarea value={patient.parikshan || ""} onChange={e => setPatient({ ...patient, parikshan: e.target.value })} rows={3} placeholder="Mal (Stool), Mutra (Urine), Ksudha (Appetite), Jivha (Tongue), Nidra (Sleep) notes..." className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500" />
                </div>
              </div>
            </div>

            {followUps.length > 0 && (
              <div className="border-amber-200 rounded-lg border bg-white p-6 shadow-sm">
                <div className="border-b border-amber-100 bg-gradient-to-r from-orange-50 to-amber-50 p-4 -m-6 mb-6 rounded-t-lg">
                  <h3 className="text-stone-800 font-semibold">Existing Follow-Ups</h3>
                </div>
                <div className="space-y-6">
                  {followUps.map(followUp => (
                    <div key={followUp.id} className="border border-amber-100 rounded-md p-4 bg-amber-50/30">
                      {followUp.status === "Completed" ? (
                        <>
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <span className="font-semibold text-stone-800 text-sm">{new Date(followUp.date).toLocaleDateString()}</span>
                              <p className="text-sm text-stone-700 mt-1">Reason: <span className="font-medium text-stone-800">{followUp.reason}</span></p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="inline-block rounded-full px-2 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-700">
                                Completed
                              </span>
                              <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500 hover:bg-red-50 hover:text-red-700" onClick={() => handleDeleteFollowUp(followUp.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm text-stone-600 bg-white p-2 rounded border border-stone-200 mt-2">{followUp.notes || "No notes."}</p>
                        </>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-stone-800 text-sm">{new Date(followUp.date).toLocaleDateString()} (Pending)</span>
                            <div className="flex items-center space-x-2">
                              <label className="text-sm text-stone-700">Status:</label>
                              <select
                                value={followUp.status}
                                onChange={e => setFollowUps(followUps.map(f => f.id === followUp.id ? { ...f, status: e.target.value as any } : f))}
                                className="block rounded-md border border-stone-300 px-2 py-1 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500"
                              >
                                <option value="Pending">Pending</option>
                                <option value="Completed">Completed</option>
                              </select>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-700" onClick={() => handleDeleteFollowUp(followUp.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-stone-700">Reason</label>
                            <input type="text" value={followUp.reason} onChange={e => setFollowUps(followUps.map(f => f.id === followUp.id ? { ...f, reason: e.target.value } : f))} className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-1.5 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500" />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-stone-700">Notes</label>
                            <textarea value={followUp.notes} onChange={e => setFollowUps(followUps.map(f => f.id === followUp.id ? { ...f, notes: e.target.value } : f))} rows={2} className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-1.5 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500" />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="border-amber-200 rounded-lg border bg-white p-6 shadow-sm">
              <div className="border-b border-amber-100 bg-gradient-to-r from-orange-50 to-amber-50 p-4 -m-6 mb-6 rounded-t-lg">
                <h3 className="text-stone-800 font-semibold">Log New Follow-Up</h3>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-700">Follow-Up Date</label>
                    <input type="date" value={newFollowUp.date} onChange={e => setNewFollowUp({ ...newFollowUp, date: e.target.value })} className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700">Status</label>
                    <select value={newFollowUp.status} onChange={e => setNewFollowUp({ ...newFollowUp, status: e.target.value as any })} className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500">
                      <option value="Pending">Pending</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700">Reason for Follow-Up</label>
                  <input type="text" placeholder="e.g. Check blood pressure, Review medication" value={newFollowUp.reason} onChange={e => setNewFollowUp({ ...newFollowUp, reason: e.target.value })} className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700">Notes (Optional)</label>
                  <textarea value={newFollowUp.notes} onChange={e => setNewFollowUp({ ...newFollowUp, notes: e.target.value })} rows={2} placeholder="Any specific details..." className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500" />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button type="button" onClick={() => router.back()} className="rounded-md border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 shadow-sm hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2">
                Cancel
              </button>
              <button type="submit" disabled={saving} className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50">
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
