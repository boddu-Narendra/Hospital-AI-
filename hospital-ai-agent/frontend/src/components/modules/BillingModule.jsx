import React, { useState } from "react";
import {
  CreditCard,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Printer,
  DollarSign,
  Receipt,
  Trash2,
  X,
  Filter,
} from "lucide-react";
import { useHospital } from "../../context/HospitalContext";

export default function BillingModule() {
  const { invoices, createInvoice, recordPayment, patients } = useHospital();
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [paymentModalInvoice, setPaymentModalInvoice] = useState(null);
  const [printModalInvoice, setPrintModalInvoice] = useState(null);

  // Payment form state
  const [paymentMethod, setPaymentMethod] = useState("Credit Card (Visa ending in 4242)");
  const [paymentAmount, setPaymentAmount] = useState(0);

  // New Invoice Form
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || "");
  const [invoiceItems, setInvoiceItems] = useState([
    { description: "Specialist Outpatient Consultation", category: "Consultation", amount: 150.0 },
    { description: "Standard Biochemistry Panel", category: "Laboratory", amount: 85.0 },
  ]);
  const [insuranceCoverPercent, setInsuranceCoverPercent] = useState(70);

  const statuses = ["All", "Paid", "Pending", "Partial"];

  const filteredInvoices = invoices.filter((inv) => {
    const matchesStatus = statusFilter === "All" || inv.status === statusFilter;
    const matchesSearch =
      inv.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.patientName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalCollected = invoices.reduce((sum, inv) => sum + (inv.paidAmount || 0), 0);
  const totalPending = invoices.reduce(
    (sum, inv) => sum + (inv.status === "Pending" ? inv.totalPayable : 0),
    0
  );

  const handleAddItem = () => {
    setInvoiceItems((prev) => [
      ...prev,
      { description: "Pharmacy Dispensed Medication", category: "Pharmacy", amount: 45.0 },
    ]);
  };

  const handleRemoveItem = (index) => {
    setInvoiceItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleItemChange = (index, field, val) => {
    setInvoiceItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, [field]: field === "amount" ? Number(val) : val } : item
      )
    );
  };

  const subtotal = invoiceItems.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const insuranceDeduction = Math.round((subtotal * insuranceCoverPercent) / 100);
  const netPayable = Math.max(0, subtotal - insuranceDeduction);

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    const selPatient = patients.find((p) => p.id === selectedPatientId);
    createInvoice({
      patientId: selectedPatientId,
      patientName: selPatient ? selPatient.name : "Patient",
      items: invoiceItems,
      subtotal,
      insuranceCover: insuranceDeduction,
      tax: 0,
      totalPayable: netPayable,
    });
    setIsCreateModalOpen(false);
  };

  const handleRecordPaymentSubmit = (e) => {
    e.preventDefault();
    if (!paymentModalInvoice || paymentAmount <= 0) return;
    recordPayment(paymentModalInvoice.id, paymentAmount, paymentMethod);
    setPaymentModalInvoice(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Billing & Invoicing Services
          </h1>
          <p className="text-xs text-slate-500 sm:text-sm">
            Generate itemized patient statements, manage insurance deductions, and collect payments.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="btn-primary"
        >
          <Plus className="h-4 w-4" /> Create New Invoice
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="card p-4 flex items-center justify-between border-l-4 border-l-emerald-500">
          <div>
            <span className="text-xs font-semibold text-slate-500">Total Collected</span>
            <p className="text-xl font-extrabold text-slate-900 mt-1">
              ${totalCollected.toLocaleString()}
            </p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>

        <div className="card p-4 flex items-center justify-between border-l-4 border-l-amber-500">
          <div>
            <span className="text-xs font-semibold text-slate-500">Outstanding Balance</span>
            <p className="text-xl font-extrabold text-slate-900 mt-1">
              ${totalPending.toLocaleString()}
            </p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <Clock className="h-5 w-5" />
          </div>
        </div>

        <div className="card p-4 flex items-center justify-between border-l-4 border-l-purple-500">
          <div>
            <span className="text-xs font-semibold text-slate-500">Total Invoices</span>
            <p className="text-xl font-extrabold text-slate-900 mt-1">{invoices.length}</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
            <Receipt className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Filter Chips and Search Bar */}
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
            placeholder="Search invoice #, patient..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-9 text-xs"
          />
        </div>
      </div>

      {/* Invoices Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold">
              <tr>
                <th className="py-3.5 px-4">Invoice #</th>
                <th className="py-3.5 px-4">Patient</th>
                <th className="py-3.5 px-4">Date Issued / Due</th>
                <th className="py-3.5 px-4">Amount Breakdown</th>
                <th className="py-3.5 px-4">Total Payable</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-400">
                    No invoices found.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-blue-700">{inv.id}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900">{inv.patientName}</p>
                      <p className="text-[10px] text-slate-400">ID: {inv.patientId}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-medium text-slate-800">{inv.date}</p>
                      <p className="text-[10px] text-slate-400">Due: {inv.dueDate}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="text-slate-600">Subtotal: ${inv.subtotal.toFixed(2)}</p>
                      <p className="text-[10px] text-emerald-600">Ins: -${inv.insuranceCover.toFixed(2)}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-sm font-extrabold text-slate-900">
                        ${inv.totalPayable.toFixed(2)}
                      </span>
                      {inv.paidAmount > 0 && (
                        <p className="text-[10px] text-emerald-600">
                          Paid: ${inv.paidAmount.toFixed(2)}
                        </p>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                          inv.status === "Paid"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : inv.status === "Partial"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-rose-50 text-rose-700 border-rose-200"
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {inv.status !== "Paid" && (
                          <button
                            onClick={() => {
                              setPaymentModalInvoice(inv);
                              setPaymentAmount(inv.totalPayable - (inv.paidAmount || 0));
                            }}
                            className="rounded-lg bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 hover:bg-emerald-100 transition"
                          >
                            Pay
                          </button>
                        )}

                        <button
                          onClick={() => setPrintModalInvoice(inv)}
                          className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 transition"
                        >
                          Receipt
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

      {/* Create New Invoice Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Generate Patient Statement</h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="rounded-xl p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700">Patient</label>
                <select
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
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
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-slate-700">Itemized Charges</label>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="text-blue-600 font-bold hover:underline"
                  >
                    + Add Charge Item
                  </button>
                </div>

                <div className="mt-2 space-y-2">
                  {invoiceItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-12 gap-2 rounded-xl bg-slate-50 p-2.5 border border-slate-100 items-center"
                    >
                      <div className="col-span-6">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => handleItemChange(idx, "description", e.target.value)}
                          className="input-field py-1"
                          placeholder="Description"
                        />
                      </div>
                      <div className="col-span-3">
                        <select
                          value={item.category}
                          onChange={(e) => handleItemChange(idx, "category", e.target.value)}
                          className="input-field py-1"
                        >
                          <option value="Consultation">Consultation</option>
                          <option value="Laboratory">Laboratory</option>
                          <option value="Pharmacy">Pharmacy</option>
                          <option value="Bed/Room">Bed/Room</option>
                          <option value="Procedure">Procedure</option>
                        </select>
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          step="0.01"
                          value={item.amount}
                          onChange={(e) => handleItemChange(idx, "amount", e.target.value)}
                          className="input-field py-1 font-bold"
                          placeholder="Amount"
                        />
                      </div>
                      <div className="col-span-1 flex justify-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          className="text-rose-500 hover:text-rose-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 p-3 border border-slate-100 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Gross Subtotal:</span>
                  <span className="font-bold text-slate-800">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Insurance Coverage (%):</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={insuranceCoverPercent}
                    onChange={(e) => setInsuranceCoverPercent(Number(e.target.value))}
                    className="w-16 input-field py-0.5 text-right font-bold"
                  />
                </div>
                <div className="flex justify-between text-emerald-700">
                  <span>Insurance Subsidy:</span>
                  <span>-${insuranceDeduction.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-1.5 text-sm font-extrabold text-slate-900">
                  <span>Net Patient Payable:</span>
                  <span className="text-blue-700">${netPayable.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Generate Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Process Payment Modal */}
      {paymentModalInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Record Patient Payment</h3>
                <p className="text-xs text-blue-600 font-mono">Invoice #{paymentModalInvoice.id}</p>
              </div>
              <button
                onClick={() => setPaymentModalInvoice(null)}
                className="rounded-xl p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleRecordPaymentSubmit} className="mt-4 space-y-3 text-xs">
              <div className="rounded-xl bg-slate-50 p-3 border border-slate-100 text-slate-600">
                <p>Patient: <strong className="text-slate-900">{paymentModalInvoice.patientName}</strong></p>
                <p>Total Due: <strong className="text-blue-700">${paymentModalInvoice.totalPayable}</strong></p>
              </div>

              <div>
                <label className="font-semibold text-slate-700">Payment Amount ($)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="input-field mt-1 text-sm font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700">Payment Mode</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="input-field mt-1"
                >
                  <option value="Credit Card (Visa ending in 4242)">Credit Card (Visa)</option>
                  <option value="Debit Card (Mastercard)">Debit Card</option>
                  <option value="Cash at Reception">Cash</option>
                  <option value="Direct Insurance Claim Settlement">Insurance Claim</option>
                  <option value="UPI / Online Transfer">UPI / Online Transfer</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setPaymentModalInvoice(null)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Process Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Receipt Modal */}
      {printModalInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-bold text-slate-900">Hospital Billing Statement</h3>
              <button
                onClick={() => setPrintModalInvoice(null)}
                className="rounded-xl p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/50 p-6 text-xs text-slate-800 space-y-4">
              <div className="flex justify-between border-b border-slate-200 pb-3">
                <div>
                  <h2 className="text-lg font-black text-blue-700">AuraCare Hospital</h2>
                  <p className="text-[11px] text-slate-500">Official Patient Billing Receipt</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900">Invoice #{printModalInvoice.id}</p>
                  <p className="text-[11px] text-slate-500">Date: {printModalInvoice.date}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 border-b border-slate-200 pb-3">
                <div>
                  <p className="text-slate-400">Billed To:</p>
                  <p className="font-bold text-slate-900">{printModalInvoice.patientName}</p>
                  <p className="text-slate-500">Patient ID: {printModalInvoice.patientId}</p>
                </div>
                <div>
                  <p className="text-slate-400">Payment Status:</p>
                  <p className="font-bold text-emerald-600">{printModalInvoice.status}</p>
                  <p className="text-slate-500">Method: {printModalInvoice.paymentMethod || "Pending"}</p>
                </div>
              </div>

              <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-2">Item Description</th>
                    <th className="p-2">Category</th>
                    <th className="p-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {printModalInvoice.items?.map((item, idx) => (
                    <tr key={idx} className="bg-white">
                      <td className="p-2 font-medium">{item.description}</td>
                      <td className="p-2 text-slate-500">{item.category}</td>
                      <td className="p-2 text-right font-mono">${item.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="border-t border-slate-200 pt-2 text-right space-y-1">
                <p className="text-slate-500">Subtotal: ${printModalInvoice.subtotal.toFixed(2)}</p>
                <p className="text-emerald-700">Insurance Deduction: -${printModalInvoice.insuranceCover.toFixed(2)}</p>
                <p className="text-base font-extrabold text-slate-900">
                  Total Payable: ${printModalInvoice.totalPayable.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => window.print()}
                className="btn-secondary text-xs"
              >
                <Printer className="h-4 w-4" /> Print Invoice
              </button>
              <button
                onClick={() => setPrintModalInvoice(null)}
                className="btn-primary text-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
