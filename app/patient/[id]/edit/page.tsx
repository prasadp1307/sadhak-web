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
import { useAuth } from '../../../../components/AuthProvider';
import { logOut } from '../../../../lib/auth';
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

export default function EditPatientPage() {
  const params = useParams();
  const patientId = parseInt(params.id as string);
  const { user } = useAuth();
  const router = useRouter();

  const [patient, setPatient] = useState<Patient | null>(null);
  const [formData, setFormData] = useState({
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
      setFormData({
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
        name: formData.name,
        age: parseInt(formData.age),
        address: formData.address,
        phoneNumber: formData.phoneNumber,
        dosha: formData.dosha,
        condition: formData.condition,
        symptoms: formData.symptoms,
        treatmentPlan: formData.treatmentPlan,
        payment: formData.payment
      };
      setPatient(updatedPatient);
      // Here you would typically update the parent component's state or call an API
      alert('Patient updated successfully!');
      router.push(`/patient/${patientId}`);
    }
  };

  const handleCancel = () => {
    router.push(`/patient/${patientId}`);
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
                <p className="text-xs font-medium tracking-wide text-amber-700">Edit Patient</p>
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
              <h2 className="text-3xl font-bold text-stone-800">Edit Patient: {patient.name}</h2>
              <p className="text-stone-600">Patient ID: #{patient.id}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card className="border-amber-200">
              <CardHeader className="border-b border-amber-100 bg-gradient-to-r from-emerald-50 to-teal-50">
                <CardTitle className="text-stone-800">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="dosha">Dosha Type</Label>
                  <Select value={formData.dosha} onValueChange={(value) => setFormData({ ...formData, dosha: value })}>
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
                </div>
                <div>
                  <Label htmlFor="condition">Condition</Label>
                  <Input
                    id="condition"
                    value={formData.condition}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                  />
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
                  <Textarea
                    id="symptoms"
                    value={formData.symptoms}
                    onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="treatment">Treatment Plan</Label>
                  <Textarea
                    id="treatment"
                    value={formData.treatmentPlan}
                    onChange={(e) => setFormData({ ...formData, treatmentPlan: e.target.value })}
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="payment">Payment</Label>
                  <Input
                    id="payment"
                    value={formData.payment}
                    onChange={(e) => setFormData({ ...formData, payment: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end space-x-4">
            <Button onClick={handleCancel} variant="outline">
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-emerald-600 text-white hover:bg-emerald-700">
              Save Changes
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
