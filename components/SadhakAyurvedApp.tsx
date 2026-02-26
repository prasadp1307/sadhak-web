"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Users, ClipboardList, Leaf, Menu, X, Search, Bell, Settings, Plus, Eye, Edit, FileText, Activity, TrendingUp, Clock, Package, ChevronRight, LogOut, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { useAuth } from './AuthProvider';
import { logOut } from '../lib/auth';
import { useRouter } from 'next/navigation';
import { Patient, Appointment, Medicine, Treatment, Payment, COLLECTIONS, getAllDocuments, createDocument, deleteDocument } from '../lib/firestore-service';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

export default function SadhakAyurvedApp() {
  const { user } = useAuth();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");

  const handleLogout = async () => {
    try {
      await logOut();
      router.push('/auth');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Dynamic state for patients
  const [patients, setPatients] = useState<Patient[]>([]);

  // Dynamic state for appointments
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  // Dynamic state for payments
  const [payments, setPayments] = useState<Payment[]>([]);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientsData, appointmentsData, medicinesData, treatmentsData, paymentsData] = await Promise.all([
          getAllDocuments<Patient>(COLLECTIONS.PATIENTS),
          getAllDocuments<Appointment>(COLLECTIONS.APPOINTMENTS),
          getAllDocuments<Medicine>(COLLECTIONS.MEDICINES),
          getAllDocuments<Treatment>(COLLECTIONS.TREATMENTS),
          getAllDocuments<Payment>(COLLECTIONS.PAYMENTS)
        ]);
        setPatients(patientsData);
        setAppointments(appointmentsData);
        setMedicines(medicinesData);
        setTreatments(treatmentsData);
        setPayments(paymentsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // Dynamic state for medicines
  const [medicines, setMedicines] = useState<Medicine[]>([]);

  // Dynamic state for treatments
  const [treatments, setTreatments] = useState<Treatment[]>([]);

  // Form visibility states
  const [showAddPatientForm, setShowAddPatientForm] = useState(false);
  const [showAddAppointmentForm, setShowAddAppointmentForm] = useState(false);
  const [showAddMedicineForm, setShowAddMedicineForm] = useState(false);
  const [showAddTreatmentForm, setShowAddTreatmentForm] = useState(false);



  // Form input states
  const [newPatient, setNewPatient] = useState({ name: "", age: "", dob: "", address: "", phoneNumber: "", job: "", reference: "", symptoms: "", treatmentPlan: "" });

  const getTodayDate = () => new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD
  const getCurrentTimeRounded = () => {
    const d = new Date();
    d.setMinutes(Math.ceil(d.getMinutes() / 15) * 15);
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  };

  const [newAppointment, setNewAppointment] = useState({
    date: getTodayDate(),
    time: getCurrentTimeRounded(),
    patientId: "",
    patientName: "",
    type: "",
    duration: ""
  });
  const [newMedicine, setNewMedicine] = useState({ name: "", category: "", stock: "", price: "" });
  const [newTreatment, setNewTreatment] = useState({ name: "", description: "", duration: "", category: "" });

  // Payment states
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);
  const [paymentDetails, setPaymentDetails] = useState({
    consultingFee: 0,
    medicineCharges: 0,
    procedureCharges: 0,
    panchakarmaCharges: 0,
    extraCharges: 0,
    paidAmount: 0
  });

  const totalAmount = paymentDetails.consultingFee + paymentDetails.medicineCharges + paymentDetails.procedureCharges + paymentDetails.panchakarmaCharges + paymentDetails.extraCharges;
  const balanceAmount = totalAmount - paymentDetails.paidAmount;



  // Form handlers
  const handleAddPatient = async () => {
    if (newPatient.name && newPatient.age && newPatient.address && newPatient.phoneNumber) {
      try {
        const patientData = {
          name: newPatient.name,
          age: parseInt(newPatient.age),
          dob: newPatient.dob,
          address: newPatient.address,
          phoneNumber: newPatient.phoneNumber,
          job: newPatient.job,
          reference: newPatient.reference,
          lastVisit: new Date().toISOString().split('T')[0],
          status: "Active"
        };
        const newId = await createDocument(COLLECTIONS.PATIENTS, patientData);

        const newPatientObj: Patient = {
          id: newId,
          ...patientData,
          symptoms: newPatient.symptoms,
          treatmentPlan: newPatient.treatmentPlan,
        };

        setPatients([...patients, newPatientObj]);
        setNewPatient({ name: "", age: "", dob: "", address: "", phoneNumber: "", job: "", reference: "", symptoms: "", treatmentPlan: "" });
        setShowAddPatientForm(false);
      } catch (error) {
        console.error("Error adding patient:", error);
      }
    }
  };

  const handleAddAppointment = async () => {
    if (newAppointment.date && newAppointment.time && newAppointment.patientId && newAppointment.type && newAppointment.duration) {
      try {
        const appointmentData = {
          date: newAppointment.date,
          time: newAppointment.time,
          patientId: newAppointment.patientId,
          patientName: newAppointment.patientName,
          type: newAppointment.type,
          duration: newAppointment.duration,
          status: "Scheduled"
        };
        const newId = await createDocument(COLLECTIONS.APPOINTMENTS, appointmentData);

        const appointment: Appointment = {
          id: newId,
          ...appointmentData
        };

        setAppointments([...appointments, appointment]);
        setNewAppointment({ date: getTodayDate(), time: getCurrentTimeRounded(), patientId: "", patientName: "", type: "", duration: "" });
        setShowAddAppointmentForm(false);
      } catch (error) {
        console.error("Error scheduling appointment:", error);
      }
    }
  };

  const handleAddMedicine = async () => {
    if (newMedicine.name && newMedicine.category && newMedicine.stock && newMedicine.price) {
      try {
        const medicineData = {
          name: newMedicine.name,
          category: newMedicine.category,
          stock: parseInt(newMedicine.stock),
          lowStock: parseInt(newMedicine.stock) < 15,
          price: newMedicine.price
        };
        const newId = await createDocument(COLLECTIONS.MEDICINES, medicineData);
        setMedicines([...medicines, { id: newId, ...medicineData }]);
        setNewMedicine({ name: "", category: "", stock: "", price: "" });
        setShowAddMedicineForm(false);
      } catch (error) {
        console.error("Error adding medicine:", error);
      }
    }
  };

  const handleAddTreatment = async () => {
    if (newTreatment.name && newTreatment.description && newTreatment.duration && newTreatment.category) {
      try {
        const treatmentData = {
          name: newTreatment.name,
          description: newTreatment.description,
          duration: newTreatment.duration,
          category: newTreatment.category
        };
        const newId = await createDocument(COLLECTIONS.TREATMENTS, treatmentData);
        setTreatments([...treatments, { id: newId, ...treatmentData }]);
        setNewTreatment({ name: "", description: "", duration: "", category: "" });
        setShowAddTreatmentForm(false);
      } catch (error) {
        console.error("Error adding treatment:", error);
      }
    }
  };

  const openPaymentModal = (appointmentId: string) => {
    setSelectedAppointmentId(appointmentId);
    setPaymentDetails({
      consultingFee: 0,
      medicineCharges: 0,
      procedureCharges: 0,
      panchakarmaCharges: 0,
      extraCharges: 0,
      paidAmount: 0
    });
    setShowPaymentModal(true);
  };

  const handleSavePayment = async () => {
    if (!selectedAppointmentId) return;

    const appointment = appointments.find(a => a.id === selectedAppointmentId);
    if (!appointment) return;

    try {
      const paymentData = {
        patientId: appointment.patientId,
        appointmentId: appointment.id,
        consultingFee: paymentDetails.consultingFee,
        medicineCharges: paymentDetails.medicineCharges,
        procedureCharges: paymentDetails.procedureCharges,
        panchakarmaCharges: paymentDetails.panchakarmaCharges,
        extraCharges: paymentDetails.extraCharges,
        totalAmount,
        paidAmount: paymentDetails.paidAmount,
        balanceAmount,
        date: new Date().toISOString()
      };

      await createDocument(COLLECTIONS.PAYMENTS, paymentData);

      // Update appointment status (requires updateDocument import or just local state update for now)
      setAppointments(appointments.map(app =>
        app.id === selectedAppointmentId ? { ...app, status: "Completed" } : app
      ));

      setShowPaymentModal(false);
      setSelectedAppointmentId(null);
    } catch (error) {
      console.error("Error saving payment:", error);
    }
  };



  const dashboardStats = [
    { title: "Total Patients", value: patients.length.toString(), change: "+12% from last month", icon: Users, color: "text-emerald-600", bgColor: "bg-emerald-50" },
    { title: "Today's Appointments", value: appointments.length.toString(), change: `${appointments.length} scheduled`, icon: Calendar, color: "text-amber-600", bgColor: "bg-amber-50" },
    { title: "Active Treatments", value: patients.filter(p => p.status === "Active").length.toString(), change: "+5% this week", icon: Activity, color: "text-teal-600", bgColor: "bg-teal-50" },
    { title: "Medicine Stock", value: medicines.reduce((sum, m) => sum + m.stock, 0).toString(), change: `${medicines.filter(m => m.lowStock).length} items low stock`, icon: Package, color: "text-orange-600", bgColor: "bg-orange-50" },
  ];

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: Activity },
    { id: "patients", label: "Patients", icon: Users },
    { id: "appointments", label: "Appointments", icon: Calendar },
    { id: "treatments", label: "Treatments", icon: ClipboardList },
    { id: "medicines", label: "Medicines", icon: Leaf },
    { id: "reports", label: "Reports", icon: FileText },
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      <Card className="border-2 border-amber-300 bg-gradient-to-r from-amber-100 via-orange-100 to-emerald-100 shadow-lg">
        <CardContent className="p-6">
          <h2 className="text-2xl font-black text-stone-800">Welcome, Vd. Pratiksha Sonawane</h2>
          <p className="text-sm font-medium text-amber-700">आपका दिन शुभ हो | Today&apos;s Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {dashboardStats.map((stat, index) => (
          <Card key={index} className="border-2 border-amber-200 shadow-md">
            <CardContent className="relative p-6">
              <div className="relative flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-stone-700">{stat.title}</p>
                  <p className="text-3xl font-black text-stone-800">{stat.value}</p>
                  <p className="text-xs font-medium text-stone-600">{stat.change}</p>
                </div>
                <div className={`rounded-xl ${stat.bgColor} p-3 shadow-md`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="border-2 border-amber-200 shadow-md">
          <CardHeader className="border-b-2 border-amber-100 bg-gradient-to-r from-amber-100 via-orange-50 to-emerald-100">
            <CardTitle className="flex items-center text-xl text-stone-800">
              <Users className="mr-2 h-5 w-5 text-emerald-600" />
              Recent Patients
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-amber-50">
              {patients
                .filter(p =>
                  p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  p.phoneNumber.includes(searchTerm) ||
                  p.id.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .slice(0, 4).map((patient) => (
                  <div
                    key={patient.id}
                    className="flex items-center justify-between p-4 transition-colors hover:bg-amber-50/50 cursor-pointer"
                    onClick={() => router.push(`/patient/${patient.id}`)}
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-stone-800">{patient.name}</p>
                      <p className="text-sm text-stone-600">{patient.age} years • {patient.job}</p>
                      <p className="text-xs text-stone-500">{patient.reference}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${patient.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                        {patient.status}
                      </span>
                      <p className="mt-1 text-xs text-stone-500">{patient.lastVisit}</p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-emerald-200 shadow-md">
          <CardHeader className="border-b-2 border-emerald-100 bg-gradient-to-r from-emerald-100 via-teal-50 to-amber-100">
            <CardTitle className="flex items-center text-xl text-stone-800">
              <Calendar className="mr-2 h-5 w-5 text-teal-600" />
              Today&apos;s Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-amber-50">
              {appointments
                .filter(a =>
                  a.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  a.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  a.date.includes(searchTerm)
                )
                .map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between p-4 transition-colors hover:bg-emerald-50/50 cursor-pointer"
                    onClick={() => router.push(`/patient/${appointment.patientId}`)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-teal-100">
                        <Clock className="h-5 w-5 text-teal-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-stone-800">{appointment.patientName}</p>
                        <p className="text-sm text-stone-600">{appointment.type}</p>
                        <p className="text-xs text-stone-500">{appointment.duration}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-teal-700">{appointment.time}</p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderPatients = () => (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-stone-800">Patient Management</h2>
          <p className="text-sm text-stone-600">Total Patients: {patients.length}</p>
        </div>
        <Button onClick={() => setShowAddPatientForm(true)} className="bg-emerald-600 text-white hover:bg-emerald-700">
          <Plus className="mr-2 h-4 w-4" />
          Add New Patient
        </Button>
      </div>

      {showAddPatientForm && (
        <Card className="border-amber-100 mb-6">
          <CardHeader className="border-b border-amber-50 bg-gradient-to-r from-emerald-50 to-teal-50">
            <CardTitle className="text-stone-800">Add New Patient</CardTitle>
            <CardDescription>Enter patient details to add to the system</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="patient-name">Name</Label>
                <Input
                  id="patient-name"
                  placeholder="Enter patient name"
                  value={newPatient.name}
                  onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="patient-age">Age</Label>
                <Input
                  id="patient-age"
                  type="number"
                  placeholder="Enter age"
                  value={newPatient.age}
                  onChange={(e) => setNewPatient({ ...newPatient, age: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="patient-dob">Date of Birth</Label>
                <Input
                  id="patient-dob"
                  type="date"
                  placeholder="Select Date of Birth"
                  value={newPatient.dob}
                  onChange={(e) => setNewPatient({ ...newPatient, dob: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="patient-address">Address</Label>
                <Input
                  id="patient-address"
                  placeholder="Enter address"
                  value={newPatient.address}
                  onChange={(e) => setNewPatient({ ...newPatient, address: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="patient-phone">Phone Number</Label>
                <Input
                  id="patient-phone"
                  placeholder="Enter phone number"
                  value={newPatient.phoneNumber}
                  onChange={(e) => setNewPatient({ ...newPatient, phoneNumber: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="patient-job">Job</Label>
                <Input
                  id="patient-job"
                  placeholder="Enter job"
                  value={newPatient.job}
                  onChange={(e) => setNewPatient({ ...newPatient, job: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="patient-reference">Reference</Label>
                <Input
                  id="patient-reference"
                  placeholder="Enter reference"
                  value={newPatient.reference}
                  onChange={(e) => setNewPatient({ ...newPatient, reference: e.target.value })}
                />
              </div>
            </div>
            <div className="mt-6 flex gap-4">
              <Button onClick={handleAddPatient} className="bg-emerald-600 text-white hover:bg-emerald-700">
                Add Patient
              </Button>
              <Button onClick={() => setShowAddPatientForm(false)} variant="outline">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-amber-100">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-stone-400" />
              <Input
                placeholder="Search by name, phone, or ID..."
                className="border-amber-200 pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

          </div>
        </CardContent>
      </Card>

      <Card className="border-amber-100">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-amber-50 to-emerald-50">
                <tr>
                  <th className="border-b border-amber-100 px-6 py-4 text-left text-sm font-semibold text-stone-700">Patient Details</th>
                  <th className="border-b border-amber-100 px-6 py-4 text-left text-sm font-semibold text-stone-700">Job</th>
                  <th className="border-b border-amber-100 px-6 py-4 text-left text-sm font-semibold text-stone-700">Reference</th>
                  <th className="border-b border-amber-100 px-6 py-4 text-left text-sm font-semibold text-stone-700">Last Visit</th>
                  <th className="border-b border-amber-100 px-6 py-4 text-left text-sm font-semibold text-stone-700">Status</th>
                  <th className="border-b border-amber-100 px-6 py-4 text-left text-sm font-semibold text-stone-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-50">
                {patients
                  .filter(p =>
                    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    p.phoneNumber.includes(searchTerm) ||
                    p.id.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((patient) => (
                    <tr key={patient.id} className="transition-colors hover:bg-amber-50/50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-stone-800">{patient.name}</p>
                          <p className="text-sm text-stone-600">{patient.age} years</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-stone-700">{patient.job}</td>
                      <td className="px-6 py-4 text-sm text-stone-700">{patient.reference}</td>
                      <td className="px-6 py-4 text-sm text-stone-600">{patient.lastVisit}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${patient.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                          {patient.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm" className="text-emerald-600 hover:bg-emerald-50" onClick={() => window.open(`/patient/${patient.id}`, '_blank')}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-amber-600 hover:bg-amber-50" onClick={() => window.open(`/patient/${patient.id}/edit`, '_blank')}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            {patients.filter(p =>
              p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              p.phoneNumber.includes(searchTerm) ||
              p.id.toLowerCase().includes(searchTerm.toLowerCase())
            ).length === 0 && (
                <div className="p-8 text-center bg-stone-50/50">
                  <p className="text-stone-500 italic">No patients found matching &quot;{searchTerm}&quot;</p>
                </div>
              )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const handleDeleteAppointment = async (appointmentId: string) => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      try {
        await deleteDocument(COLLECTIONS.APPOINTMENTS, appointmentId);
        setAppointments(appointments.filter(a => a.id !== appointmentId));
      } catch (error) {
        console.error("Error deleting appointment:", error);
      }
    }
  };

  const renderAppointments = () => (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-stone-800">Appointment Management</h2>
          <p className="text-sm text-stone-600">Total Appointments: {appointments.length}</p>
        </div>
        <Button onClick={() => setShowAddAppointmentForm(true)} className="bg-teal-600 text-white hover:bg-teal-700">
          <Plus className="mr-2 h-4 w-4" />
          New Appointment
        </Button>
      </div>

      {showAddAppointmentForm && (
        <Card className="border-amber-100 mb-6">
          <CardHeader className="border-b border-amber-50 bg-gradient-to-r from-teal-50 to-emerald-50">
            <CardTitle className="text-stone-800">Add New Appointment</CardTitle>
            <CardDescription>Schedule a new appointment</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="appointment-date">Date</Label>
                <Input
                  id="appointment-date"
                  type="date"
                  value={newAppointment.date}
                  onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="appointment-time">Time</Label>
                <Input
                  id="appointment-time"
                  type="time"
                  value={newAppointment.time}
                  onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="appointment-patient">Patient</Label>
                <Select
                  value={newAppointment.patientId}
                  onValueChange={(val) => {
                    const selectedPatient = patients.find(p => p.id === val);
                    setNewAppointment({
                      ...newAppointment,
                      patientId: val,
                      patientName: selectedPatient ? selectedPatient.name : ""
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select patient" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map(p => (
                      <SelectItem key={p.id} value={p.id}>{p.name} ({p.phoneNumber})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="appointment-type">Appointment Type</Label>
                <Select value={newAppointment.type} onValueChange={(value) => setNewAppointment({ ...newAppointment, type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Initial Consultation">Initial Consultation</SelectItem>
                    <SelectItem value="Follow-up">Follow-up</SelectItem>
                    <SelectItem value="Panchakarma Session">Panchakarma Session</SelectItem>
                    <SelectItem value="Consultation">Consultation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="appointment-duration">Duration</Label>
                <Select value={newAppointment.duration} onValueChange={(value) => setNewAppointment({ ...newAppointment, duration: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30 min">30 min</SelectItem>
                    <SelectItem value="45 min">45 min</SelectItem>
                    <SelectItem value="60 min">60 min</SelectItem>
                    <SelectItem value="90 min">90 min</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-6 flex gap-4">
              <Button onClick={handleAddAppointment} className="bg-teal-600 text-white hover:bg-teal-700">
                Add Appointment
              </Button>
              <Button onClick={() => setShowAddAppointmentForm(false)} variant="outline">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-amber-100">
        <CardHeader className="border-b border-amber-50 bg-gradient-to-r from-teal-50 to-emerald-50">
          <CardTitle className="text-stone-800">Today&apos;s Appointments</CardTitle>
          <CardDescription>{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {appointments
              .filter(a =>
                a.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                a.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                a.date.includes(searchTerm)
              )
              .map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between rounded-lg border-2 border-emerald-100 bg-gradient-to-r from-emerald-50/50 to-teal-50/50 p-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex h-16 w-16 flex-shrink-0 flex-col items-center justify-center rounded-lg bg-teal-100">
                      <p className="text-lg font-bold text-teal-600">{appointment.time.split(":")[0]}</p>
                      <p className="text-xs text-teal-600">{appointment.time.split(" ")[1]}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-stone-800">{appointment.patientName}</p>
                      <p className="text-sm text-stone-600">{appointment.type}</p>
                      <p className="text-xs text-stone-500">Duration: {appointment.duration}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                      onClick={() => openPaymentModal(appointment.id)}
                    >
                      Checkout & Pay
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:bg-red-50 hover:text-red-700"
                      onClick={() => handleDeleteAppointment(appointment.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            {appointments.filter(a =>
              a.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
              a.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
              a.date.includes(searchTerm)
            ).length === 0 && (
                <div className="p-8 text-center bg-stone-50/50 rounded-lg border-2 border-dashed border-stone-200">
                  <p className="text-stone-500 italic">No appointments found matching &quot;{searchTerm}&quot;</p>
                </div>
              )}
          </div>
        </CardContent>
      </Card>
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Process Payment</DialogTitle>
            <DialogDescription>
              Enter the charges for this appointment. Total and Balance will be auto-calculated.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="consulting" className="col-span-2">Consulting Fee</Label>
              <Input id="consulting" type="number" min="0" className="col-span-2" value={paymentDetails.consultingFee || ''} onChange={(e) => setPaymentDetails({ ...paymentDetails, consultingFee: Number(e.target.value) })} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="medicines" className="col-span-2">Medicine Charges</Label>
              <Input id="medicines" type="number" min="0" className="col-span-2" value={paymentDetails.medicineCharges || ''} onChange={(e) => setPaymentDetails({ ...paymentDetails, medicineCharges: Number(e.target.value) })} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="procedures" className="col-span-2">Procedure Charges</Label>
              <Input id="procedures" type="number" min="0" className="col-span-2" value={paymentDetails.procedureCharges || ''} onChange={(e) => setPaymentDetails({ ...paymentDetails, procedureCharges: Number(e.target.value) })} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="panchakarma" className="col-span-2">Panchakarma Charges</Label>
              <Input id="panchakarma" type="number" min="0" className="col-span-2" value={paymentDetails.panchakarmaCharges || ''} onChange={(e) => setPaymentDetails({ ...paymentDetails, panchakarmaCharges: Number(e.target.value) })} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="extra" className="col-span-2">Extra Charges</Label>
              <Input id="extra" type="number" min="0" className="col-span-2" value={paymentDetails.extraCharges || ''} onChange={(e) => setPaymentDetails({ ...paymentDetails, extraCharges: Number(e.target.value) })} />
            </div>

            <div className="border-t pt-4 mt-2">
              <div className="grid grid-cols-4 items-center gap-4 font-bold bg-stone-50 p-3 rounded-md border border-stone-200">
                <Label className="col-span-2 text-lg">Total Amount</Label>
                <div className="col-span-2 text-lg text-stone-800">₹{totalAmount}</div>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4 mt-2">
              <Label htmlFor="paid" className="col-span-2 font-semibold text-emerald-600">Amount Paid</Label>
              <Input id="paid" type="number" min="0" className="col-span-2 bg-emerald-50 font-bold text-emerald-700 border-emerald-300 focus-visible:ring-emerald-500" value={paymentDetails.paidAmount || ''} onChange={(e) => setPaymentDetails({ ...paymentDetails, paidAmount: Number(e.target.value) })} />
            </div>

            <div className="grid grid-cols-4 items-center gap-4 mt-2">
              <Label className="col-span-2 font-semibold text-amber-600">Balance Amount</Label>
              <div className="col-span-2 text-lg font-bold text-amber-700">₹{balanceAmount}</div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPaymentModal(false)}>Cancel</Button>
            <Button onClick={handleSavePayment} className="bg-emerald-600 hover:bg-emerald-700 text-white">Save Payment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );

  const renderTreatments = () => (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-stone-800">Treatment Plans</h2>
          <p className="text-sm text-stone-600">Manage Ayurvedic treatment protocols</p>
        </div>
        <Button onClick={() => setShowAddTreatmentForm(true)} className="bg-orange-600 text-white hover:bg-orange-700">
          <Plus className="mr-2 h-4 w-4" />
          Create Treatment Plan
        </Button>
      </div>

      {showAddTreatmentForm && (
        <Card className="border-amber-100 mb-6">
          <CardHeader className="border-b border-amber-50 bg-gradient-to-r from-orange-50 to-amber-50">
            <CardTitle className="text-stone-800">Create Treatment Plan</CardTitle>
            <CardDescription>Add a new treatment protocol</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="treatment-name">Treatment Name</Label>
                <Input
                  id="treatment-name"
                  placeholder="Enter treatment name"
                  value={newTreatment.name}
                  onChange={(e) => setNewTreatment({ ...newTreatment, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="treatment-category">Category</Label>
                <Select value={newTreatment.category} onValueChange={(value) => setNewTreatment({ ...newTreatment, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Panchakarma">Panchakarma</SelectItem>
                    <SelectItem value="Herbal">Herbal</SelectItem>
                    <SelectItem value="Dietary">Dietary</SelectItem>
                    <SelectItem value="Lifestyle">Lifestyle</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="treatment-duration">Duration</Label>
                <Select value={newTreatment.duration} onValueChange={(value) => setNewTreatment({ ...newTreatment, duration: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30 min">30 min</SelectItem>
                    <SelectItem value="45 min">45 min</SelectItem>
                    <SelectItem value="60 min">60 min</SelectItem>
                    <SelectItem value="90 min">90 min</SelectItem>
                    <SelectItem value="120 min">120 min</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <Label htmlFor="treatment-description">Description</Label>
              <Textarea
                id="treatment-description"
                placeholder="Enter treatment description"
                value={newTreatment.description}
                onChange={(e) => setNewTreatment({ ...newTreatment, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="mt-6 flex gap-4">
              <Button onClick={handleAddTreatment} className="bg-orange-600 text-white hover:bg-orange-700">
                Create Treatment
              </Button>
              <Button onClick={() => setShowAddTreatmentForm(false)} variant="outline">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="border-amber-100">
          <CardHeader className="border-b border-amber-50 bg-gradient-to-r from-emerald-50 to-teal-50">
            <CardTitle className="text-stone-800">Panchakarma Therapies</CardTitle>
            <CardDescription>Detoxification & Rejuvenation</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {treatments.filter(t => t.category === "Panchakarma").map((therapy) => (
                <div key={therapy.id} className="flex items-start space-x-3 rounded-lg border border-emerald-100 bg-emerald-50/50 p-4">
                  <Leaf className="mt-1 h-5 w-5 flex-shrink-0 text-emerald-600" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-stone-800">{therapy.name}</h4>
                    <p className="text-sm text-stone-600">{therapy.description}</p>
                    <p className="text-xs text-stone-500">Duration: {therapy.duration}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-100">
          <CardHeader className="border-b border-amber-50 bg-gradient-to-r from-amber-50 to-orange-50">
            <CardTitle className="text-stone-800">Herbal Treatments</CardTitle>
            <CardDescription>Natural Medicine Protocols</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {treatments.filter(t => t.category === "Herbal").map((treatment) => (
                <div key={treatment.id} className="flex items-start space-x-3 rounded-lg border border-amber-100 bg-amber-50/50 p-4">
                  <Package className="mt-1 h-5 w-5 flex-shrink-0 text-amber-600" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-stone-800">{treatment.name}</h4>
                    <p className="text-sm text-stone-600">{treatment.description}</p>
                    <p className="text-xs text-stone-500">Duration: {treatment.duration}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderMedicines = () => (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-stone-800">Medicine Inventory</h2>
          <p className="text-sm text-stone-600">Total Items: {medicines.length} | Low Stock: {medicines.filter(m => m.lowStock).length}</p>
        </div>
        <Button onClick={() => setShowAddMedicineForm(true)} className="bg-green-600 text-white hover:bg-green-700">
          <Plus className="mr-2 h-4 w-4" />
          Add Medicine
        </Button>
      </div>

      {showAddMedicineForm && (
        <Card className="border-amber-100 mb-6">
          <CardHeader className="border-b border-amber-50 bg-gradient-to-r from-green-50 to-emerald-50">
            <CardTitle className="text-stone-800">Add New Medicine</CardTitle>
            <CardDescription>Add a new medicine to inventory</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="medicine-name">Medicine Name</Label>
                <Input
                  id="medicine-name"
                  placeholder="Enter medicine name"
                  value={newMedicine.name}
                  onChange={(e) => setNewMedicine({ ...newMedicine, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="medicine-category">Category</Label>
                <Select value={newMedicine.category} onValueChange={(value) => setNewMedicine({ ...newMedicine, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Rasayana">Rasayana</SelectItem>
                    <SelectItem value="Digestive">Digestive</SelectItem>
                    <SelectItem value="Neural">Neural</SelectItem>
                    <SelectItem value="Immunity">Immunity</SelectItem>
                    <SelectItem value="Cardiac">Cardiac</SelectItem>
                    <SelectItem value="Respiratory">Respiratory</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="medicine-stock">Stock Quantity</Label>
                <Input
                  id="medicine-stock"
                  type="number"
                  placeholder="Enter stock quantity"
                  value={newMedicine.stock}
                  onChange={(e) => setNewMedicine({ ...newMedicine, stock: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="medicine-price">Price</Label>
                <Input
                  id="medicine-price"
                  placeholder="Enter price (e.g., ₹250)"
                  value={newMedicine.price}
                  onChange={(e) => setNewMedicine({ ...newMedicine, price: e.target.value })}
                />
              </div>
            </div>
            <div className="mt-6 flex gap-4">
              <Button onClick={handleAddMedicine} className="bg-green-600 text-white hover:bg-green-700">
                Add Medicine
              </Button>
              <Button onClick={() => setShowAddMedicineForm(false)} variant="outline">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {medicines.map((medicine) => (
          <Card key={medicine.id} className={`border-2 ${medicine.lowStock ? "border-red-200 bg-red-50/30" : "border-emerald-200 bg-emerald-50/30"}`}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <Leaf className={`h-8 w-8 ${medicine.lowStock ? "text-red-600" : "text-emerald-600"}`} />
                {medicine.lowStock && (
                  <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700">Low Stock</span>
                )}
              </div>
              <CardTitle className="text-lg text-stone-800">{medicine.name}</CardTitle>
              <CardDescription className="text-stone-600">{medicine.category}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-stone-600">In Stock</p>
                  <p className="text-2xl font-bold text-stone-800">{medicine.stock}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-stone-600">Price</p>
                  <p className="text-xl font-bold text-stone-800">{medicine.price}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const handleDeletePayment = async (paymentId: string) => {
    if (window.confirm("Are you sure you want to delete this payment record? This action cannot be undone.")) {
      try {
        await deleteDocument(COLLECTIONS.PAYMENTS, paymentId);
        setPayments(payments.filter(p => p.id !== paymentId));
      } catch (error) {
        console.error("Error deleting payment:", error);
      }
    }
  };

  const renderReports = () => {
    // 1. Line Chart: Payments Over Time
    const paymentsByDate = payments.reduce((acc: any, curr) => {
      const date = curr.date.split('T')[0];
      if (!acc[date]) acc[date] = { date, totalAmount: 0, paidAmount: 0 };
      acc[date].totalAmount += curr.totalAmount;
      acc[date].paidAmount += curr.paidAmount;
      return acc;
    }, {});
    const lineChartData = Object.values(paymentsByDate).sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // 2. Bar Chart: Monthly Revenue
    const monthlyRevenue = payments.reduce((acc: any, curr) => {
      const date = new Date(curr.date);
      const month = date.toLocaleString('default', { month: 'short', year: 'numeric' });
      if (!acc[month]) acc[month] = { month, revenue: 0 };
      acc[month].revenue += curr.paidAmount;
      return acc;
    }, {});
    const barChartData = Object.values(monthlyRevenue);

    // 3. Pie Chart: Payment Distribution
    const distribution = payments.reduce((acc, curr) => {
      acc.Consulting += curr.consultingFee;
      acc.Medicine += curr.medicineCharges;
      acc.Procedures += curr.procedureCharges;
      acc.Panchakarma += curr.panchakarmaCharges;
      acc.Extra += curr.extraCharges;
      return acc;
    }, { Consulting: 0, Medicine: 0, Procedures: 0, Panchakarma: 0, Extra: 0 });

    const pieChartData = Object.keys(distribution)
      .filter(key => distribution[key as keyof typeof distribution] > 0)
      .map(key => ({
        name: key,
        value: distribution[key as keyof typeof distribution]
      }));

    const COLORS = ['#059669', '#d97706', '#0284c7', '#7c3aed', '#dc2626'];

    // 4. Donut Chart: Paid vs Outstanding
    const totalPaidSum = payments.reduce((sum, p) => sum + p.paidAmount, 0);
    const totalBalanceSum = payments.reduce((sum, p) => sum + p.balanceAmount, 0);
    const balanceData = [
      { name: 'Paid', value: totalPaidSum },
      { name: 'Outstanding', value: totalBalanceSum }
    ];

    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-stone-800">Financial Reports & Analytics</h2>
            <p className="text-sm text-stone-600">Track revenue, outstandings, and payment distributions.</p>
          </div>
        </div>

        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-amber-100 bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-stone-500 uppercase tracking-wider">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-emerald-700">₹{totalPaidSum}</p>
            </CardContent>
          </Card>
          <Card className="border-amber-100 bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-stone-500 uppercase tracking-wider">Total Outstanding</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-red-600">₹{totalBalanceSum}</p>
            </CardContent>
          </Card>
          <Card className="border-amber-100 bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-stone-500 uppercase tracking-wider">Total Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-600">{payments.length}</p>
            </CardContent>
          </Card>
          <Card className="border-amber-100 bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-stone-500 uppercase tracking-wider">Avg. Transaction</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-purple-600">
                ₹{payments.length ? Math.round(totalPaidSum / payments.length) : 0}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Revenue Over Time Line Chart */}
          <Card className="border-amber-100 p-4">
            <CardTitle className="mb-4 text-stone-800">Revenue Over Time</CardTitle>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#6b7280" fontSize={12} tickMargin={10} />
                  <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(value) => `₹${value}`} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #fcd34d' }} />
                  <Legend />
                  <Line type="monotone" name="Total Billed" dataKey="totalAmount" stroke="#94a3b8" strokeWidth={2} dot={false} />
                  <Line type="monotone" name="Actual Paid" dataKey="paidAmount" stroke="#059669" strokeWidth={3} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Monthly Bar Chart */}
          <Card className="border-amber-100 p-4">
            <CardTitle className="mb-4 text-stone-800">Monthly Collections</CardTitle>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" fontSize={12} tickMargin={10} />
                  <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(value) => `₹${value}`} />
                  <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: '1px solid #fcd34d' }} />
                  <Bar name="Revenue" dataKey="revenue" fill="#d97706" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Payment Distribution Pie Chart */}
          <Card className="border-amber-100 p-4">
            <CardTitle className="mb-4 text-stone-800">Revenue Distribution</CardTitle>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #fcd34d' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Paid vs Outstanding Donut Chart */}
          <Card className="border-amber-100 p-4">
            <CardTitle className="mb-4 text-stone-800">Paid vs Outstanding</CardTitle>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={balanceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    <Cell fill="#059669" /> {/* Paid - Green */}
                    <Cell fill="#ef4444" /> {/* Outstanding - Red */}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #fcd34d' }} formatter={(value) => `₹${value}`} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Tabular Payment History */}
        <Card className="border-amber-100">
          <CardHeader className="border-b border-amber-50 bg-gradient-to-r from-emerald-50 to-teal-50">
            <CardTitle className="text-stone-800">Recent Transactions</CardTitle>
            <CardDescription>Comprehensive ledger of patient payments</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-stone-50 text-xs uppercase text-stone-500">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Date</th>
                    <th className="px-6 py-4 font-semibold">Patient</th>
                    <th className="px-6 py-4 font-semibold text-right">Total Billed</th>
                    <th className="px-6 py-4 font-semibold text-right">Amount Paid</th>
                    <th className="px-6 py-4 font-semibold text-right">Balance</th>
                    <th className="px-6 py-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 bg-white">
                  {[...payments].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((payment) => {
                    const patient = patients.find(p => p.id === payment.patientId);
                    return (
                      <tr key={payment.id} className="transition-colors hover:bg-stone-50">
                        <td className="px-6 py-4 font-medium text-stone-800">
                          {new Date(payment.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => window.open(`/patient/${patient?.id}`, '_blank')}
                            className="font-medium text-emerald-600 hover:underline"
                          >
                            {patient?.name || 'Unknown Patient'}
                          </button>
                        </td>
                        <td className="px-6 py-4 text-right text-stone-600">₹{payment.totalAmount}</td>
                        <td className="px-6 py-4 text-right font-semibold text-emerald-600">₹{payment.paidAmount}</td>
                        <td className="px-6 py-4 text-right">
                          <span className={`font-semibold ${payment.balanceAmount > 0 ? "text-red-600" : "text-stone-500"}`}>
                            ₹{payment.balanceAmount}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:bg-red-50 hover:text-red-700"
                            onClick={() => handleDeletePayment(payment.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                  {payments.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-stone-500 italic">No transactions recorded yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-amber-50 via-orange-50/40 to-emerald-50/60">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-100/20 via-transparent to-transparent"></div>

      <header className="sticky top-0 z-50 border-b-2 border-amber-300 bg-gradient-to-r from-amber-50 via-orange-50 to-emerald-50 shadow-lg backdrop-blur-sm">
        <div className="relative z-10 flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="rounded-lg p-2 text-stone-700 transition-colors hover:bg-white/50 lg:hidden">
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="flex items-center space-x-3">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-full border-2 border-amber-400 bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 shadow-lg">
                <Leaf className="h-5 w-5 text-amber-100" />
              </div>
              <div>
                <h1 className="bg-gradient-to-r from-emerald-700 via-teal-600 to-amber-600 bg-clip-text text-2xl font-black tracking-tight text-transparent">SADHAK</h1>
                <p className="text-xs font-medium tracking-wide text-amber-700">सोल्यूशन फॉर आयुर्वेदिक ट्रीटमेंट</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden lg:flex items-center space-x-2 rounded-lg bg-white/50 px-3 py-1.5 shadow-sm transition-all focus-within:ring-2 focus-within:ring-emerald-500/20">
              <Search size={16} className="text-stone-400" />
              <input
                type="text"
                placeholder="Search patients, appointments..."
                className="bg-transparent text-sm font-medium outline-none placeholder:text-stone-300 w-48 transition-all focus:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="relative rounded-lg p-2 text-stone-700 transition-colors hover:bg-white/50">
              <Bell size={20} />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500"></span>
            </button>
            <button className="rounded-lg p-2 text-stone-700 transition-colors hover:bg-white/50">
              <Settings size={20} />
            </button>
            <button onClick={handleLogout} className="rounded-lg p-2 text-stone-700 transition-colors hover:bg-white/50">
              <LogOut size={20} />
            </button>
            <div className="flex items-center space-x-2">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-full border-2 border-amber-400 bg-gradient-to-br from-emerald-600 to-teal-600 text-sm font-bold text-white shadow-md">
                <span>DR</span>
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-bold text-stone-800">Vd. Pratiksha Sonawane</p>
                <p className="text-xs font-medium text-amber-700">आयुर्वेदिक चिकित्सक</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className={`fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 transform border-r-2 border-amber-200 bg-gradient-to-b from-amber-50/50 via-orange-50/30 to-emerald-50/40 shadow-lg transition-transform duration-300 ease-in-out lg:relative lg:top-0 lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <nav className="relative z-10 space-y-2 p-4">
            {navigationItems.map((item) => (
              <button key={item.id} onClick={() => setActiveSection(item.id)} className={`flex w-full items-center space-x-3 rounded-lg px-4 py-3 transition-all ${activeSection === item.id ? "bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white shadow-lg shadow-emerald-200" : "text-stone-700 hover:bg-gradient-to-r hover:from-amber-100 hover:to-orange-50"}`}>
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
                {activeSection === item.id && <ChevronRight className="ml-auto" size={16} />}
              </button>
            ))}
          </nav>
        </aside>

        <main className="relative z-10 flex-1 overflow-auto p-6 lg:p-8">
          {activeSection === "dashboard" && renderDashboard()}
          {activeSection === "patients" && renderPatients()}
          {activeSection === "appointments" && renderAppointments()}
          {activeSection === "treatments" && renderTreatments()}
          {activeSection === "medicines" && renderMedicines()}
          {activeSection === "reports" && renderReports()}
        </main>
      </div>


    </div>
  );
}
