import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Calendar,
  Clock,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle,
  User,
  Stethoscope,
  Filter,
  X,
  RotateCcw,
  Play,
} from "lucide-react";
import { useHospital } from "../../context/HospitalContext";

export default function AppointmentModule() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    appointments,
    bookAppointment,
    updateAppointmentStatus,
    cancelAppointment,
    doctors,
    patients,
  } = useHospital();

  const [statusFilter, setStatusFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [rescheduleAppointmentItem, setRescheduleAppointmentItem] = useState(null);
  const [cancelModalItem, setCancelModalItem] = useState(null);
  const [cancelReason, setCancelReason] = useState("");

  // New appointment form state
  const [formData, setFormData] = useState({
    patientId: location.state?.patientId || (patients[0]?.id || ""),
    doctorId: location.state?.doctorId || (doctors[0]?.id || ""),
    date: "2026-09-19",
    time: "11:00 AM",
    type: "Routine Checkup",
    reason: "",
    priority: "Normal",
  });

  const statuses = ["All", "Scheduled", "In-Progress", "Confirmed", "Completed", "Cancelled"];

  const filteredAppointments = appointments.filter((app) => {
    const matchesStatus = statusFilter === "All" || app.status === statusFilter;
    const matchesSearch =
      app.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.reason?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleBook = (e) => {
    e.preventDefault();
    const selPatient = patients.find((p) => p.id === formData.patientId);
    const selDoctor = doctors.find((d) => d.id === formData.doctorId);

    bookAppointment({
      ...formData,
      patientName: selPatient ? selPatient.name : "Patient",
      patientPhone: selPatient ? selPatient.phone : "+1 (555) 000-0000",
      doctorName: selDoctor ? selDoctor.name : "Doctor",
      department: selDoctor ? selDoctor.department : "General",
    });

    setIsBookModalOpen(false);
    setFormData({
      patientId: patients[0]?.id || "",
      doctorId: doctors[0]?.id || "",
      date: "2026-09-19",
      time: "11:00 AM",
      type: "Routine Checkup",
      reason: "",
      priority: "Normal",
    });
  };

  const handleRescheduleSubmit = (e) => {
    e.preventDefault();
    if (!rescheduleAppointmentItem) return;
    updateAppointmentStatus(rescheduleAppointmentItem.id, "Scheduled");
    setRescheduleAppointmentItem(null);
  };

  const handleCancelSubmit = (e) => {
    e.preventDefault();
    if (!cancelModalItem) return;
    cancelAppointment(cancelModalItem.id, cancelReason || "Cancelled upon request");
    setCancelModalItem(null);
    setCancelReason("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Appointment Management
          </h1>
          <p className="text-xs text-slate-500 sm:text-sm">
            Book consultations, track patient queues, reschedule appointments, and handle cancellations.
          </p>
        </div>

        <button
          onClick={() => setIsBookModalOpen(true)}
          className="btn-primary"
        >
          <Plus className="h-4 w-4" /> Book New Appointment
        </button>
      </div>

      {/* Status Chips and Search */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                statusFilter === st
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search patient, doctor, reason..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-9 text-xs"
          />
        </div>
      </div>

      {/* Appointments List / Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold">
              <tr>
                <th className="py-3.5 px-4">Patient</th>
                <th className="py-3.5 px-4">Doctor & Specialty</th>
                <th className="py-3.5 px-4">Date & Time</th>
                <th className="py-3.5 px-4">Type & Reason</th>
                <th className="py-3.5 px-4">Priority</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-400">
                    No appointments found matching current filters.
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900">{app.patientName}</p>
                      <p className="text-[10px] text-slate-400">{app.patientPhone}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-800">{app.doctorName}</p>
                      <span className="badge-blue mt-0.5">{app.department}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1 font-medium text-slate-800">
                        <Calendar className="h-3.5 w-3.5 text-blue-600" />
                        {app.date}
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                        <Clock className="h-3 w-3 text-slate-400" />
                        {app.time}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 max-w-[200px]">
                      <span className="font-medium text-slate-700 block truncate">{app.type}</span>
                      <p className="text-[11px] text-slate-500 truncate">{app.reason}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold border ${
                          app.priority === "Urgent"
                            ? "bg-rose-50 text-rose-700 border-rose-200"
                            : app.priority === "High"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-slate-100 text-slate-700 border-slate-200"
                        }`}
                      >
                        {app.priority}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                          app.status === "Completed"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : app.status === "In-Progress"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : app.status === "Cancelled"
                            ? "bg-rose-50 text-rose-700 border-rose-200"
                            : "bg-slate-100 text-slate-700 border-slate-200"
                        }`}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {app.status !== "Completed" && app.status !== "Cancelled" && (
                          <>
                            <button
                              onClick={() =>
                                navigate("/consultation", { state: { appointment: app } })
                              }
                              className="rounded-lg bg-blue-50 p-1.5 text-blue-700 hover:bg-blue-100 transition"
                              title="Start Consultation"
                            >
                              <Play className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => setRescheduleAppointmentItem(app)}
                              className="rounded-lg bg-slate-100 p-1.5 text-slate-600 hover:bg-slate-200 transition"
                              title="Reschedule"
                            >
                              <RotateCcw className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => setCancelModalItem(app)}
                              className="rounded-lg bg-rose-50 p-1.5 text-rose-600 hover:bg-rose-100 transition"
                              title="Cancel Appointment"
                            >
                              <XCircle className="h-3.5 w-3.5" />
                            </button>
                          </>
                        )}
                        {app.status === "Completed" && (
                          <span className="text-[10px] font-semibold text-emerald-600 flex items-center gap-1">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Done
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Book Appointment Modal */}
      {isBookModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Book Patient Appointment</h3>
              <button
                onClick={() => setIsBookModalOpen(false)}
                className="rounded-xl p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleBook} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700">Select Patient</label>
                <select
                  value={formData.patientId}
                  onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                  className="input-field mt-1"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.id}) - {p.phone}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700">Select Specialist / Doctor</label>
                <select
                  value={formData.doctorId}
                  onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
                  className="input-field mt-1"
                >
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.specialty}) - Fee: ${d.fee}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700">Date</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="input-field mt-1"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Time Slot</label>
                  <select
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="input-field mt-1"
                  >
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="01:30 PM">01:30 PM</option>
                    <option value="02:30 PM">02:30 PM</option>
                    <option value="03:30 PM">03:30 PM</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700">Appointment Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="input-field mt-1"
                  >
                    <option value="Routine Checkup">Routine Checkup</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Emergency Check">Emergency Check</option>
                    <option value="Specialist Consultation">Specialist Consultation</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="input-field mt-1"
                  >
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700">Reason / Chief Complaint</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Describe symptoms or purpose of consultation..."
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="input-field mt-1 resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setIsBookModalOpen(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {rescheduleAppointmentItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Reschedule Appointment</h3>
              <button
                onClick={() => setRescheduleAppointmentItem(null)}
                className="rounded-xl p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleRescheduleSubmit} className="mt-4 space-y-3 text-xs">
              <p className="text-slate-600">
                Rescheduling appointment for{" "}
                <strong className="text-slate-900">{rescheduleAppointmentItem.patientName}</strong>{" "}
                with <strong className="text-blue-700">{rescheduleAppointmentItem.doctorName}</strong>.
              </p>

              <div>
                <label className="font-semibold text-slate-700">New Date</label>
                <input type="date" required className="input-field mt-1" defaultValue="2026-09-22" />
              </div>

              <div>
                <label className="font-semibold text-slate-700">New Time Slot</label>
                <select className="input-field mt-1" defaultValue="11:30 AM">
                  <option value="09:30 AM">09:30 AM</option>
                  <option value="11:30 AM">11:30 AM</option>
                  <option value="03:00 PM">03:00 PM</option>
                  <option value="04:30 PM">04:30 PM</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setRescheduleAppointmentItem(null)}
                  className="btn-secondary"
                >
                  Keep Existing
                </button>
                <button type="submit" className="btn-primary">
                  Save New Time
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {cancelModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-rose-600">Cancel Appointment</h3>
              <button
                onClick={() => setCancelModalItem(null)}
                className="rounded-xl p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCancelSubmit} className="mt-4 space-y-3 text-xs">
              <p className="text-slate-600">
                Are you sure you want to cancel the appointment for{" "}
                <strong className="text-slate-900">{cancelModalItem.patientName}</strong> on{" "}
                {cancelModalItem.date}?
              </p>

              <div>
                <label className="font-semibold text-slate-700">Cancellation Reason</label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g., Patient unable to attend / Doctor emergency"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="input-field mt-1 resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setCancelModalItem(null)}
                  className="btn-secondary"
                >
                  Go Back
                </button>
                <button type="submit" className="btn-danger">
                  Confirm Cancellation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
