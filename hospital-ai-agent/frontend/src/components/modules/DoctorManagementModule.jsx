import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Stethoscope,
  Star,
  Clock,
  MapPin,
  DollarSign,
  Calendar,
  CheckCircle,
  XCircle,
  Plus,
  Search,
  Building,
  UserPlus,
  X,
} from "lucide-react";
import { useHospital } from "../../context/HospitalContext";

export default function DoctorManagementModule() {
  const navigate = useNavigate();
  const { doctors, toggleDoctorAvailability, addDoctor } = useHospital();
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDoctorOpen, setIsAddDoctorOpen] = useState(false);
  const [scheduleModalDoctor, setScheduleModalDoctor] = useState(null);

  const [newDoctorData, setNewDoctorData] = useState({
    name: "",
    email: "",
    specialty: "Cardiology",
    department: "Cardiovascular Sciences",
    fee: 150,
    room: "OPD-305",
    phone: "",
    schedule: "Mon - Fri, 09:00 AM - 04:00 PM",
  });

  const departments = ["All", "Cardiovascular Sciences", "Neurosciences", "Pediatrics & Child Care", "Orthopedic Surgery"];

  const filteredDoctors = doctors.filter((doc) => {
    const matchesDept = departmentFilter === "All" || doc.department === departmentFilter;
    const matchesSearch =
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.specialty?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.department?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDept && matchesSearch;
  });

  const handleAddDoctor = (e) => {
    e.preventDefault();
    if (!newDoctorData.name) return;
    addDoctor(newDoctorData);
    setIsAddDoctorOpen(false);
    setNewDoctorData({
      name: "",
      email: "",
      specialty: "Cardiology",
      department: "Cardiovascular Sciences",
      fee: 150,
      room: "OPD-305",
      phone: "",
      schedule: "Mon - Fri, 09:00 AM - 04:00 PM",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Doctor Directory & Schedules
          </h1>
          <p className="text-xs text-slate-500 sm:text-sm">
            Manage physician profiles, clinical specialties, consultation rates, and duty shifts.
          </p>
        </div>

        <button
          onClick={() => setIsAddDoctorOpen(true)}
          className="btn-primary"
        >
          <UserPlus className="h-4 w-4" /> Add Specialist
        </button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setDepartmentFilter(dept)}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                departmentFilter === dept
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {dept === "All" ? "All Departments" : dept.split(" ")[0]}
            </button>
          ))}
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search doctors, specialty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-9 text-xs"
          />
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filteredDoctors.map((doc) => {
          const isOnDuty = doc.availability === "on_duty";
          return (
            <div
              key={doc.id}
              className="card card-hover flex flex-col justify-between overflow-hidden p-5"
            >
              <div>
                {/* Doctor Head */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={doc.avatar}
                      alt={doc.name}
                      className="h-14 w-14 rounded-2xl object-cover border-2 border-slate-100 shadow-sm"
                    />
                    <div>
                      <h3 className="text-base font-bold text-slate-900">{doc.name}</h3>
                      <span className="badge-blue mt-0.5">{doc.specialty}</span>
                      <p className="mt-1 text-[11px] text-slate-500">{doc.department}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleDoctorAvailability(doc.id)}
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold border transition ${
                      isOnDuty
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-slate-100 text-slate-500 border-slate-200"
                    }`}
                    title="Click to toggle On Duty / Off Duty"
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        isOnDuty ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
                      }`}
                    />
                    {isOnDuty ? "On Duty" : "Off Duty"}
                  </button>
                </div>

                {/* Info Pills */}
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-2 border border-slate-100">
                    <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                    <div>
                      <span className="text-[10px] text-slate-400 block">Rating</span>
                      <span className="font-bold text-slate-800">{doc.rating || 4.9}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-2 border border-slate-100">
                    <DollarSign className="h-4 w-4 text-emerald-600" />
                    <div>
                      <span className="text-[10px] text-slate-400 block">Consult Fee</span>
                      <span className="font-bold text-slate-800">${doc.fee || 150}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-2 border border-slate-100">
                    <MapPin className="h-4 w-4 text-blue-600" />
                    <div>
                      <span className="text-[10px] text-slate-400 block">Clinic Room</span>
                      <span className="font-bold text-slate-800">{doc.room || "OPD-101"}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-2 border border-slate-100">
                    <Clock className="h-4 w-4 text-purple-600" />
                    <div>
                      <span className="text-[10px] text-slate-400 block">Experience</span>
                      <span className="font-bold text-slate-800">{doc.experience || "10+ yrs"}</span>
                    </div>
                  </div>
                </div>

                {/* Schedule preview */}
                <div className="mt-3 flex items-center justify-between rounded-xl bg-blue-50/60 px-3 py-2 text-[11px] text-blue-900 border border-blue-100">
                  <span className="font-medium flex items-center gap-1.5 truncate">
                    <Calendar className="h-3.5 w-3.5 text-blue-600" />
                    {doc.schedule || "Mon - Fri, 09:00 AM - 04:00 PM"}
                  </span>
                  <button
                    onClick={() => setScheduleModalDoctor(doc)}
                    className="font-bold text-blue-700 hover:underline flex-shrink-0 ml-2"
                  >
                    Details
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 flex gap-2 border-t border-slate-100 pt-3">
                <button
                  onClick={() => navigate("/appointments", { state: { doctorId: doc.id } })}
                  className="btn-primary flex-1 text-xs py-2"
                >
                  Book Appointment
                </button>
                <button
                  onClick={() => navigate("/consultation", { state: { doctorId: doc.id } })}
                  className="btn-secondary text-xs py-2"
                >
                  Consult
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Doctor Modal */}
      {isAddDoctorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Add Doctor / Specialist</h3>
              <button
                onClick={() => setIsAddDoctorOpen(false)}
                className="rounded-xl p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddDoctor} className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700">Doctor's Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Meredith Grey"
                  value={newDoctorData.name}
                  onChange={(e) => setNewDoctorData({ ...newDoctorData, name: e.target.value })}
                  className="input-field mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700">Specialty</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., General Surgery, Cardiology"
                    value={newDoctorData.specialty}
                    onChange={(e) => setNewDoctorData({ ...newDoctorData, specialty: e.target.value })}
                    className="input-field mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700">Department</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Surgical Sciences"
                    value={newDoctorData.department}
                    onChange={(e) => setNewDoctorData({ ...newDoctorData, department: e.target.value })}
                    className="input-field mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700">Consultation Fee ($)</label>
                  <input
                    type="number"
                    value={newDoctorData.fee}
                    onChange={(e) => setNewDoctorData({ ...newDoctorData, fee: Number(e.target.value) })}
                    className="input-field mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700">Clinic Room / Bay</label>
                  <input
                    type="text"
                    placeholder="e.g. OPD-305"
                    value={newDoctorData.room}
                    onChange={(e) => setNewDoctorData({ ...newDoctorData, room: e.target.value })}
                    className="input-field mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Weekly Schedule</label>
                <input
                  type="text"
                  placeholder="Mon - Fri, 09:00 AM - 04:00 PM"
                  value={newDoctorData.schedule}
                  onChange={(e) => setNewDoctorData({ ...newDoctorData, schedule: e.target.value })}
                  className="input-field mt-1"
                />
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddDoctorOpen(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Doctor Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule Detail Modal */}
      {scheduleModalDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">{scheduleModalDoctor.name}</h3>
                <p className="text-xs text-blue-600">{scheduleModalDoctor.specialty}</p>
              </div>
              <button
                onClick={() => setScheduleModalDoctor(null)}
                className="rounded-xl p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-2 text-xs">
              <p className="font-semibold text-slate-700">Weekly OPD Consultation Hours:</p>
              <div className="rounded-xl bg-slate-50 p-3 space-y-1.5 text-slate-600 border border-slate-100">
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span>Monday - Wednesday</span>
                  <span className="font-bold text-slate-800">09:00 AM - 01:00 PM (Morning OPD)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span>Thursday - Friday</span>
                  <span className="font-bold text-slate-800">02:00 PM - 05:00 PM (Evening OPD)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Saturday</span>
                  <span className="font-bold text-amber-600">On-Call Emergency</span>
                </div>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setScheduleModalDoctor(null)}
                className="btn-primary w-full"
              >
                Close Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
