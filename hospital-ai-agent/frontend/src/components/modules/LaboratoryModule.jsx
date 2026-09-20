import React, { useState } from "react";
import {
  FlaskConical,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  Printer,
  X,
  User,
  Stethoscope,
  Filter,
  Check,
} from "lucide-react";
import { useHospital } from "../../context/HospitalContext";

export default function LaboratoryModule() {
  const {
    labTests,
    orderLabTest,
    updateLabResults,
    approveLabTest,
    patients,
    doctors,
  } = useHospital();

  const [statusFilter, setStatusFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  // Modals
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [resultsModalTest, setResultsModalTest] = useState(null);
  const [printModalTest, setPrintModalTest] = useState(null);

  // New order form state
  const [orderFormData, setOrderFormData] = useState({
    patientId: patients[0]?.id || "",
    doctorId: doctors[0]?.id || "",
    testName: "Complete Blood Count (CBC) with Diff",
    category: "Hematology",
    priority: "Normal",
    notes: "Routine diagnostic workup",
  });

  // Results entry state
  const [testResultsParams, setTestResultsParams] = useState([]);
  const [testNotes, setTestNotes] = useState("");

  const statuses = ["All", "Requested", "In-Progress", "Completed"];

  const filteredTests = labTests.filter((t) => {
    const matchesStatus = statusFilter === "All" || t.status === statusFilter;
    const matchesSearch =
      t.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleOrderSubmit = (e) => {
    e.preventDefault();
    const selPatient = patients.find((p) => p.id === orderFormData.patientId);
    const selDoctor = doctors.find((d) => d.id === orderFormData.doctorId);

    orderLabTest({
      ...orderFormData,
      patientName: selPatient ? selPatient.name : "Patient",
      doctorName: selDoctor ? selDoctor.name : "Doctor",
    });

    setIsOrderModalOpen(false);
  };

  const openResultsModal = (test) => {
    setResultsModalTest(test);
    setTestNotes(test.notes || "");
    if (test.results && test.results.length > 0) {
      setTestResultsParams(test.results);
    } else {
      // Default parameters based on test name
      if (test.testName.includes("Blood Count") || test.testName.includes("CBC")) {
        setTestResultsParams([
          { parameter: "WBC Count", value: "7.5", unit: "10^3/uL", normalRange: "4.5 - 11.0", flag: "Normal" },
          { parameter: "Hemoglobin", value: "14.2", unit: "g/dL", normalRange: "13.0 - 17.0", flag: "Normal" },
          { parameter: "Platelets", value: "240", unit: "10^3/uL", normalRange: "150 - 450", flag: "Normal" },
          { parameter: "Neutrophils", value: "58", unit: "%", normalRange: "40 - 70", flag: "Normal" },
        ]);
      } else if (test.testName.includes("Lipid") || test.testName.includes("Metabolic")) {
        setTestResultsParams([
          { parameter: "Total Cholesterol", value: "195", unit: "mg/dL", normalRange: "< 200", flag: "Normal" },
          { parameter: "Triglycerides", value: "145", unit: "mg/dL", normalRange: "< 150", flag: "Normal" },
          { parameter: "HDL Good Cholesterol", value: "52", unit: "mg/dL", normalRange: "> 40", flag: "Normal" },
          { parameter: "Fasting Blood Sugar", value: "92", unit: "mg/dL", normalRange: "70 - 99", flag: "Normal" },
        ]);
      } else {
        setTestResultsParams([
          { parameter: "Primary Biomarker", value: "Normal", unit: "Index", normalRange: "Negative", flag: "Normal" },
          { parameter: "Secondary Indicator", value: "Adequate", unit: "Score", normalRange: "Adequate", flag: "Normal" },
        ]);
      }
    }
  };

  const handleSaveResults = (e) => {
    e.preventDefault();
    if (!resultsModalTest) return;
    updateLabResults(resultsModalTest.id, testResultsParams, testNotes);
    setResultsModalTest(null);
  };

  const handleParamChange = (index, field, val) => {
    setTestResultsParams((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [field]: val } : p))
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Laboratory & Diagnostic Center
          </h1>
          <p className="text-xs text-slate-500 sm:text-sm">
            Process pathology requests, analyze bio-markers, review flags, and approve test reports.
          </p>
        </div>

        <button
          onClick={() => setIsOrderModalOpen(true)}
          className="btn-primary"
        >
          <Plus className="h-4 w-4" /> Order New Diagnostic Test
        </button>
      </div>

      {/* Status Chips and Search Bar */}
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

        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search test, patient, doctor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-9 text-xs"
          />
        </div>
      </div>

      {/* Lab Tests Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold">
              <tr>
                <th className="py-3.5 px-4">Test Request</th>
                <th className="py-3.5 px-4">Patient</th>
                <th className="py-3.5 px-4">Requested By</th>
                <th className="py-3.5 px-4">Date & Priority</th>
                <th className="py-3.5 px-4">Status & Approval</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredTests.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-400">
                    No diagnostic tests found matching current criteria.
                  </td>
                </tr>
              ) : (
                filteredTests.map((t) => {
                  const isCritical = t.results?.some((r) => r.flag === "High" || r.flag === "Critical");
                  return (
                    <tr key={t.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-slate-900 text-sm">{t.testName}</p>
                          {isCritical && (
                            <span className="badge-rose text-[10px] font-bold">Abnormal Values</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                          <span className="font-mono text-purple-700 font-semibold">{t.id}</span>
                          <span>•</span>
                          <span>{t.category}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-slate-900">{t.patientName}</p>
                        <p className="text-[10px] text-slate-400">ID: {t.patientId}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-medium text-slate-800">{t.doctorName}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-medium text-slate-700">{t.dateRequested}</p>
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold border mt-0.5 ${
                            t.priority === "Urgent"
                              ? "bg-rose-50 text-rose-700 border-rose-200"
                              : "bg-slate-100 text-slate-600 border-slate-200"
                          }`}
                        >
                          {t.priority}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                            t.status === "Completed"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : t.status === "In-Progress"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}
                        >
                          {t.status}
                        </span>
                        {t.approvalStatus === "Approved" ? (
                          <span className="block mt-0.5 text-[10px] font-semibold text-emerald-600">
                            ✓ Verified & Signed
                          </span>
                        ) : (
                          <span className="block mt-0.5 text-[10px] text-slate-400">
                            Approval Pending
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {t.status !== "Completed" && (
                            <button
                              onClick={() => openResultsModal(t)}
                              className="rounded-lg bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700 hover:bg-blue-100 transition"
                            >
                              Enter Results
                            </button>
                          )}

                          {t.status === "Completed" && t.approvalStatus !== "Approved" && (
                            <button
                              onClick={() => approveLabTest(t.id)}
                              className="rounded-lg bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 hover:bg-emerald-100 transition"
                            >
                              Approve
                            </button>
                          )}

                          {t.status === "Completed" && (
                            <button
                              onClick={() => setPrintModalTest(t)}
                              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 transition"
                            >
                              View Slip
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Diagnostic Test Modal */}
      {isOrderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Order Diagnostic Test</h3>
              <button
                onClick={() => setIsOrderModalOpen(false)}
                className="rounded-xl p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleOrderSubmit} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700">Patient</label>
                <select
                  value={orderFormData.patientId}
                  onChange={(e) => setOrderFormData({ ...orderFormData, patientId: e.target.value })}
                  className="input-field mt-1"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.id})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700">Ordering Doctor</label>
                <select
                  value={orderFormData.doctorId}
                  onChange={(e) => setOrderFormData({ ...orderFormData, doctorId: e.target.value })}
                  className="input-field mt-1"
                >
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.specialty})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700">Test Name</label>
                  <select
                    value={orderFormData.testName}
                    onChange={(e) => setOrderFormData({ ...orderFormData, testName: e.target.value })}
                    className="input-field mt-1"
                  >
                    <option value="Complete Blood Count (CBC) with Diff">Complete Blood Count (CBC)</option>
                    <option value="Comprehensive Metabolic & Lipid Panel">Metabolic & Lipid Panel</option>
                    <option value="Cardiac Troponin I & CK-MB">Cardiac Troponin I & CK-MB</option>
                    <option value="Brain MRI with Contrast">Brain MRI with Contrast</option>
                    <option value="Chest X-Ray (PA View)">Chest X-Ray (PA View)</option>
                    <option value="Urinalysis Routine">Urinalysis Routine</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Priority Level</label>
                  <select
                    value={orderFormData.priority}
                    onChange={(e) => setOrderFormData({ ...orderFormData, priority: e.target.value })}
                    className="input-field mt-1"
                  >
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent / STAT</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700">Clinical Indication / Notes</label>
                <textarea
                  rows={2}
                  value={orderFormData.notes}
                  onChange={(e) => setOrderFormData({ ...orderFormData, notes: e.target.value })}
                  className="input-field mt-1 resize-none"
                  placeholder="Reason for test requisition..."
                />
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setIsOrderModalOpen(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Submit Lab Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Enter Test Results Modal */}
      {resultsModalTest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Record Laboratory Results</h3>
                <p className="text-xs text-blue-600">
                  {resultsModalTest.testName} • Patient: {resultsModalTest.patientName}
                </p>
              </div>
              <button
                onClick={() => setResultsModalTest(null)}
                className="rounded-xl p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveResults} className="mt-4 space-y-3 text-xs">
              <div className="space-y-2">
                <p className="font-semibold text-slate-700">Biomarker Parameters & Values</p>
                {testResultsParams.map((p, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-12 gap-2 rounded-xl bg-slate-50 p-2.5 border border-slate-100 items-center"
                  >
                    <div className="col-span-4">
                      <span className="font-bold text-slate-800 block truncate">{p.parameter}</span>
                      <span className="text-[10px] text-slate-400">{p.normalRange}</span>
                    </div>
                    <div className="col-span-3">
                      <input
                        type="text"
                        value={p.value}
                        onChange={(e) => handleParamChange(i, "value", e.target.value)}
                        className="input-field py-1"
                        placeholder="Value"
                      />
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-500 font-mono text-[11px]">{p.unit}</span>
                    </div>
                    <div className="col-span-3">
                      <select
                        value={p.flag}
                        onChange={(e) => handleParamChange(i, "flag", e.target.value)}
                        className={`input-field py-1 font-semibold ${
                          p.flag === "High" || p.flag === "Critical" ? "text-rose-600" : "text-emerald-600"
                        }`}
                      >
                        <option value="Normal">Normal</option>
                        <option value="High">High</option>
                        <option value="Low">Low</option>
                        <option value="Critical">Critical</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <label className="font-semibold text-slate-700">Pathologist / Tech Remarks</label>
                <textarea
                  rows={2}
                  value={testNotes}
                  onChange={(e) => setTestNotes(e.target.value)}
                  className="input-field mt-1 resize-none"
                  placeholder="Clinical interpretations or specimen observations..."
                />
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setResultsModalTest(null)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Results & Mark Completed
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Lab Slip View Modal */}
      {printModalTest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900">Official Diagnostic Report</h3>
              <button
                onClick={() => setPrintModalTest(null)}
                className="rounded-xl p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/50 p-5 text-xs text-slate-800 space-y-4">
              <div className="flex justify-between border-b border-slate-200 pb-3">
                <div>
                  <h2 className="text-base font-black text-blue-700">AuraCare Diagnostic Labs</h2>
                  <p className="text-[11px] text-slate-500">Accredited Clinical Pathology Department</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900">Report #{printModalTest.id}</p>
                  <p className="text-[11px] text-slate-500">Date: {printModalTest.dateRequested}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 border-b border-slate-200 pb-3">
                <div>
                  <p className="text-slate-400">Patient Name:</p>
                  <p className="font-bold text-slate-900">{printModalTest.patientName}</p>
                  <p className="text-slate-500">ID: {printModalTest.patientId}</p>
                </div>
                <div>
                  <p className="text-slate-400">Ordering Physician:</p>
                  <p className="font-semibold text-slate-900">{printModalTest.doctorName}</p>
                  <p className="text-slate-500">Tech: {printModalTest.technician}</p>
                </div>
              </div>

              <div>
                <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-2">Test Parameter</th>
                      <th className="p-2">Result</th>
                      <th className="p-2">Reference Range</th>
                      <th className="p-2">Flag</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {printModalTest.results?.map((r, idx) => (
                      <tr key={idx} className="bg-white">
                        <td className="p-2 font-medium">{r.parameter}</td>
                        <td className="p-2 font-bold">{r.value} {r.unit}</td>
                        <td className="p-2 text-slate-500">{r.normalRange}</td>
                        <td className="p-2">
                          <span
                            className={`font-bold ${
                              r.flag === "High" || r.flag === "Critical" ? "text-rose-600" : "text-emerald-600"
                            }`}
                          >
                            {r.flag}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {printModalTest.notes && (
                <div className="border-t border-slate-200 pt-2">
                  <p className="font-semibold text-slate-600">Technician Remarks:</p>
                  <p className="text-slate-800">{printModalTest.notes}</p>
                </div>
              )}
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => window.print()}
                className="btn-secondary text-xs"
              >
                <Printer className="h-4 w-4" /> Print Lab Slip
              </button>
              <button
                onClick={() => setPrintModalTest(null)}
                className="btn-primary text-xs"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
