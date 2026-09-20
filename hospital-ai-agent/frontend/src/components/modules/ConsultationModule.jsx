import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Stethoscope,
  Activity,
  Heart,
  Thermometer,
  Wind,
  Plus,
  Trash2,
  FileCheck,
  Printer,
  X,
  User,
  AlertCircle,
  FlaskConical,
  CheckCircle2,
} from "lucide-react";
import { useHospital } from "../../context/HospitalContext";

export default function ConsultationModule() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    patients,
    doctors,
    recordConsultation,
    orderLabTest,
    pharmacy,
  } = useHospital();

  const preselectedPatient = location.state?.patient ||
    (location.state?.appointment
      ? patients.find((p) => p.name === location.state.appointment.patientName)
      : patients[0]);

  const [selectedPatientId, setSelectedPatientId] = useState(preselectedPatient?.id || patients[0]?.id);
  const patient = patients.find((p) => p.id === selectedPatientId) || patients[0];

  const [selectedDoctorId, setSelectedDoctorId] = useState(doctors[0]?.id);
  const doctor = doctors.find((d) => d.id === selectedDoctorId) || doctors[0];

  // Clinical Vitals Form
  const [vitals, setVitals] = useState({
    bloodPressure: "120/80 mmHg",
    heartRate: "72 bpm",
    temperature: "98.6 °F",
    spO2: "99%",
    respiratoryRate: "16 bpm",
    weight: "70 kg",
  });

  // Clinical Assessment
  const [symptoms, setSymptoms] = useState(
    location.state?.appointment?.reason || "Mild fever, throat irritation, and fatigue for 2 days."
  );
  const [diagnosis, setDiagnosis] = useState("J06.9 - Acute upper respiratory infection, unspecified");
  const [doctorNotes, setDoctorNotes] = useState(
    "Patient conscious, alert, and oriented. Chest clear bilaterally to auscultation. Pharyngeal erythema noted."
  );
  const [treatmentPlan, setTreatmentPlan] = useState(
    "Warm saline gargles, adequate oral hydration, bed rest. Follow up in 5 days if fever persists."
  );

  // e-Prescription Items
  const [prescriptions, setPrescriptions] = useState([
    {
      medicine: "Paracetamol IV Infusion",
      dosage: "650mg",
      frequency: "Three times daily after meals",
      duration: "3 days",
    },
    {
      medicine: "Amoxicillin & Clavulanate",
      dosage: "625mg",
      frequency: "Twice daily after food",
      duration: "5 days",
    },
  ]);

  // Recommended Lab Tests
  const [selectedLabTest, setSelectedLabTest] = useState("Complete Blood Count (CBC) with Diff");
  const [orderedTests, setOrderedTests] = useState(["Complete Blood Count (CBC) with Diff"]);

  // Prescription print preview modal
  const [completedConsultation, setCompletedConsultation] = useState(null);

  const handleAddMedicine = () => {
    setPrescriptions((prev) => [
      ...prev,
      { medicine: "Atorvastatin Calcium", dosage: "20mg", frequency: "Once daily at night", duration: "10 days" },
    ]);
  };

  const handleRemoveMedicine = (index) => {
    setPrescriptions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateMedicine = (index, field, value) => {
    setPrescriptions((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const handleAddLabTest = () => {
    if (selectedLabTest && !orderedTests.includes(selectedLabTest)) {
      setOrderedTests((prev) => [...prev, selectedLabTest]);
    }
  };

  const handleRemoveLabTest = (testName) => {
    setOrderedTests((prev) => prev.filter((t) => t !== testName));
  };

  const handleSaveConsultation = (e) => {
    e.preventDefault();
    if (!patient || !doctor) return;

    const consultData = {
      appointmentId: location.state?.appointment?.id || null,
      patientId: patient.id,
      patientName: patient.name,
      doctorId: doctor.id,
      doctorName: doctor.name,
      department: doctor.department,
      vitals,
      symptoms,
      diagnosis,
      doctorNotes,
      treatmentPlan,
      prescriptions,
      recommendedTests: orderedTests,
    };

    const saved = recordConsultation(consultData);

    // Order any attached lab tests
    orderedTests.forEach((testName) => {
      orderLabTest({
        patientId: patient.id,
        patientName: patient.name,
        doctorId: doctor.id,
        doctorName: doctor.name,
        testName,
        category: "Clinical Pathology",
      });
    });

    setCompletedConsultation(saved);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Doctor Consultation Workbench
          </h1>
          <p className="text-xs text-slate-500 sm:text-sm">
            Clinical examination, vitals charting, diagnosis, e-prescribing, and lab orders.
          </p>
        </div>

        {/* Doctor selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Attending Physician:</span>
          <select
            value={selectedDoctorId}
            onChange={(e) => setSelectedDoctorId(e.target.value)}
            className="input-field max-w-xs font-semibold text-blue-700"
          >
            {doctors.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.specialty})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Patient Banner */}
      <div className="card p-4 bg-gradient-to-r from-blue-50/80 via-indigo-50/60 to-white border-blue-100">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white font-bold text-lg">
              {patient?.name?.charAt(0) || "P"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">{patient?.name}</h2>
                <span className="badge-rose font-mono">{patient?.bloodGroup}</span>
                <span className="badge-purple">{patient?.admissionStatus}</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {patient?.age} yrs • {patient?.gender} • ID:{" "}
                <span className="font-mono font-bold text-blue-600">{patient?.id}</span> • Allergies:{" "}
                <span className="text-amber-700 font-semibold">{patient?.allergies}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-600">Switch Patient:</label>
            <select
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="input-field text-xs max-w-xs"
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.id})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Consultation Form */}
      <form onSubmit={handleSaveConsultation} className="space-y-6">
        {/* Section 1: Patient Vitals Bar */}
        <div className="card p-5">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Activity className="h-4 w-4 text-blue-600" /> Patient Vitals Signs
          </h3>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 text-xs">
            <div>
              <label className="font-semibold text-slate-600">Blood Pressure</label>
              <input
                type="text"
                value={vitals.bloodPressure}
                onChange={(e) => setVitals({ ...vitals, bloodPressure: e.target.value })}
                className="input-field mt-1"
                placeholder="120/80 mmHg"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-600">Heart Rate (Pulse)</label>
              <input
                type="text"
                value={vitals.heartRate}
                onChange={(e) => setVitals({ ...vitals, heartRate: e.target.value })}
                className="input-field mt-1"
                placeholder="72 bpm"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-600">Body Temp</label>
              <input
                type="text"
                value={vitals.temperature}
                onChange={(e) => setVitals({ ...vitals, temperature: e.target.value })}
                className="input-field mt-1"
                placeholder="98.6 °F"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-600">SpO2 Oxygen</label>
              <input
                type="text"
                value={vitals.spO2}
                onChange={(e) => setVitals({ ...vitals, spO2: e.target.value })}
                className="input-field mt-1"
                placeholder="99%"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-600">Resp. Rate</label>
              <input
                type="text"
                value={vitals.respiratoryRate}
                onChange={(e) => setVitals({ ...vitals, respiratoryRate: e.target.value })}
                className="input-field mt-1"
                placeholder="16 bpm"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-600">Weight</label>
              <input
                type="text"
                value={vitals.weight}
                onChange={(e) => setVitals({ ...vitals, weight: e.target.value })}
                className="input-field mt-1"
                placeholder="70 kg"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Clinical Assessment & Diagnosis */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="card p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Stethoscope className="h-4 w-4 text-indigo-600" /> Symptoms & Clinical Diagnosis
            </h3>

            <div>
              <label className="text-xs font-semibold text-slate-700">
                Chief Complaints & Symptoms
              </label>
              <textarea
                rows={3}
                required
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                className="input-field mt-1 resize-none"
                placeholder="Describe presenting symptoms and clinical timeline..."
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">
                Clinical Diagnosis (ICD-10 or Condition)
              </label>
              <input
                type="text"
                required
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                className="input-field mt-1"
                placeholder="e.g., J06.9 - Acute Upper Respiratory Infection"
              />
            </div>
          </div>

          <div className="card p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <FileCheck className="h-4 w-4 text-emerald-600" /> Doctor Notes & Treatment Plan
            </h3>

            <div>
              <label className="text-xs font-semibold text-slate-700">
                Doctor's Clinical Examination Notes
              </label>
              <textarea
                rows={3}
                value={doctorNotes}
                onChange={(e) => setDoctorNotes(e.target.value)}
                className="input-field mt-1 resize-none"
                placeholder="Physical examination, heart/lung sounds, general appearance..."
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">
                Treatment Plan & Lifestyle Recommendations
              </label>
              <input
                type="text"
                value={treatmentPlan}
                onChange={(e) => setTreatmentPlan(e.target.value)}
                className="input-field mt-1"
                placeholder="Dietary guidance, fluid intake, follow-up schedule..."
              />
            </div>
          </div>
        </div>

        {/* Section 3: e-Prescription & Diagnostic Tests */}
        <div className="card p-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                e-Prescription & Medication Orders
              </h3>
              <p className="text-xs text-slate-500">
                Digital prescriptions synchronized with hospital pharmacy inventory.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddMedicine}
              className="btn-secondary text-xs"
            >
              <Plus className="h-3.5 w-3.5" /> Add Medication
            </button>
          </div>

          <div className="mt-4 space-y-2.5">
            {prescriptions.map((p, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 gap-2 rounded-xl bg-slate-50 p-3 border border-slate-200/70 sm:grid-cols-12 sm:items-center text-xs"
              >
                <div className="sm:col-span-4">
                  <label className="font-semibold text-slate-500 block text-[10px]">Medicine</label>
                  <input
                    type="text"
                    value={p.medicine}
                    onChange={(e) => handleUpdateMedicine(idx, "medicine", e.target.value)}
                    className="input-field mt-0.5"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="font-semibold text-slate-500 block text-[10px]">Dosage</label>
                  <input
                    type="text"
                    value={p.dosage}
                    onChange={(e) => handleUpdateMedicine(idx, "dosage", e.target.value)}
                    className="input-field mt-0.5"
                    placeholder="e.g. 500mg"
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className="font-semibold text-slate-500 block text-[10px]">Frequency</label>
                  <input
                    type="text"
                    value={p.frequency}
                    onChange={(e) => handleUpdateMedicine(idx, "frequency", e.target.value)}
                    className="input-field mt-0.5"
                    placeholder="Twice daily after food"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="font-semibold text-slate-500 block text-[10px]">Duration</label>
                  <input
                    type="text"
                    value={p.duration}
                    onChange={(e) => handleUpdateMedicine(idx, "duration", e.target.value)}
                    className="input-field mt-0.5"
                    placeholder="5 days"
                  />
                </div>
                <div className="sm:col-span-1 flex justify-end mt-2 sm:mt-4">
                  <button
                    type="button"
                    onClick={() => handleRemoveMedicine(idx)}
                    className="rounded-lg p-1.5 text-rose-600 hover:bg-rose-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Diagnostic Lab Test Order */}
          <div className="mt-6 border-t border-slate-100 pt-4">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <FlaskConical className="h-4 w-4 text-purple-600" /> Order Laboratory Tests
            </h4>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <select
                value={selectedLabTest}
                onChange={(e) => setSelectedLabTest(e.target.value)}
                className="input-field max-w-sm text-xs"
              >
                <option value="Complete Blood Count (CBC) with Diff">Complete Blood Count (CBC) with Diff</option>
                <option value="Comprehensive Metabolic & Lipid Panel">Comprehensive Metabolic & Lipid Panel</option>
                <option value="Cardiac Troponin I & CK-MB">Cardiac Troponin I & CK-MB</option>
                <option value="Brain MRI with Contrast">Brain MRI with Contrast</option>
                <option value="Chest X-Ray (PA View)">Chest X-Ray (PA View)</option>
                <option value="Urinalysis Routine">Urinalysis Routine</option>
              </select>
              <button
                type="button"
                onClick={handleAddLabTest}
                className="btn-secondary text-xs"
              >
                <Plus className="h-3.5 w-3.5" /> Attach Test Order
              </button>
            </div>

            {orderedTests.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {orderedTests.map((test) => (
                  <span
                    key={test}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700 border border-purple-200"
                  >
                    {test}
                    <button
                      type="button"
                      onClick={() => handleRemoveLabTest(test)}
                      className="text-purple-400 hover:text-purple-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            <FileCheck className="h-4 w-4" /> Save Consultation & Issue e-Prescription
          </button>
        </div>
      </form>

      {/* Completed Consultation & e-Prescription Print Modal */}
      {completedConsultation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2 text-emerald-600">
                <CheckCircle2 className="h-6 w-6" />
                <h3 className="text-lg font-bold text-slate-900">Consultation Completed</h3>
              </div>
              <button
                onClick={() => setCompletedConsultation(null)}
                className="rounded-xl p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Printable Prescription Slip */}
            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/50 p-6 text-xs text-slate-800 space-y-4">
              <div className="flex justify-between border-b border-slate-200 pb-3">
                <div>
                  <h2 className="text-base font-black text-blue-700">AuraCare Hospital</h2>
                  <p className="text-[11px] text-slate-500">Electronic Prescription & Medical Record</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900">{completedConsultation.doctorName}</p>
                  <p className="text-[11px] text-slate-500">{completedConsultation.department}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-b border-slate-200 pb-3">
                <div>
                  <p className="text-slate-400">Patient:</p>
                  <p className="font-bold text-slate-900">{completedConsultation.patientName}</p>
                  <p className="text-slate-500">ID: {completedConsultation.patientId}</p>
                </div>
                <div>
                  <p className="text-slate-400">Date & Vitals:</p>
                  <p className="font-semibold text-slate-900">{completedConsultation.date}</p>
                  <p className="text-slate-500">
                    BP: {completedConsultation.vitals?.bloodPressure} | HR: {completedConsultation.vitals?.heartRate}
                  </p>
                </div>
              </div>

              <div>
                <p className="font-bold text-slate-700">Clinical Diagnosis:</p>
                <p className="text-slate-800 font-medium">{completedConsultation.diagnosis}</p>
              </div>

              <div>
                <p className="font-bold text-slate-700">Rx Prescribed Medications:</p>
                <ul className="mt-1 space-y-1.5 pl-4 list-disc">
                  {completedConsultation.prescriptions?.map((rx, idx) => (
                    <li key={idx}>
                      <strong className="text-slate-900">{rx.medicine}</strong> ({rx.dosage}) —{" "}
                      {rx.frequency} for {rx.duration}
                    </li>
                  ))}
                </ul>
              </div>

              {completedConsultation.recommendedTests?.length > 0 && (
                <div>
                  <p className="font-bold text-slate-700">Diagnostic Tests Ordered:</p>
                  <p className="text-purple-700">{completedConsultation.recommendedTests.join(", ")}</p>
                </div>
              )}
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => window.print()}
                className="btn-secondary"
              >
                <Printer className="h-4 w-4" /> Print e-Prescription
              </button>
              <button
                onClick={() => {
                  setCompletedConsultation(null);
                  navigate("/records");
                }}
                className="btn-primary"
              >
                Go to Medical Records
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
