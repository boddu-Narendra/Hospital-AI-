import React, { useState } from "react";
import {
  BedDouble,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  Search,
  UserX,
  X,
  Plus,
  Filter,
  Building,
  Trash2,
  Activity,
  Heart,
  Shield,
  Layers,
} from "lucide-react";
import { useHospital } from "../../context/HospitalContext";

export default function BedManagementModule() {
  const { beds, allocateBed, dischargeBed, setBedStatus, addBed, deleteBed, patients } = useHospital();
  const [selectedWard, setSelectedWard] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  // Allocation Modal State
  const [isAllocateModalOpen, setIsAllocateModalOpen] = useState(false);
  const [targetBed, setTargetBed] = useState(null);
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || "");

  // Add Bed Modal State
  const [isAddBedOpen, setIsAddBedOpen] = useState(false);
  const [isCustomWard, setIsCustomWard] = useState(false);
  const [newBedData, setNewBedData] = useState({
    id: "",
    ward: "Intensive Care Unit (ICU)",
    customWardName: "",
    room: "Room 105",
    type: "ICU Ventilator",
    dailyRate: 750,
    status: "Available",
    occupyingPatientId: "",
    features: ["Oxygen Point", "Cardiac Monitor"],
  });

  const defaultWards = [
    "Intensive Care Unit (ICU)",
    "Emergency Trauma Care",
    "General Ward (Male)",
    "General Ward (Female)",
    "Pediatric Care Unit",
    "Maternity & Neonatal",
    "Post-Operative Recovery",
    "Cardiology Telemetry",
  ];

  // Dynamically compute all wards from existing beds + defaults
  const dynamicWards = Array.from(
    new Set([...defaultWards, ...beds.map((b) => b.ward).filter(Boolean)])
  );

  const wardTabs = ["All", ...dynamicWards];

  const filteredBeds = beds.filter((b) => {
    const matchesWard = selectedWard === "All" || b.ward === selectedWard;
    const matchesStatus = statusFilter === "All" || b.status === statusFilter;
    const matchesSearch =
      b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.room.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.ward.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.patientName && b.patientName.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesWard && matchesStatus && matchesSearch;
  });

  const availableCount = beds.filter((b) => b.status === "Available").length;
  const occupiedCount = beds.filter((b) => b.status === "Occupied").length;
  const cleaningCount = beds.filter((b) => b.status === "Cleaning").length;

  const handleAllocateSubmit = (e) => {
    e.preventDefault();
    if (!targetBed || !selectedPatientId) return;
    allocateBed(targetBed.id, selectedPatientId);
    setIsAllocateModalOpen(false);
    setTargetBed(null);
  };

  const handleAddBedSubmit = (e) => {
    e.preventDefault();
    const finalWard = isCustomWard
      ? newBedData.customWardName.trim()
      : newBedData.ward;

    if (!finalWard || !newBedData.room) return;

    const patientObj = newBedData.status === "Occupied" && newBedData.occupyingPatientId
      ? patients.find((p) => p.id === newBedData.occupyingPatientId)
      : null;

    const createdBed = addBed({
      id: newBedData.id,
      ward: finalWard,
      room: newBedData.room,
      type: newBedData.type,
      dailyRate: Number(newBedData.dailyRate || 250),
      status: newBedData.status,
      patientId: patientObj ? patientObj.id : null,
      patientName: patientObj ? patientObj.name : null,
      features: newBedData.features,
    });

    if (patientObj) {
      allocateBed(createdBed.id, patientObj.id);
    }

    setIsAddBedOpen(false);
    setIsCustomWard(false);
    setSelectedWard(finalWard);
    setNewBedData({
      id: "",
      ward: "Intensive Care Unit (ICU)",
      customWardName: "",
      room: "Room 105",
      type: "ICU Ventilator",
      dailyRate: 750,
      status: "Available",
      occupyingPatientId: "",
      features: ["Oxygen Point", "Cardiac Monitor"],
    });
  };

  const toggleFeature = (featureName) => {
    setNewBedData((prev) => {
      const exists = prev.features.includes(featureName);
      return {
        ...prev,
        features: exists
          ? prev.features.filter((f) => f !== featureName)
          : [...prev.features, featureName],
      };
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Hospital Bed & Ward Management
          </h1>
          <p className="text-xs text-slate-500 sm:text-sm">
            Real-time ward layout, dynamic bed creation, patient allocations, and room sanitization.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddBedOpen(true)}
            className="btn-primary text-xs"
          >
            <Plus className="h-4 w-4" /> Add New Bed / Room
          </button>
        </div>
      </div>

      {/* Status Metrics Bar */}
      <div className="flex flex-wrap gap-2 text-xs font-semibold">
        <span className="badge-emerald px-3 py-1">
          <CheckCircle2 className="h-3.5 w-3.5" /> {availableCount} Available Beds
        </span>
        <span className="badge-rose px-3 py-1">
          <BedDouble className="h-3.5 w-3.5" /> {occupiedCount} Occupied Beds
        </span>
        <span className="badge-amber px-3 py-1">
          <Sparkles className="h-3.5 w-3.5" /> {cleaningCount} Cleaning / Sanitizing
        </span>
        <span className="badge-blue px-3 py-1">
          <Building className="h-3.5 w-3.5" /> {beds.length} Total Capacity
        </span>
      </div>

      {/* Ward Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {wardTabs.map((ward) => (
          <button
            key={ward}
            onClick={() => setSelectedWard(ward)}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition ${
              selectedWard === ward
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {ward === "All" ? "All Wards" : ward.split("(")[0].trim()}
          </button>
        ))}
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Status:</span>
          {["All", "Available", "Occupied", "Cleaning"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                statusFilter === st
                  ? "bg-slate-800 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
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
            placeholder="Search bed, room, ward, patient..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-9 text-xs"
          />
        </div>
      </div>

      {/* Bed Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredBeds.length === 0 ? (
          <div className="col-span-full card p-12 text-center text-slate-400">
            <BedDouble className="h-10 w-10 mx-auto mb-2 opacity-40" />
            <p className="font-semibold text-sm">No beds found</p>
            <p className="text-xs text-slate-400 mt-1">
              Try adjusting your ward/status filter or click "+ Add New Bed / Room" above.
            </p>
          </div>
        ) : (
          filteredBeds.map((bed) => {
            const isOccupied = bed.status === "Occupied";
            const isAvailable = bed.status === "Available";
            const isCleaning = bed.status === "Cleaning";

            return (
              <div
                key={bed.id}
                className={`card card-hover flex flex-col justify-between p-4 border-t-4 transition ${
                  isOccupied
                    ? "border-t-rose-500 bg-rose-50/15"
                    : isAvailable
                    ? "border-t-emerald-500 bg-emerald-50/15"
                    : "border-t-amber-500 bg-amber-50/15"
                }`}
              >
                <div>
                  {/* Bed Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-base font-extrabold text-slate-900">{bed.room}</h3>
                        <span className="font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-bold">
                          {bed.id}
                        </span>
                      </div>
                      <p className="text-[11px] font-semibold text-blue-700 mt-0.5">{bed.ward}</p>
                    </div>

                    <div className="flex items-center gap-1">
                      <span
                        className={`badge ${
                          isOccupied
                            ? "badge-rose"
                            : isAvailable
                            ? "badge-emerald"
                            : "badge-amber"
                        }`}
                      >
                        {bed.status}
                      </span>
                      {deleteBed && !isOccupied && (
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete bed ${bed.id} (${bed.room})?`)) {
                              deleteBed(bed.id);
                            }
                          }}
                          className="rounded-lg p-1 text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition"
                          title="Remove bed from ward"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Bed Specifications */}
                  <div className="mt-3 space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-2.5">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Bed Category:</span>
                      <strong className="text-slate-800">{bed.type}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Daily Room Rate:</span>
                      <strong className="text-slate-900 font-mono">${bed.dailyRate}/day</strong>
                    </div>

                    {/* Features list */}
                    {bed.features && bed.features.length > 0 && (
                      <div className="pt-1 flex flex-wrap gap-1">
                        {bed.features.map((f, i) => (
                          <span
                            key={i}
                            className="inline-block text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium"
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Patient Info if Occupied */}
                  {isOccupied && (
                    <div className="mt-3 rounded-xl bg-rose-50 p-2.5 border border-rose-200 text-xs">
                      <div className="flex items-center gap-1.5 text-rose-800 font-bold">
                        <UserCheck className="h-4 w-4" />
                        <span>Admitted Patient:</span>
                      </div>
                      <p className="mt-1 font-black text-slate-900 text-sm">{bed.patientName || "Admitted Patient"}</p>
                      <div className="mt-1 flex items-center justify-between text-[11px] text-slate-600">
                        <span>ID: <strong className="font-mono text-slate-800">{bed.patientId}</strong></span>
                        <span>Since: {bed.admittedSince || "Today"}</span>
                      </div>
                    </div>
                  )}

                  {/* Cleaning Info */}
                  {isCleaning && (
                    <div className="mt-3 rounded-xl bg-amber-50 p-2.5 border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
                      <Sparkles className="h-4 w-4 flex-shrink-0 animate-pulse text-amber-600" />
                      <div>
                        <p className="font-bold">Sanitization in Progress</p>
                        <p className="text-[11px] text-amber-700">Undergoing infection control sterilization.</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Bed Action Buttons */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col gap-1.5">
                  {isAvailable && (
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => {
                          setTargetBed(bed);
                          setIsAllocateModalOpen(true);
                        }}
                        className="btn-primary w-full text-xs py-1.5"
                      >
                        <UserCheck className="h-3.5 w-3.5" /> Admit Patient
                      </button>
                      <button
                        onClick={() => setBedStatus(bed.id, "Cleaning")}
                        className="btn-secondary text-xs py-1.5 px-2.5"
                        title="Mark for sanitization"
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}

                  {isOccupied && (
                    <button
                      onClick={() => dischargeBed(bed.id)}
                      className="btn-secondary w-full text-xs py-1.5 text-rose-700 border-rose-200 hover:bg-rose-50"
                    >
                      <UserX className="h-3.5 w-3.5" /> Discharge Patient
                    </button>
                  )}

                  {isCleaning && (
                    <button
                      onClick={() => setBedStatus(bed.id, "Available")}
                      className="btn-secondary w-full text-xs py-1.5 text-emerald-700 border-emerald-200 hover:bg-emerald-50"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" /> Mark Sanitized & Available
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Allocate Bed Modal */}
      {isAllocateModalOpen && targetBed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Allocate Patient to Bed</h3>
                <p className="text-xs text-blue-600 font-mono">
                  {targetBed.id} • {targetBed.room} ({targetBed.ward})
                </p>
              </div>
              <button
                onClick={() => setIsAllocateModalOpen(false)}
                className="rounded-xl p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAllocateSubmit} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700">Select Patient to Admit</label>
                <select
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="input-field mt-1"
                >
                  {patients
                    .filter((p) => p.admissionStatus !== "Admitted")
                    .map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.id}) — {p.gender}, {p.age}y
                      </option>
                    ))}
                  {patients.filter((p) => p.admissionStatus !== "Admitted").length === 0 && (
                    <option disabled>No unassigned patients currently waiting</option>
                  )}
                </select>
              </div>

              <div className="rounded-xl bg-slate-50 p-3 border border-slate-100 text-slate-600">
                <p className="font-semibold text-slate-800">Bed Specifications:</p>
                <p>Type: {targetBed.type}</p>
                <p>Daily Rate: ${targetBed.dailyRate}/day (Added to patient billing ledger)</p>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAllocateModalOpen(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Confirm Bed Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Bed / Room Modal */}
      {isAddBedOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Add New Hospital Bed / Room</h3>
                <p className="text-xs text-slate-500">Configure room details, ward location, and equipment.</p>
              </div>
              <button
                onClick={() => setIsAddBedOpen(false)}
                className="rounded-xl p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddBedSubmit} className="mt-4 space-y-3.5 text-xs">
              {/* Ward Selection with Custom Option */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-slate-700">Hospital Ward / Department</label>
                  <button
                    type="button"
                    onClick={() => setIsCustomWard(!isCustomWard)}
                    className="text-[11px] text-blue-600 hover:underline font-medium"
                  >
                    {isCustomWard ? "← Pick from existing wards" : "+ Or create new ward"}
                  </button>
                </div>

                {isCustomWard ? (
                  <input
                    type="text"
                    required
                    placeholder="Enter new ward name (e.g. Oncology Pavilion)"
                    value={newBedData.customWardName}
                    onChange={(e) =>
                      setNewBedData({ ...newBedData, customWardName: e.target.value })
                    }
                    className="input-field mt-1"
                  />
                ) : (
                  <select
                    value={newBedData.ward}
                    onChange={(e) => setNewBedData({ ...newBedData, ward: e.target.value })}
                    className="input-field mt-1"
                  >
                    {dynamicWards.map((w) => (
                      <option key={w} value={w}>
                        {w}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Room Identifier & Custom ID */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700">Room / Bay Identifier</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Room 204, Bay C"
                    value={newBedData.room}
                    onChange={(e) => setNewBedData({ ...newBedData, room: e.target.value })}
                    className="input-field mt-1"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Bed ID (Auto-generated if empty)</label>
                  <input
                    type="text"
                    placeholder="e.g. BED-ICU-105"
                    value={newBedData.id}
                    onChange={(e) => setNewBedData({ ...newBedData, id: e.target.value })}
                    className="input-field mt-1 font-mono"
                  />
                </div>
              </div>

              {/* Bed Type and Daily Rate */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700">Bed Specification Type</label>
                  <select
                    value={newBedData.type}
                    onChange={(e) => setNewBedData({ ...newBedData, type: e.target.value })}
                    className="input-field mt-1"
                  >
                    <option value="ICU Ventilator">ICU Ventilator</option>
                    <option value="ICU Telemetry">ICU Telemetry</option>
                    <option value="Semi-Private">Semi-Private</option>
                    <option value="General Ward Bed">General Ward Bed</option>
                    <option value="Private Deluxe Suite">Private Deluxe Suite</option>
                    <option value="Pediatric Cot">Pediatric Cot</option>
                    <option value="Trauma Emergency Bed">Trauma Emergency Bed</option>
                    <option value="Negative Pressure Isolation">Negative Pressure Isolation</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Daily Room Rate ($)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={newBedData.dailyRate}
                    onChange={(e) => setNewBedData({ ...newBedData, dailyRate: Number(e.target.value) })}
                    className="input-field mt-1"
                  />
                </div>
              </div>

              {/* Initial Status & Direct Patient Assignment */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700">Initial Bed Status</label>
                  <select
                    value={newBedData.status}
                    onChange={(e) => setNewBedData({ ...newBedData, status: e.target.value })}
                    className="input-field mt-1 font-semibold"
                  >
                    <option value="Available">Available for Admission</option>
                    <option value="Cleaning">Cleaning / Sanitizing</option>
                    <option value="Occupied">Occupied (Direct Admission)</option>
                  </select>
                </div>

                {newBedData.status === "Occupied" ? (
                  <div>
                    <label className="font-semibold text-slate-700">Admit Patient</label>
                    <select
                      value={newBedData.occupyingPatientId}
                      onChange={(e) => setNewBedData({ ...newBedData, occupyingPatientId: e.target.value })}
                      className="input-field mt-1"
                    >
                      <option value="">Select waiting patient...</option>
                      {patients
                        .filter((p) => p.admissionStatus !== "Admitted")
                        .map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} ({p.id})
                          </option>
                        ))}
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="font-semibold text-slate-700">Default Department Lead</label>
                    <input
                      type="text"
                      disabled
                      value="Hospital Operations Team"
                      className="input-field mt-1 bg-slate-100 text-slate-500 cursor-not-allowed"
                    />
                  </div>
                )}
              </div>

              {/* Equipment Amenities Checkboxes */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Bed Features & Clinical Amenities
                </label>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {[
                    "Oxygen Point",
                    "Cardiac Monitor",
                    "Mechanical Ventilator",
                    "Infusion Pump",
                    "Electric Elevation",
                    "Nurse Call Button",
                  ].map((feat) => {
                    const active = newBedData.features.includes(feat);
                    return (
                      <button
                        type="button"
                        key={feat}
                        onClick={() => toggleFeature(feat)}
                        className={`flex items-center gap-2 rounded-xl p-2 text-left border transition ${
                          active
                            ? "bg-blue-50 border-blue-300 text-blue-800 font-semibold"
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        <div
                          className={`h-3.5 w-3.5 rounded flex items-center justify-center border ${
                            active
                              ? "bg-blue-600 border-blue-600 text-white"
                              : "border-slate-300 bg-white"
                          }`}
                        >
                          {active && "✓"}
                        </div>
                        <span className="text-[11px]">{feat}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddBedOpen(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Bed to Hospital
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
