import Link from 'next/link';

export function generateStaticParams() {
  // Mock patient IDs for static generation
  const patientIds = ['1', '2', '3', '4', '5'];
  return patientIds.map((id) => ({
    id: id,
  }));
}

export default function PatientDetailsPage({ params }: { params: { id: string } }) {
  // Mock patient data for static generation
  const mockPatients = [
    { id: 1, name: "Rajesh Kumar", age: 45, address: "123 MG Road, Bangalore", phoneNumber: "+91-9876543210", job: "Engineer", reference: "Dr. Sharma", symptoms: "Pain in knees and elbows", treatmentPlan: "Abhyanga and herbal supplements", payment: "₹500", lastVisit: "2025-01-15", status: "Active", nadiParikshan: "Not provided", condition: "Not provided", ho: "Not provided", treatment: "Not provided", parikshan: "Not provided" },
    { id: 2, name: "Priya Sharma", age: 32, address: "456 Brigade Road, Bangalore", phoneNumber: "+91-9876543211", job: "Teacher", reference: "Online Search", symptoms: "Bloating and indigestion", treatmentPlan: "Triphala and dietary changes", payment: "₹400", lastVisit: "2025-01-14", status: "Active", nadiParikshan: "Not provided", condition: "Not provided", ho: "Not provided", treatment: "Not provided", parikshan: "Not provided" },
    { id: 3, name: "Amit Patel", age: 58, address: "789 Residency Road, Bangalore", phoneNumber: "+91-9876543212", job: "Businessman", reference: "Friend", symptoms: "High blood pressure", treatmentPlan: "Rasayana therapy", payment: "₹600", lastVisit: "2025-01-13", status: "Follow-up", nadiParikshan: "Not provided", condition: "Not provided", ho: "Not provided", treatment: "Not provided", parikshan: "Not provided" },
    { id: 4, name: "Lakshmi Reddy", age: 28, address: "321 Commercial Street, Bangalore", phoneNumber: "+91-9876543213", job: "Doctor", reference: "Hospital", symptoms: "Insomnia and restlessness", treatmentPlan: "Ashwagandha and meditation", payment: "₹450", lastVisit: "2025-01-12", status: "Active", nadiParikshan: "Not provided", condition: "Not provided", ho: "Not provided", treatment: "Not provided", parikshan: "Not provided" },
  ];

  const patientId = parseInt(params.id);
  const patient = mockPatients.find(p => p.id === patientId);

  if (!patient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50/40 to-emerald-50/60 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-stone-800">Patient Not Found</h1>
          <p className="text-stone-600">The requested patient could not be found.</p>
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
                  <p className="font-semibold text-emerald-700">{patient.payment}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-stone-700">Last Visit</label>
                  <p className="text-stone-700">{patient.lastVisit}</p>
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

          <div className="flex justify-end space-x-4">
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
