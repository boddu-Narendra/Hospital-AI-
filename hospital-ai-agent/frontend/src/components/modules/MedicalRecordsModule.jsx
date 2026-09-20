import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  FileText,
  Calendar,
  User,
  Stethoscope,
  Printer,
  Search,
  Paperclip,
  CheckCircle,
  FileCheck,
  ChevronRight,
  X,
  Plus,
  Trash2,
  Building2,
  ShieldCheck,
  Activity,
} from "lucide-react";
import { useHospital } from "../../context/HospitalContext";

export default function MedicalRecordsModule() {
  const location = useLocation();
  const { medicalRecords, addMedicalRecord, deleteMedicalRecord, patients, doctors } = useHospital();

  const [selectedPatientId, setSelectedPatientId] = useState(
    location.state?.patientId || "all"
  );
  const [recordTypeFilter, setRecordTypeFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRecord, setSelectedRecord] = useState(null);

  // New Medical Record Modal
  const [isAddRecordOpen, setIsAddRecordOpen] = useState(false);
  const [useCustomPatient, setUseCustomPatient] = useState(false);
  const [newRecordData, setNewRecordData] = useState({
    patientId: patients[0]?.id || "PAT-1001",
    customPatientName: "",
    recordType: "Consultation Note",
    title: "",
    doctor: doctors[0]?.name || "Dr. Sarah Jenkins",
    department: "Cardiovascular Sciences",
    summary: "",
    attachments: "Clinical_Summary.pdf",
  });

  const recordTypes = [
    "all",
    "Consultation Note",
    "Diagnostic Report",
    "Lab Report",
    "Discharge Summary",
    "Surgical Procedure",
  ];

  const filteredRecords = medicalRecords.filter((rec) => {
    const matchesPatient = selectedPatientId === "all" || rec.patientId === selectedPatientId;
    const matchesType = recordTypeFilter === "all" || rec.recordType === recordTypeFilter;
    const patName = rec.patientName || patients.find((p) => p.id === rec.patientId)?.name || "";
    const matchesSearch =
      rec.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.summary.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesPatient && matchesType && matchesSearch;
  });

  const handleCreateRecord = (e) => {
    e.preventDefault();
    if (!newRecordData.title || !newRecordData.summary) return;

    let targetPatientName = "";
    let targetPatientId = newRecordData.patientId;

    if (useCustomPatient && newRecordData.customPatientName.trim()) {
      targetPatientName = newRecordData.customPatientName.trim();
      targetPatientId = `PAT-${Math.floor(1000 + Math.random() * 9000)}`;
    } else {
      const p = patients.find((pat) => pat.id === newRecordData.patientId);
      targetPatientName = p?.name || "Patient";
    }

    addMedicalRecord({
      patientId: targetPatientId,
      patientName: targetPatientName,
      recordType: newRecordData.recordType,
      title: newRecordData.title,
      doctor: newRecordData.doctor,
      department: newRecordData.department,
      summary: newRecordData.summary,
      attachments: newRecordData.attachments ? [newRecordData.attachments] : ["Clinical_Summary.pdf"],
    });

    setIsAddRecordOpen(false);
    setUseCustomPatient(false);
    setNewRecordData({
      patientId: patients[0]?.id || "PAT-1001",
      customPatientName: "",
      recordType: "Consultation Note",
      title: "",
      doctor: doctors[0]?.name || "Dr. Sarah Jenkins",
      department: "Cardiovascular Sciences",
      summary: "",
      attachments: "Clinical_Summary.pdf",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Electronic Medical Records (EMR)
          </h1>
          <p className="text-xs text-slate-500 sm:text-sm">
            Official patient records, clinical documentation, verified lab findings, and discharge summaries.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddRecordOpen(true)}
            className="btn-primary text-xs"
          >
            <Plus className="h-4 w-4" /> Add Medical Report
          </button>
          <button
            onClick={() => window.print()}
            className="btn-secondary text-xs"
          >
            <Printer className="h-4 w-4" /> Print Records
          </button>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {/* Patient dropdown filter */}
          <select
            value={selectedPatientId}
            onChange={(e) => setSelectedPatientId(e.target.value)}
            className="input-field text-xs max-w-xs"
          >
            <option value="all">All Patients ({patients.length})</option>
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.id})
              </option>
            ))}
          </select>

          {/* Record type chips */}
          {recordTypes.map((type) => (
            <button
              key={type}
              onClick={() => setRecordTypeFilter(type)}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                recordTypeFilter === type
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {type === "all" ? "All Record Types" : type}
            </button>
          ))}
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search patient, doctor, diagnosis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-9 text-xs"
          />
        </div>
      </div>

      {/* Medical Records Timeline & List */}
      <div className="space-y-4">
        {filteredRecords.length === 0 ? (
          <div className="card p-12 text-center text-slate-400">
            <FileText className="h-10 w-10 mx-auto mb-2 opacity-40" />
            <p className="font-semibold text-sm">No medical records found</p>
            <p className="text-xs text-slate-400 mt-1">
              Try adjusting the patient filter or create a new medical report above.
            </p>
          </div>
        ) : (
          filteredRecords.map((rec) => {
            const patientObj = patients.find((p) => p.id === rec.patientId);
            const patName = rec.patientName || patientObj?.name || "Patient";

            return (
              <div
                key={rec.id}
                className="card card-hover p-5 border-l-4 border-l-blue-600"
              >
                {/* Prominent Patient Name Header Banner */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2.5 border-b border-slate-100">
                  <div className="inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50/50 border border-blue-200/80 px-3.5 py-1.5 shadow-xs">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white font-black text-xs">
                      {patName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block leading-none">
                        Patient Name
                      </span>
                      <span className="text-sm font-extrabold text-slate-900 leading-tight">
                        {patName}
                      </span>
                    </div>
                    <span className="ml-1 text-[11px] font-mono font-bold bg-white text-blue-800 px-2 py-0.5 rounded-md border border-blue-200">
                      ID: {rec.patientId}
                    </span>
                    {patientObj && (
                      <span className="hidden sm:inline text-xs text-slate-600 font-medium">
                        • {patientObj.gender}, {patientObj.age} yrs • Blood: <strong className="text-rose-600">{patientObj.bloodGroup}</strong>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                    <Calendar className="h-3.5 w-3.5 text-blue-600" />
                    <span>{rec.date}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 flex-shrink-0 mt-0.5">
                      <FileCheck className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-bold text-slate-900">{rec.title}</h3>
                        <span className="badge-purple">{rec.recordType}</span>
                      </div>

                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600">
                        <span className="flex items-center gap-1">
                          <Stethoscope className="h-3.5 w-3.5 text-blue-600" />
                          Attending: <strong className="text-slate-800">{rec.doctor}</strong>
                        </span>
                        <span>•</span>
                        <span className="text-slate-500">{rec.department}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-3.5 rounded-xl bg-slate-50/80 p-3.5 text-xs text-slate-700 border border-slate-100 leading-relaxed">
                  <p>{rec.summary}</p>
                </div>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    {rec.attachments?.map((file, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600"
                      >
                        <Paperclip className="h-3 w-3" /> {file}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    {deleteMedicalRecord && (
                      <button
                        onClick={() => {
                          if (window.confirm(`Archive medical record "${rec.title}"?`)) {
                            deleteMedicalRecord(rec.id);
                          }
                        }}
                        className="rounded-xl p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                        title="Archive record"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedRecord(rec)}
                      className="inline-flex items-center gap-1 rounded-xl bg-blue-50 px-3.5 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-100 transition"
                    >
                      View Official Report <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Record Full View & Print Modal with Prominent Patient Name */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl border border-slate-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="badge-blue mb-1">{selectedRecord.recordType}</span>
                <h3 className="text-xl font-extrabold text-slate-900">{selectedRecord.title}</h3>
                <p className="text-xs text-slate-500">Official Clinical Healthcare Report</p>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="rounded-xl p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Official Printable Report Document Content */}
            <div className="mt-4 space-y-4 text-xs">
              {/* Official Hospital Header */}
              <div className="flex items-center justify-between rounded-xl bg-slate-900 text-white p-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 font-black text-sm">
                    AC
                  </div>
                  <div>
                    <h4 className="text-sm font-black tracking-tight">AURACARE MEDICAL SYSTEM</h4>
                    <p className="text-[10px] text-slate-300">Department of Electronic Medical Records & Diagnostics</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-emerald-400 flex items-center gap-1 justify-end">
                    <ShieldCheck className="h-3.5 w-3.5" /> Verified EMR Record
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">Doc Ref: {selectedRecord.id}</span>
                </div>
              </div>

              {/* Prominent Patient Demographics Header */}
              <div className="rounded-2xl border-2 border-blue-300 bg-gradient-to-r from-blue-50/90 to-indigo-50/70 p-4 shadow-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700 block">
                      Patient Full Legal Name:
                    </span>
                    <p className="text-lg font-black text-slate-950 flex items-center gap-1.5">
                      <User className="h-4 w-4 text-blue-600 flex-shrink-0" />
                      {selectedRecord.patientName}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-700">
                      <span className="font-mono font-bold bg-blue-100/70 text-blue-800 px-2 py-0.5 rounded">
                        MRN: {selectedRecord.patientId}
                      </span>
                      {(() => {
                        const pat = patients.find((p) => p.id === selectedRecord.patientId);
                        if (!pat) return null;
                        return (
                          <span>
                            • {pat.gender}, {pat.age} yrs • Blood: <strong className="text-rose-700">{pat.bloodGroup}</strong>
                          </span>
                        );
                      })()}
                    </div>
                  </div>

                  <div className="space-y-1 sm:border-l sm:border-blue-200/80 sm:pl-4">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
                      Attending Physician & Specialty:
                    </span>
                    <p className="text-sm font-extrabold text-slate-900 flex items-center gap-1">
                      <Stethoscope className="h-3.5 w-3.5 text-blue-600 flex-shrink-0" />
                      {selectedRecord.doctor}
                    </p>
                    <p className="text-[11px] text-slate-600">{selectedRecord.department}</p>
                    <p className="text-[10px] text-slate-400">Date of Record: <strong>{selectedRecord.date}</strong></p>
                  </div>
                </div>
              </div>

              {/* Clinical Narrative and Findings */}
              <div>
                <h4 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Activity className="h-3.5 w-3.5 text-blue-600" />
                  Clinical Narrative & Diagnostic Findings
                </h4>
                <div className="rounded-2xl border border-slate-200 p-4 leading-relaxed bg-white text-slate-800 text-xs shadow-xs font-normal">
                  {selectedRecord.summary}
                </div>
              </div>

              {/* Attachments */}
              {selectedRecord.attachments?.length > 0 && (
                <div>
                  <h4 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider mb-2">
                    Verified Digital Attachments
                  </h4>
                  <div className="space-y-1.5">
                    {selectedRecord.attachments.map((file, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between rounded-xl bg-slate-50 p-2.5 border border-slate-200"
                      >
                        <span className="flex items-center gap-2 font-semibold text-slate-700">
                          <Paperclip className="h-4 w-4 text-slate-400" />
                          {file}
                        </span>
                        <span className="badge-emerald font-semibold">
                          <CheckCircle className="h-3 w-3 text-emerald-600" /> Verified Digital Hash
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Doctor Sign-off & Stamp */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Physician Attestation</p>
                  <p className="text-xs font-bold text-slate-800">
                    Certified and entered into hospital EMR by {selectedRecord.doctor}
                  </p>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                    Timestamp: {selectedRecord.date} • Encrypted EHR SHA-256
                  </p>
                </div>
                <div className="text-center sm:text-right border-t sm:border-t-0 sm:border-l border-slate-200 pt-2 sm:pt-0 sm:pl-4">
                  <div className="font-serif italic font-bold text-blue-900 text-base">
                    {selectedRecord.doctor}
                  </div>
                  <span className="text-[9px] uppercase tracking-wider text-slate-400">Attending Physician MD</span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 flex justify-end gap-2 border-t border-slate-100 pt-4">
              <button
                onClick={() => window.print()}
                className="btn-secondary text-xs"
              >
                <Printer className="h-4 w-4" /> Print Full Report
              </button>
              <button
                onClick={() => setSelectedRecord(null)}
                className="btn-primary text-xs"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Medical Record Modal */}
      {isAddRecordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Add New Medical Report</h3>
                <p className="text-xs text-slate-500">Record an official clinical report for a patient.</p>
              </div>
              <button
                onClick={() => setIsAddRecordOpen(false)}
                className="rounded-xl p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRecord} className="mt-4 space-y-3 text-xs">
              {/* Patient Selection & Toggle */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-slate-700">Patient Identification</label>
                  <button
                    type="button"
                    onClick={() => setUseCustomPatient(!useCustomPatient)}
                    className="text-[11px] text-blue-600 hover:underline font-medium"
                  >
                    {useCustomPatient ? "← Select from registered patients" : "+ Or enter custom patient"}
                  </button>
                </div>

                {useCustomPatient ? (
                  <input
                    type="text"
                    required
                    placeholder="Enter patient full legal name (e.g. Robert Brown)"
                    value={newRecordData.customPatientName}
                    onChange={(e) =>
                      setNewRecordData({ ...newRecordData, customPatientName: e.target.value })
                    }
                    className="input-field mt-1"
                  />
                ) : (
                  <select
                    value={newRecordData.patientId}
                    onChange={(e) => setNewRecordData({ ...newRecordData, patientId: e.target.value })}
                    className="input-field mt-1"
                  >
                    {patients.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} (ID: {p.id}) — {p.gender}, {p.age}y
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700">Record Type</label>
                  <select
                    value={newRecordData.recordType}
                    onChange={(e) => setNewRecordData({ ...newRecordData, recordType: e.target.value })}
                    className="input-field mt-1"
                  >
                    <option value="Consultation Note">Consultation Note</option>
                    <option value="Diagnostic Report">Diagnostic Report</option>
                    <option value="Lab Report">Lab Report</option>
                    <option value="Discharge Summary">Discharge Summary</option>
                    <option value="Surgical Procedure">Surgical Procedure</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Attending Doctor</label>
                  <select
                    value={newRecordData.doctor}
                    onChange={(e) => {
                      const doc = doctors.find((d) => d.name === e.target.value);
                      setNewRecordData({
                        ...newRecordData,
                        doctor: e.target.value,
                        department: doc?.department || newRecordData.department,
                      });
                    }}
                    className="input-field mt-1"
                  >
                    {doctors.map((d) => (
                      <option key={d.id} value={d.name}>
                        {d.name} ({d.specialty})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700">Report Title / Diagnosis Headline</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Post-Operative Cardiac Telemetry Assessment"
                  value={newRecordData.title}
                  onChange={(e) => setNewRecordData({ ...newRecordData, title: e.target.value })}
                  className="input-field mt-1"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700">Clinical Findings & Summary</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Detailed clinical narrative, observations, vital trends, laboratory readings, or treatment orders..."
                  value={newRecordData.summary}
                  onChange={(e) => setNewRecordData({ ...newRecordData, summary: e.target.value })}
                  className="input-field mt-1 resize-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700">Attachment File Name</label>
                <input
                  type="text"
                  placeholder="e.g. ECG_Full_Tracing_Report.pdf"
                  value={newRecordData.attachments}
                  onChange={(e) => setNewRecordData({ ...newRecordData, attachments: e.target.value })}
                  className="input-field mt-1"
                />
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddRecordOpen(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Medical Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
