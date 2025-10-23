"use client";

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Users, ClipboardList, Leaf, Menu, X, Search, Bell, Settings, Plus, Eye, Edit, FileText, Activity, TrendingUp, Clock, Package, ChevronRight, LogOut } from "lucide-react";
import { useAuth } from '../../../components/AuthProvider';
import { logOut } from '../../../lib/auth';
import { useRouter } from 'next/navigation';

interface Patient {
  id: number;
  name: string;
  age: number;
  address: string;
  phoneNumber: string;
  dosha: string;
  condition: string;
  symptoms: string;
  treatmentPlan: string;
  payment: string;
  lastVisit: string;
  status: string;
}

export default function PatientDetailsPage() {
  const params = useParams();
  const patientId = parseInt(params.id as string);
  const { user } = useAuth();
  const router = useRouter();

  const [patient, setPatient] = useState<Patient | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    age: "",
    address: "",
    phoneNumber: "",
    dosha: "",
    condition: "",
    symptoms: "",
    treatmentPlan: "",
    payment: ""
  });

  // Mock patient data - in real app, fetch from API
  useEffect(() => {
    const mockPatients: Patient[] = [
      { id: 1, name: "Rajesh Kumar", age: 45, address: "123 MG Road, Bangalore", phoneNumber: "+91-9876543210", dosha: "Vata-Pitta", condition: "Joint Pain", symptoms: "Pain in knees and elbows", treatmentPlan: "Abhyanga and herbal supplements", payment: "₹500", lastVisit: "2025-01-15", status: "Active" },
      { id: 2, name: "Priya Sharma", age: 32, address: "456 Brigade Road, Bangalore", phoneNumber: "+91-9876543211", dosha: "Kapha", condition: "Digestive Issues", symptoms: "Bloating and indigestion", treatmentPlan: "Triphala and dietary changes", payment: "₹400", lastVisit: "2025-01-14", status: "Active" },
      { id: 3, name: "Amit Patel", age: 58, address: "789 Residency Road, Bangalore", phoneNumber: "+91-9876543212", dosha: "Pitta", condition: "Hypertension", symptoms: "High blood pressure", treatmentPlan: "Rasayana therapy", payment: "₹600", lastVisit: "2025-01-13", status: "Follow-up" },
      { id: 4, name: "Lakshmi Reddy", age: 28, address: "321 Commercial Street, Bangalore", phoneNumber: "+91-9876543213", dosha: "Vata", condition: "Stress & Anxiety", symptoms: "Insomnia and restlessness", treatmentPlan: "Ashwagandha and meditation", payment: "₹450", lastVisit: "2025-01-12", status: "Active" },
    ];

    const foundPatient = mockPatients.find(p => p.id === patientId);
    if (foundPatient) {
      setPatient(foundPatient);
      setEditForm({
        name: foundPatient.name,
        age: foundPatient.age.toString(),
        address: foundPatient.address,
        phoneNumber: foundPatient.phoneNumber,
        dosha: foundPatient.dosha,
        condition: foundPatient.condition,
        symptoms: foundPatient.symptoms,
        treatmentPlan: foundPatient.treatmentPlan,
        payment: foundPatient.payment
      });
    }
  }, [patientId]);

  const handleLogout = async () => {
    try {
      await logOut();
      router.push('/auth');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleSave = () => {
    // In real app, save to API
    if (patient) {
      const updatedPatient = {
        ...patient,
        name: editForm.name,
        age: parseInt(editForm.age),
        address: editForm.address,
        phoneNumber: editForm.phoneNumber,
        dosha: editForm.dosha,
        condition: editForm.condition,
        symptoms: editForm.symptoms,
        treatmentPlan: editForm.treatmentPlan,
        payment: editForm.payment
      };
      setPatient(updatedPatient);
      setIsEditing(false);
      // Here you would typically update the parent component's state or call an API
    }
  };

  if (!patient) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50/40 to-emerald-50/60">
      <header className="sticky top-0 z-50 border-b-2 border-amber-300 bg-gradient-to-r from-amber-50 via-orange-50 to-emerald-50 shadow-lg backdrop-blur-sm">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <button onClick={() => router.push('/')} className="rounded-lg p-2 text-stone-700 transition-colors hover:bg-white/50">
              <ChevronRight className="h-5 w-5 rotate-180" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-full border-2 border-amber-400 bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 shadow-lg">
                <Leaf className="h-5 w-5 text-amber-100" />
              </div>
              <div>
                <h1 className="bg-gradient-to-r from-emerald-700 via-teal-600 to-amber-600 bg-clip-text text-xl font-black tracking-tight text-transparent">SADHAK</h1>
                <p className="text-xs font-medium tracking-wide text-amber-700">Patient Details</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="rounded-lg p-2 text-stone-700 transition-colors hover:bg-white/50">
              <Settings size={20} />
            </button>
            <button onClick={handleLogout} className="rounded-lg p-2 text-stone-700 transition-colors hover:bg-white/50">
              <LogOut size={20} />
            </button>
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
            <div className="flex items-center space-x-2">
              <Button onClick={() => setIsEditing(!isEditing)} className="bg-emerald-600 text-white hover:bg-emerald-700">
                {isEditing ? 'Cancel Edit' : 'Edit Patient'}
              </Button>
              {isEditing && (
                <Button onClick={handleSave} className="bg-emerald-600 text-white hover:bg-emerald-700">
                  Save Changes
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card className="border-amber-200">
              <CardHeader className="border-b border-amber-100 bg-gradient-to-r from-emerald-50 to-teal-50">
                <CardTitle className="text-stone-800">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    {isEditing ? (
                      <Input
                        id="name"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      />
                    ) : (
                      <p className="font-semibold text-stone-800">{patient.name}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="age">Age</Label>
                    {isEditing ? (
                      <Input
                        id="age"
                        type="number"
                        value={editForm.age}
                        onChange={(e) => setEditForm({ ...editForm, age: e.target.value })}
                      />
                    ) : (
                      <p className="text-stone-700">{patient.age} years</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    {isEditing ? (
                      <Input
                        id="address"
                        value={editForm.address}
                        onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                      />
                    ) : (
                      <p className="text-stone-700">{patient.address}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    {isEditing ? (
                      <Input
                        id="phoneNumber"
                        value={editForm.phoneNumber}
                        onChange={(e) => setEditForm({ ...editForm, phoneNumber: e.target.value })}
                      />
                    ) : (
                      <p className="text-stone-700">{patient.phoneNumber}</p>
                    )}
                  </div>
                </div>
                <div>
                  <Label htmlFor="dosha">Dosha Type</Label>
                  {isEditing ? (
                    <Select value={editForm.dosha} onValueChange={(value) => setEditForm({ ...editForm, dosha: value })}>
                      <SelectTrigger>
                        <SelectValue />
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
                  ) : (
                    <span className="inline-block rounded-full bg-teal-100 px-3 py-1 text-sm font-medium text-teal-700">{patient.dosha}</span>
                  )}
                </div>
                <div>
                  <Label htmlFor="condition">Condition</Label>
                  {isEditing ? (
                    <Input
                      id="condition"
                      value={editForm.condition}
                      onChange={(e) => setEditForm({ ...editForm, condition: e.target.value })}
                    />
                  ) : (
                    <p className="text-stone-700">{patient.condition}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-amber-200">
              <CardHeader className="border-b border-amber-100 bg-gradient-to-r from-amber-50 to-orange-50">
                <CardTitle className="text-stone-800">Medical Details</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div>
                  <Label htmlFor="symptoms">Symptoms</Label>
                  {isEditing ? (
                    <Textarea
                      id="symptoms"
                      value={editForm.symptoms}
                      onChange={(e) => setEditForm({ ...editForm, symptoms: e.target.value })}
                      rows={3}
                    />
                  ) : (
                    <p className="text-stone-700">{patient.symptoms}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="treatment">Treatment Plan</Label>
                  {isEditing ? (
                    <Textarea
                      id="treatment"
                      value={editForm.treatmentPlan}
                      onChange={(e) => setEditForm({ ...editForm, treatmentPlan: e.target.value })}
                      rows={3}
                    />
                  ) : (
                    <p className="text-stone-700">{patient.treatmentPlan}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="payment">Payment</Label>
                  {isEditing ? (
                    <Input
                      id="payment"
                      value={editForm.payment}
                      onChange={(e) => setEditForm({ ...editForm, payment: e.target.value })}
                    />
                  ) : (
                    <p className="font-semibold text-emerald-700">{patient.payment}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-amber-200">
            <CardHeader className="border-b border-amber-100 bg-gradient-to-r from-teal-50 to-emerald-50">
              <CardTitle className="text-stone-800">Visit History</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-stone-600">Last Visit</p>
                  <p className="font-semibold text-stone-800">{patient.lastVisit}</p>
                </div>
                <div>
                  <p className="text-sm text-stone-600">Status</p>
                  <span className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${patient.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                    {patient.status}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>


        </div>
      </main>
    </div>
  );
}
