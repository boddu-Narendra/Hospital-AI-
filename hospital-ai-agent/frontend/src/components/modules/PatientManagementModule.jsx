import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  UserPlus,
  Search,
  Phone,
  Mail,
  Heart,
  AlertCircle,
  Calendar,
  BedDouble,
  FileText,
  Activity,
  X,
  Stethoscope,
  ChevronRight,
  Filter,
} from "lucide-react";
import { useHospital } from "../../context/HospitalContext";

export default function PatientManagementModule() {
  const navigate = useNavigate();
  const { patients, addPatient, updatePatient, doctors } = useHospital();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  // New patient registration form state
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "Male",
    bloodGroup: "O+",
    phone: "",
    email: "",
    address: "",
    emergencyContact: "",
    allergies: "None",
    chronicConditions: "None",
    primaryDoctorId: doctors[0]?.id || "",
    primaryDoctorName: doctors[0]?.name || "",
  });

  const statuses = ["All", "Outpatient", "Admitted", "Discharged"];

  const filteredPatients = patients.filter((patient) => {
    const matchesStatus = statusFilter === "All" || patient.admissionStatus === statusFilter;
    const matchesSearch =
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.appointmentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (patient.phone && patient.phone.includes(searchTerm));
    return matchesStatus && matchesSearch;
  });

  const handleRegister = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    const assignedDoc = doctors.find((d) => d.id === formData.primaryDoctorId);
    const newPat = addPatient({
      ...formData,
      age: Number(formData.age || 30),
      primaryDoctorName: assignedDoc ? assignedDoc.name : "Dr. Sarah Jenkins",
    });
    setIsRegisterOpen(false);
    setSelectedPatient(newPat);
    setFormData({
      name: "",
      age: "",
      gender: "Male",
      bloodGroup: "O+",
      phone: "",
      email: "",
      address: "",
      emergencyContact: "",
      allergies: "None",
      chronicConditions: "None",
      primaryDoctorId: doctors[0]?.id || "",
      primaryDoctorName: doctors[0]?.name || "",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Patient Management
          </h1>
          <p className="text-xs text-slate-500 sm:text-sm">
            EHR registration, demographic profiles, admission statuses, and clinical records.
          </p>
        </div>

        <button
          onClick={() => setIsRegisterOpen(true)}
          className="btn-primary"
        >
          <UserPlus className="h-4 w-4" /> Register New Patient
        </button>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition ${
                statusFilter === st
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, ID (e.g. PAT-1001), phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-9"
          />
        </div>
      </div>

      {/* Patients Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold">
              <tr>
                <th className="py-3.5 px-4">Patient Info</th>
                <th className="py-3.5 px-4">Demographics</th>
                <th className="py-3.5 px-4">Admission Status</th>
                <th className="py-3.5 px-4">Primary Doctor</th>
                <th className="py-3.5 px-4">Allergies & Alerts</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-400">
                    No patient records found matching search.
                  </td>
                </tr>
              ) : (
                filteredPatients.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-bold text-slate-900 text-sm">{p.name}</p>
                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500">
                          <span className="font-mono font-medium text-blue-600">{p.id}</span>
                          <span>•</span>
                          <span>Appt ID: {p.appointmentId}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-medium text-slate-800">
                        {p.age} yrs • {p.gender}
                      </p>
                      <span className="badge-rose mt-0.5 font-mono">{p.bloodGroup}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                          p.admissionStatus === "Admitted"
                            ? "bg-purple-50 text-purple-700 border-purple-200"
                            : p.admissionStatus === "Discharged"
                            ? "bg-slate-100 text-slate-600 border-slate-200"
                            : "bg-emerald-50 text-emerald-700 border-emerald-200"
                        }`}
                      >
                        {p.admissionStatus}
                      </span>
                      {p.bedId && (
                        <p className="mt-0.5 text-[10px] text-slate-500 font-mono">
                          Bed: {p.bedId}
                        </p>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      <p className="font-medium">{p.primaryDoctorName || "Dr. Sarah Jenkins"}</p>
                      <p className="text-[10px] text-slate-400">{p.phone}</p>
                    </td>
                    <td className="py-3 px-4 max-w-[200px]">
                      {p.allergies && p.allergies !== "None" ? (
                        <span className="badge-amber truncate max-w-full">
                          <AlertCircle className="h-3 w-3 text-amber-600" />
                          {p.allergies}
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400">No known allergies</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedPatient(p)}
                          className="rounded-lg bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700 hover:bg-blue-100 transition"
                        >
                          Profile
                        </button>
                        <button
                          onClick={() =>
                            navigate("/appointments", { state: { patientId: p.id } })
                          }
                          className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-slate-600 hover:bg-slate-50 transition"
                          title="Book appointment"
                        >
                          Book
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Register Patient Modal */}
      {isRegisterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">New Patient Registration</h3>
                <p className="text-xs text-slate-500">Record complete demographic & medical intake</p>
              </div>
              <button
                onClick={() => setIsRegisterOpen(false)}
                className="rounded-xl p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleRegister} className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700">Patient Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field mt-1"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700">Age</label>
                  <input
                    type="number"
                    required
                    placeholder="35"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="input-field mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="input-field mt-1"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700">Blood Group</label>
                  <select
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                    className="input-field mt-1"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700">Phone Number</label>
                  <input
                    type="text"
                    required
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="input-field mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700">Email (Optional)</label>
                  <input
                    type="email"
                    placeholder="patient@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input-field mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Residential Address</label>
                <input
                  type="text"
                  placeholder="Street, City, Postal Code"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="input-field mt-1"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Emergency Contact</label>
                <input
                  type="text"
                  placeholder="Name (Relationship) - Phone Number"
                  value={formData.emergencyContact}
                  onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                  className="input-field mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700">Known Allergies</label>
                  <input
                    type="text"
                    placeholder="e.g. Penicillin, Peanuts"
                    value={formData.allergies}
                    onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                    className="input-field mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700">Chronic Conditions</label>
                  <input
                    type="text"
                    placeholder="e.g. Hypertension, Asthma"
                    value={formData.chronicConditions}
                    onChange={(e) => setFormData({ ...formData, chronicConditions: e.target.value })}
                    className="input-field mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Assign Primary Physician</label>
                <select
                  value={formData.primaryDoctorId}
                  onChange={(e) => setFormData({ ...formData, primaryDoctorId: e.target.value })}
                  className="input-field mt-1"
                >
                  {doctors.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.name} ({doc.specialty})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setIsRegisterOpen(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Complete Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detailed Patient Profile Drawer / Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-extrabold text-slate-900">{selectedPatient.name}</h2>
                  <span className="badge-rose font-mono">{selectedPatient.bloodGroup}</span>
                  <span className="badge-purple">{selectedPatient.admissionStatus}</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Patient ID: <span className="font-mono text-blue-600 font-bold">{selectedPatient.id}</span> • Appointment Pass: <span className="font-mono font-bold text-slate-700">{selectedPatient.appointmentId}</span>
                </p>
              </div>
              <button
                onClick={() => setSelectedPatient(null)}
                className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100 space-y-2">
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">Demographic & Contact</h4>
                <p><span className="text-slate-400">Age / Gender:</span> <strong className="text-slate-800">{selectedPatient.age} years / {selectedPatient.gender}</strong></p>
                <p><span className="text-slate-400">Phone:</span> <strong className="text-slate-800">{selectedPatient.phone}</strong></p>
                <p><span className="text-slate-400">Email:</span> <strong className="text-slate-800">{selectedPatient.email || "Not specified"}</strong></p>
                <p><span className="text-slate-400">Address:</span> <strong className="text-slate-800">{selectedPatient.address || "On file"}</strong></p>
                <p><span className="text-slate-400">Emergency Contact:</span> <strong className="text-slate-800">{selectedPatient.emergencyContact || "None"}</strong></p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100 space-y-2">
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">Clinical Status</h4>
                <p><span className="text-slate-400">Primary Doctor:</span> <strong className="text-blue-700">{selectedPatient.primaryDoctorName}</strong></p>
                <p><span className="text-slate-400">Bed Allocation:</span> <strong className="text-slate-800">{selectedPatient.bedId || "Outpatient (None)"}</strong></p>
                <p><span className="text-slate-400">Allergies:</span> <strong className="text-amber-700">{selectedPatient.allergies}</strong></p>
                <p><span className="text-slate-400">Chronic Issues:</span> <strong className="text-slate-800">{selectedPatient.chronicConditions}</strong></p>
                <p><span className="text-slate-400">Registered:</span> <strong className="text-slate-800">{selectedPatient.registeredDate}</strong></p>
              </div>
            </div>

            {/* Action Bar */}
            <div className="mt-6 flex flex-wrap justify-end gap-2 border-t border-slate-100 pt-4">
              <button
                onClick={() => {
                  const pat = selectedPatient;
                  setSelectedPatient(null);
                  navigate("/appointments", { state: { patientId: pat.id } });
                }}
                className="btn-primary text-xs"
              >
                <Calendar className="h-3.5 w-3.5" /> Book Appointment
              </button>
              <button
                onClick={() => {
                  const pat = selectedPatient;
                  setSelectedPatient(null);
                  navigate("/consultation", { state: { patient: pat } });
                }}
                className="btn-secondary text-xs"
              >
                <Stethoscope className="h-3.5 w-3.5" /> Start Consultation
              </button>
              <button
                onClick={() => {
                  const pat = selectedPatient;
                  setSelectedPatient(null);
                  navigate("/records", { state: { patientId: pat.id } });
                }}
                className="btn-secondary text-xs"
              >
                <FileText className="h-3.5 w-3.5" /> View Medical Records
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
