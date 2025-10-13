"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Users, ClipboardList, Leaf, Menu, X, Search, Bell, Settings, Plus, Eye, Edit, FileText, Activity, TrendingUp, Clock, Package, ChevronRight } from "lucide-react";
import { useState } from "react";

interface Patient {
  id: number;
  name: string;
  age: number;
  dosha: string;
  condition: string;
  lastVisit: string;
  status: string;
}

interface Appointment {
  id: number;
  time: string;
  patient: string;
  type: string;
  duration: string;
}

interface Medicine {
  id: number;
  name: string;
  category: string;
  stock: number;
  lowStock: boolean;
  price: string;
}

interface Treatment {
  id: number;
  name: string;
  description: string;
  duration: string;
  category: string;
}

export default function SadhakAyurvedApp() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState("dashboard");
  
  // Dynamic state for patients
  const [patients, setPatients] = useState<Patient[]>([
    { id: 1, name: "Rajesh Kumar", age: 45, dosha: "Vata-Pitta", condition: "Joint Pain", lastVisit: "2025-01-15", status: "Active" },
    { id: 2, name: "Priya Sharma", age: 32, dosha: "Kapha", condition: "Digestive Issues", lastVisit: "2025-01-14", status: "Active" },
    { id: 3, name: "Amit Patel", age: 58, dosha: "Pitta", condition: "Hypertension", lastVisit: "2025-01-13", status: "Follow-up" },
    { id: 4, name: "Lakshmi Reddy", age: 28, dosha: "Vata", condition: "Stress & Anxiety", lastVisit: "2025-01-12", status: "Active" },
  ]);

  // Dynamic state for appointments
  const [appointments, setAppointments] = useState<Appointment[]>([
    { id: 1, time: "09:00 AM", patient: "Sanjay Verma", type: "Initial Consultation", duration: "45 min" },
    { id: 2, time: "10:00 AM", patient: "Meera Singh", type: "Follow-up", duration: "30 min" },
    { id: 3, time: "11:30 AM", patient: "Arjun Das", type: "Panchakarma Session", duration: "60 min" },
    { id: 4, time: "02:00 PM", patient: "Kavita Joshi", type: "Consultation", duration: "45 min" },
  ]);

  // Dynamic state for medicines
  const [medicines, setMedicines] = useState<Medicine[]>([
    { id: 1, name: "Ashwagandha Churna", category: "Rasayana", stock: 45, lowStock: false, price: "₹250" },
    { id: 2, name: "Triphala Powder", category: "Digestive", stock: 12, lowStock: true, price: "₹180" },
    { id: 3, name: "Brahmi Oil", category: "Neural", stock: 28, lowStock: false, price: "₹320" },
    { id: 4, name: "Chyawanprash", category: "Immunity", stock: 8, lowStock: true, price: "₹450" },
  ]);

  // Dynamic state for treatments
  const [treatments, setTreatments] = useState<Treatment[]>([
    { id: 1, name: "Abhyanga", description: "Full body oil massage therapy", duration: "60 min", category: "Panchakarma" },
    { id: 2, name: "Shirodhara", description: "Continuous oil pouring on forehead", duration: "45 min", category: "Panchakarma" },
    { id: 3, name: "Rasayana Therapy", description: "Rejuvenation treatment with herbs", duration: "90 min", category: "Herbal" },
  ]);

  // Form visibility states
  const [showAddPatientForm, setShowAddPatientForm] = useState(false);
  const [showAddAppointmentForm, setShowAddAppointmentForm] = useState(false);
  const [showAddMedicineForm, setShowAddMedicineForm] = useState(false);
  const [showAddTreatmentForm, setShowAddTreatmentForm] = useState(false);

  // Form input states
  const [newPatient, setNewPatient] = useState({ name: "", age: "", dosha: "", condition: "" });
  const [newAppointment, setNewAppointment] = useState({ time: "", patient: "", type: "", duration: "" });
  const [newMedicine, setNewMedicine] = useState({ name: "", category: "", stock: "", price: "" });
  const [newTreatment, setNewTreatment] = useState({ name: "", description: "", duration: "", category: "" });

  // Form handlers
  const handleAddPatient = () => {
    if (newPatient.name && newPatient.age && newPatient.dosha && newPatient.condition) {
      const patient: Patient = {
        id: patients.length + 1,
        name: newPatient.name,
        age: parseInt(newPatient.age),
        dosha: newPatient.dosha,
        condition: newPatient.condition,
        lastVisit: new Date().toISOString().split('T')[0],
        status: "Active"
      };
      setPatients([...patients, patient]);
      setNewPatient({ name: "", age: "", dosha: "", condition: "" });
      setShowAddPatientForm(false);
    }
  };

  const handleAddAppointment = () => {
    if (newAppointment.time && newAppointment.patient && newAppointment.type && newAppointment.duration) {
      const appointment: Appointment = {
        id: appointments.length + 1,
        time: newAppointment.time,
        patient: newAppointment.patient,
        type: newAppointment.type,
        duration: newAppointment.duration
      };
      setAppointments([...appointments, appointment]);
      setNewAppointment({ time: "", patient: "", type: "", duration: "" });
      setShowAddAppointmentForm(false);
    }
  };

  const handleAddMedicine = () => {
    if (newMedicine.name && newMedicine.category && newMedicine.stock && newMedicine.price) {
      const medicine: Medicine = {
        id: medicines.length + 1,
        name: newMedicine.name,
        category: newMedicine.category,
        stock: parseInt(newMedicine.stock),
        lowStock: parseInt(newMedicine.stock) < 15,
        price: newMedicine.price
      };
      setMedicines([...medicines, medicine]);
      setNewMedicine({ name: "", category: "", stock: "", price: "" });
      setShowAddMedicineForm(false);
    }
  };

  const handleAddTreatment = () => {
    if (newTreatment.name && newTreatment.description && newTreatment.duration && newTreatment.category) {
      const treatment: Treatment = {
        id: treatments.length + 1,
        name: newTreatment.name,
        description: newTreatment.description,
        duration: newTreatment.duration,
        category: newTreatment.category
      };
      setTreatments([...treatments, treatment]);
      setNewTreatment({ name: "", description: "", duration: "", category: "" });
      setShowAddTreatmentForm(false);
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
          <h2 className="text-2xl font-black text-stone-800">Welcome, Dr. Vaidya</h2>
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
              {patients.slice(0, 4).map((patient) => (
                <div key={patient.id} className="flex items-center justify-between p-4 transition-colors hover:bg-amber-50/50">
                  <div className="flex-1">
                    <p className="font-semibold text-stone-800">{patient.name}</p>
                    <p className="text-sm text-stone-600">{patient.age} years • {patient.dosha}</p>
                    <p className="text-xs text-stone-500">{patient.condition}</p>
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
              {appointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-4 transition-colors hover:bg-emerald-50/50">
                  <div className="flex items-center space-x-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-teal-100">
                      <Clock className="h-5 w-5 text-teal-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-stone-800">{appointment.patient}</p>
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
                <Label htmlFor="patient-dosha">Dosha Type</Label>
                <Select value={newPatient.dosha} onValueChange={(value) => setNewPatient({ ...newPatient, dosha: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select dosha" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Vata">Vata</SelectItem>
                    <SelectItem value="Pitta">Pitta</SelectItem>
                    <SelectItem value="Kapha">Kapha</SelectItem>
                    <SelectItem value="Vata-Pitta">Vata-Pitta</SelectItem>
                    <SelectItem value="Pitta-Kapha">Pitta-Kapha</SelectItem>
                    <SelectItem value="Vata-Kapha">Vata-Kapha</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="patient-condition">Condition</Label>
                <Input
                  id="patient-condition"
                  placeholder="Enter condition"
                  value={newPatient.condition}
                  onChange={(e) => setNewPatient({ ...newPatient, condition: e.target.value })}
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
              <Input placeholder="Search patients..." className="border-amber-200 pl-9" />
            </div>
            <Select>
              <SelectTrigger className="w-full border-amber-200 md:w-48">
                <SelectValue placeholder="Dosha Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Doshas</SelectItem>
                <SelectItem value="vata">Vata</SelectItem>
                <SelectItem value="pitta">Pitta</SelectItem>
                <SelectItem value="kapha">Kapha</SelectItem>
              </SelectContent>
            </Select>
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
                  <th className="border-b border-amber-100 px-6 py-4 text-left text-sm font-semibold text-stone-700">Dosha Type</th>
                  <th className="border-b border-amber-100 px-6 py-4 text-left text-sm font-semibold text-stone-700">Condition</th>
                  <th className="border-b border-amber-100 px-6 py-4 text-left text-sm font-semibold text-stone-700">Last Visit</th>
                  <th className="border-b border-amber-100 px-6 py-4 text-left text-sm font-semibold text-stone-700">Status</th>
                  <th className="border-b border-amber-100 px-6 py-4 text-left text-sm font-semibold text-stone-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-50">
                {patients.map((patient) => (
                  <tr key={patient.id} className="transition-colors hover:bg-amber-50/50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-stone-800">{patient.name}</p>
                        <p className="text-sm text-stone-600">{patient.age} years</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block rounded-full bg-teal-100 px-3 py-1 text-sm font-medium text-teal-700">{patient.dosha}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-stone-700">{patient.condition}</td>
                    <td className="px-6 py-4 text-sm text-stone-600">{patient.lastVisit}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${patient.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                        {patient.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" className="text-emerald-600 hover:bg-emerald-50">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-amber-600 hover:bg-amber-50">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );

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
                <Label htmlFor="appointment-time">Time</Label>
                <Input
                  id="appointment-time"
                  type="time"
                  value={newAppointment.time}
                  onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="appointment-patient">Patient Name</Label>
                <Input
                  id="appointment-patient"
                  placeholder="Enter patient name"
                  value={newAppointment.patient}
                  onChange={(e) => setNewAppointment({ ...newAppointment, patient: e.target.value })}
                />
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
            {appointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between rounded-lg border-2 border-emerald-100 bg-gradient-to-r from-emerald-50/50 to-teal-50/50 p-4">
                <div className="flex items-center space-x-4">
                  <div className="flex h-16 w-16 flex-shrink-0 flex-col items-center justify-center rounded-lg bg-teal-100">
                    <p className="text-lg font-bold text-teal-600">{appointment.time.split(":")[0]}</p>
                    <p className="text-xs text-teal-600">{appointment.time.split(" ")[1]}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-stone-800">{appointment.patient}</p>
                    <p className="text-sm text-stone-600">{appointment.type}</p>
                    <p className="text-xs text-stone-500">Duration: {appointment.duration}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                  Start Consultation
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
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

  const renderReports = () => (
    <div className="flex h-96 items-center justify-center">
      <div className="text-center">
        <FileText className="mx-auto h-16 w-16 text-stone-300" />
        <p className="mt-4 text-lg font-semibold text-stone-600">Reports Section</p>
        <p className="text-sm text-stone-500">Analytics and reports will be available here</p>
      </div>
    </div>
  );

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
            <button className="relative rounded-lg p-2 text-stone-700 transition-colors hover:bg-white/50">
              <Bell size={20} />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500"></span>
            </button>
            <button className="rounded-lg p-2 text-stone-700 transition-colors hover:bg-white/50">
              <Settings size={20} />
            </button>
            <div className="flex items-center space-x-2">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-full border-2 border-amber-400 bg-gradient-to-br from-emerald-600 to-teal-600 text-sm font-bold text-white shadow-md">
                <span>DR</span>
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-bold text-stone-800">Dr. Vaidya</p>
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
