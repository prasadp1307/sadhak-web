import { notFound } from 'next/navigation';

export function generateStaticParams() {
  // Mock patient IDs for static generation
  const patientIds = ['1', '2', '3', '4', '5'];
  return patientIds.map((id) => ({
    id: id,
  }));
}

export default function EditPatientPage({ params }: { params: { id: string } }) {
  // Mock patient data
  const mockPatients = [
    { id: 1, name: "Rajesh Kumar", age: 45, address: "123 MG Road, Bangalore", phoneNumber: "+91-9876543210", job: "Engineer", reference: "Dr. Sharma", symptoms: "Pain in knees and elbows", treatmentPlan: "Abhyanga and herbal supplements", payment: "₹500", lastVisit: "2025-01-15", status: "Active" },
    { id: 2, name: "Priya Sharma", age: 32, address: "456 Brigade Road, Bangalore", phoneNumber: "+91-9876543211", job: "Teacher", reference: "Online Search", symptoms: "Bloating and indigestion", treatmentPlan: "Triphala and dietary changes", payment: "₹400", lastVisit: "2025-01-14", status: "Active" },
    { id: 3, name: "Amit Patel", age: 58, address: "789 Residency Road, Bangalore", phoneNumber: "+91-9876543212", job: "Businessman", reference: "Friend", symptoms: "High blood pressure", treatmentPlan: "Rasayana therapy", payment: "₹600", lastVisit: "2025-01-13", status: "Follow-up" },
    { id: 4, name: "Lakshmi Reddy", age: 28, address: "321 Commercial Street, Bangalore", phoneNumber: "+91-9876543213", job: "Doctor", reference: "Hospital", symptoms: "Insomnia and restlessness", treatmentPlan: "Ashwagandha and meditation", payment: "₹450", lastVisit: "2025-01-12", status: "Active" },
    { id: 5, name: "Vikram Singh", age: 50, address: "654 Jayanagar, Bangalore", phoneNumber: "+91-9876543214", job: "Lawyer", reference: "Colleague", symptoms: "Back pain and stiffness", treatmentPlan: "Kati Basti and yoga", payment: "₹550", lastVisit: "2025-01-11", status: "Active" },
  ];

  const patientId = parseInt(params.id);
  const patient = mockPatients.find(p => p.id === patientId);

  if (!patient) {
    notFound();
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

          <form className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="border-amber-200 rounded-lg border bg-white p-6 shadow-sm">
                <div className="border-b border-amber-100 bg-gradient-to-r from-emerald-50 to-teal-50 p-4 -m-6 mb-6 rounded-t-lg">
                  <h3 className="text-stone-800 font-semibold">Basic Information</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-stone-700">Name</label>
                    <input type="text" defaultValue={patient.name} className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700">Age</label>
                    <input type="number" defaultValue={patient.age} className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700">Address</label>
                    <input type="text" defaultValue={patient.address} className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700">Phone Number</label>
                    <input type="text" defaultValue={patient.phoneNumber} className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700">Job</label>
                    <input type="text" defaultValue={patient.job} className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700">Reference</label>
                    <input type="text" defaultValue={patient.reference} className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500" />
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
                    <textarea defaultValue={patient.symptoms} rows={3} className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700">Treatment Plan</label>
                    <textarea defaultValue={patient.treatmentPlan} rows={3} className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700">Payment</label>
                    <input type="text" defaultValue={patient.payment} className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700">Last Visit</label>
                    <input type="date" defaultValue={patient.lastVisit} className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-700">Status</label>
                    <select defaultValue={patient.status} className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500">
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
                  <textarea rows={3} placeholder="Pulse diagnosis details..." className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700">Condition (Lakshana)</label>
                  <textarea rows={3} placeholder="Symptoms and signs..." className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700">H/O</label>
                  <textarea rows={3} placeholder="History of present illness..." className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700">Treatment</label>
                  <textarea rows={3} placeholder="Prescribed treatment..." className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700">Parikshan</label>
                  <select className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500">
                    <option value="">Select Parikshan</option>
                    <option value="mal">Mal (Stool)</option>
                    <option value="mutra">Mutra (Urine)</option>
                    <option value="ksudha">Ksudha (Appetite)</option>
                    <option value="jivha">Jivha (Tongue)</option>
                    <option value="nidra">Nidra (Sleep)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button type="button" className="rounded-md border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 shadow-sm hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2">
                Cancel
              </button>
              <button type="submit" className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
