import React, { useState } from "react";
import {
  Pill,
  Plus,
  Search,
  AlertTriangle,
  ArrowDownCircle,
  ArrowUpCircle,
  Package,
  Calendar,
  CheckCircle2,
  DollarSign,
  X,
  Filter,
  Trash2,
  Building2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useHospital } from "../../context/HospitalContext";

export default function PharmacyModule() {
  const {
    pharmacy,
    restockMedicine,
    dispenseMedicine,
    addMedicine,
    deleteMedicine,
    patients,
  } = useHospital();

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Modals
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
  const [selectedMedForRestock, setSelectedMedForRestock] = useState(null);
  const [restockUnits, setRestockUnits] = useState(50);

  const [isDispenseModalOpen, setIsDispenseModalOpen] = useState(false);
  const [selectedMedForDispense, setSelectedMedForDispense] = useState(null);
  const [dispenseUnits, setDispenseUnits] = useState(1);
  const [dispensePatientName, setDispensePatientName] = useState(patients[0]?.name || "Patient");

  // Add Medicine Modal State
  const [isAddMedModalOpen, setIsAddMedModalOpen] = useState(false);
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [newMedData, setNewMedData] = useState({
    name: "",
    brand: "",
    strength: "500mg",
    category: "Antibiotics",
    customCategoryName: "",
    dosageForm: "Tablet",
    stock: 100,
    minThreshold: 30,
    unitPrice: 15.0,
    batchNo: `BATCH-${Date.now().toString().slice(-4)}`,
    expiryDate: "2028-06-30",
    manufacturer: "GSK Pharmaceuticals",
    prescriptionRequired: true,
    storageTemp: "Controlled Room Temp (20-25°C)",
  });

  const defaultCategories = [
    "Antibiotics",
    "Cardiovascular",
    "Antidiabetic",
    "Analgesic & Antipyretic",
    "Respiratory",
    "Anticoagulant",
    "Gastrointestinal",
    "Neurological",
    "Dermatology",
  ];

  // Dynamically compute all categories from existing catalog + defaults
  const dynamicCategories = Array.from(
    new Set([...defaultCategories, ...pharmacy.map((m) => m.category).filter(Boolean)])
  );

  const categoryTabs = ["All", ...dynamicCategories];

  const filteredPharmacy = pharmacy.filter((med) => {
    const matchesCat = categoryFilter === "All" || med.category === categoryFilter;
    const matchesSearch =
      med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.batchNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (med.manufacturer && med.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const handleRestockSubmit = (e) => {
    e.preventDefault();
    if (!selectedMedForRestock || restockUnits <= 0) return;
    restockMedicine(selectedMedForRestock.id, restockUnits);
    setIsRestockModalOpen(false);
    setSelectedMedForRestock(null);
  };

  const handleDispenseSubmit = (e) => {
    e.preventDefault();
    if (!selectedMedForDispense || dispenseUnits <= 0) return;
    dispenseMedicine(selectedMedForDispense.id, dispenseUnits, dispensePatientName);
    setIsDispenseModalOpen(false);
    setSelectedMedForDispense(null);
  };

  const handleAddMedSubmit = (e) => {
    e.preventDefault();
    const finalBrand = newMedData.brand.trim();
    const finalGeneric = newMedData.name.trim();

    if (!finalBrand && !finalGeneric) return;

    const finalCategory = isCustomCategory
      ? newMedData.customCategoryName.trim() || "General Formulary"
      : newMedData.category;

    addMedicine({
      brand: finalBrand || finalGeneric,
      name: finalGeneric || finalBrand,
      strength: newMedData.strength,
      category: finalCategory,
      dosageForm: newMedData.dosageForm,
      stock: Number(newMedData.stock || 0),
      minThreshold: Number(newMedData.minThreshold || 30),
      unitPrice: Number(newMedData.unitPrice || 10),
      batchNo: newMedData.batchNo.trim(),
      expiryDate: newMedData.expiryDate,
      manufacturer: newMedData.manufacturer.trim(),
      prescriptionRequired: newMedData.prescriptionRequired,
      storageTemp: newMedData.storageTemp,
    });

    setIsAddMedModalOpen(false);
    setIsCustomCategory(false);
    setCategoryFilter(finalCategory);
    setNewMedData({
      name: "",
      brand: "",
      strength: "500mg",
      category: "Antibiotics",
      customCategoryName: "",
      dosageForm: "Tablet",
      stock: 100,
      minThreshold: 30,
      unitPrice: 15.0,
      batchNo: `BATCH-${Date.now().toString().slice(-4)}`,
      expiryDate: "2028-06-30",
      manufacturer: "GSK Pharmaceuticals",
      prescriptionRequired: true,
      storageTemp: "Controlled Room Temp (20-25°C)",
    });
  };

  const lowStockCount = pharmacy.filter((p) => p.status === "low_stock").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Pharmacy & Formulary Management
          </h1>
          <p className="text-xs text-slate-500 sm:text-sm">
            Monitor dynamic inventory, low-stock alerts, patient dispensing, and medication restocking.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {lowStockCount > 0 && (
            <span className="badge-amber flex items-center gap-1">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
              {lowStockCount} items need restock
            </span>
          )}
          <button
            onClick={() => setIsAddMedModalOpen(true)}
            className="btn-primary"
          >
            <Plus className="h-4 w-4" /> Add New Medicine
          </button>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {categoryTabs.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                categoryFilter === cat
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {cat === "All" ? "All Categories" : cat.split("&")[0].trim()}
            </button>
          ))}
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search brand, generic, batch..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-9 text-xs"
          />
        </div>
      </div>

      {/* Pharmacy Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold">
              <tr>
                <th className="py-3.5 px-4">Medicine & Generic</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Dosage Form</th>
                <th className="py-3.5 px-4">Current Stock</th>
                <th className="py-3.5 px-4">Unit Price</th>
                <th className="py-3.5 px-4">Batch & Expiry</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredPharmacy.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">
                    <Pill className="h-10 w-10 mx-auto mb-2 opacity-40" />
                    <p className="font-semibold text-sm">No pharmaceuticals found</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Adjust your search or click "+ Add New Medicine" above.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredPharmacy.map((med) => {
                  const isLow = med.status === "low_stock" || med.stock <= med.minThreshold;

                  return (
                    <tr key={med.id} className="hover:bg-slate-50/80 transition">
                      {/* Name and Generic */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-9 w-9 items-center justify-center rounded-xl flex-shrink-0 ${
                            isLow ? "bg-amber-100 text-amber-700" : "bg-blue-50 text-blue-600"
                          }`}>
                            <Pill className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <p className="font-bold text-slate-900 text-sm">{med.brand || med.name}</p>
                              {med.strength && (
                                <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-medium">
                                  {med.strength}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 font-medium">
                              Generic: {med.name} • <span className="text-slate-400">{med.manufacturer || "Certified Labs"}</span>
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4">
                        <span className="badge-purple">{med.category}</span>
                      </td>

                      {/* Dosage Form */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700">
                          {med.dosageForm}
                        </span>
                      </td>

                      {/* Current Stock */}
                      <td className="py-3.5 px-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`font-mono text-sm font-extrabold ${
                              isLow ? "text-rose-600" : "text-emerald-700"
                            }`}>
                              {med.stock} units
                            </span>
                            {isLow && (
                              <span className="badge-rose text-[10px] py-0.5">Low Stock</span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400">Min Alert: {med.minThreshold} units</p>
                        </div>
                      </td>

                      {/* Unit Price */}
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-slate-900">
                          ${Number(med.unitPrice).toFixed(2)}
                        </span>
                      </td>

                      {/* Batch & Expiry */}
                      <td className="py-3.5 px-4">
                        <p className="font-mono text-[11px] font-semibold text-slate-800">{med.batchNo}</p>
                        <p className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> Exp: {med.expiryDate}
                        </p>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setSelectedMedForDispense(med);
                              setIsDispenseModalOpen(true);
                            }}
                            disabled={med.stock <= 0}
                            className="inline-flex items-center gap-1 rounded-xl bg-blue-50 px-2.5 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 disabled:opacity-40 transition"
                            title="Dispense to Patient"
                          >
                            <ArrowDownCircle className="h-3.5 w-3.5" /> Dispense
                          </button>
                          <button
                            onClick={() => {
                              setSelectedMedForRestock(med);
                              setIsRestockModalOpen(true);
                            }}
                            className="inline-flex items-center gap-1 rounded-xl bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition"
                            title="Restock units"
                          >
                            <ArrowUpCircle className="h-3.5 w-3.5" /> Restock
                          </button>
                          {deleteMedicine && (
                            <button
                              onClick={() => {
                                if (window.confirm(`Remove ${med.brand} from formulary?`)) {
                                  deleteMedicine(med.id);
                                }
                              }}
                              className="rounded-xl p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition"
                              title="Delete pharmaceutical"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
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

      {/* Restock Medicine Modal */}
      {isRestockModalOpen && selectedMedForRestock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Restock Medicine</h3>
                <p className="text-xs text-blue-600 font-semibold">{selectedMedForRestock.brand}</p>
              </div>
              <button
                onClick={() => setIsRestockModalOpen(false)}
                className="rounded-xl p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleRestockSubmit} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700">Units to Add</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={restockUnits}
                  onChange={(e) => setRestockUnits(Number(e.target.value))}
                  className="input-field mt-1 font-mono text-sm"
                />
              </div>

              <div className="rounded-xl bg-slate-50 p-3 border border-slate-100 text-slate-600">
                <p>Current In Stock: <strong>{selectedMedForRestock.stock} units</strong></p>
                <p className="mt-1">
                  New Total: <strong className="text-emerald-600">{selectedMedForRestock.stock + Number(restockUnits)} units</strong>
                </p>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setIsRestockModalOpen(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Confirm Restock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dispense Medicine Modal */}
      {isDispenseModalOpen && selectedMedForDispense && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Dispense Pharmaceutical</h3>
                <p className="text-xs text-blue-600 font-semibold">{selectedMedForDispense.brand}</p>
              </div>
              <button
                onClick={() => setIsDispenseModalOpen(false)}
                className="rounded-xl p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleDispenseSubmit} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700">Patient Recipient</label>
                <select
                  value={dispensePatientName}
                  onChange={(e) => setDispensePatientName(e.target.value)}
                  className="input-field mt-1"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name} ({p.id})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700">Units to Dispense</label>
                <input
                  type="number"
                  min="1"
                  max={selectedMedForDispense.stock}
                  required
                  value={dispenseUnits}
                  onChange={(e) => setDispenseUnits(Number(e.target.value))}
                  className="input-field mt-1 font-mono text-sm"
                />
              </div>

              <div className="rounded-xl bg-slate-50 p-3 border border-slate-100 text-slate-600">
                <p>Available In Stock: <strong>{selectedMedForDispense.stock} units</strong></p>
                <p className="mt-1">
                  Remaining After Dispensing:{" "}
                  <strong className="text-blue-600">{selectedMedForDispense.stock - Number(dispenseUnits)} units</strong>
                </p>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setIsDispenseModalOpen(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Confirm Dispensing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Medicine Modal */}
      {isAddMedModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Add New Pharmaceutical</h3>
                <p className="text-xs text-slate-500">Add a new drug or compound to the hospital pharmacy inventory.</p>
              </div>
              <button
                onClick={() => setIsAddMedModalOpen(false)}
                className="rounded-xl p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddMedSubmit} className="mt-4 space-y-3.5 text-xs">
              {/* Brand and Generic */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700">Brand / Trade Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Augmentin 625mg, Lipitor 20mg"
                    value={newMedData.brand}
                    onChange={(e) => setNewMedData({ ...newMedData, brand: e.target.value })}
                    className="input-field mt-1"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Generic Formula / Chemical</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Amoxicillin + Clavulanate"
                    value={newMedData.name}
                    onChange={(e) => setNewMedData({ ...newMedData, name: e.target.value })}
                    className="input-field mt-1"
                  />
                </div>
              </div>

              {/* Category with Custom Option */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-slate-700">Therapeutic Category</label>
                  <button
                    type="button"
                    onClick={() => setIsCustomCategory(!isCustomCategory)}
                    className="text-[11px] text-blue-600 hover:underline font-medium"
                  >
                    {isCustomCategory ? "← Pick from existing categories" : "+ Or enter custom category"}
                  </button>
                </div>

                {isCustomCategory ? (
                  <input
                    type="text"
                    required
                    placeholder="Enter custom category (e.g. Ophthalmology)"
                    value={newMedData.customCategoryName}
                    onChange={(e) =>
                      setNewMedData({ ...newMedData, customCategoryName: e.target.value })
                    }
                    className="input-field mt-1"
                  />
                ) : (
                  <select
                    value={newMedData.category}
                    onChange={(e) => setNewMedData({ ...newMedData, category: e.target.value })}
                    className="input-field mt-1"
                  >
                    {dynamicCategories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Dosage Form and Strength */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700">Dosage Form</label>
                  <select
                    value={newMedData.dosageForm}
                    onChange={(e) => setNewMedData({ ...newMedData, dosageForm: e.target.value })}
                    className="input-field mt-1"
                  >
                    <option value="Tablet">Tablet</option>
                    <option value="Capsule">Capsule</option>
                    <option value="Vial / IV Infusion">Vial / IV Infusion</option>
                    <option value="Syrup / Liquid">Syrup / Liquid</option>
                    <option value="Inhaler">Inhaler</option>
                    <option value="Pre-filled Syringe">Pre-filled Syringe</option>
                    <option value="Topical Ointment">Topical Ointment</option>
                    <option value="Eye / Ear Drops">Eye / Ear Drops</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Strength / Concentration</label>
                  <input
                    type="text"
                    placeholder="e.g. 500mg, 10ml, 100mcg"
                    value={newMedData.strength}
                    onChange={(e) => setNewMedData({ ...newMedData, strength: e.target.value })}
                    className="input-field mt-1"
                  />
                </div>
              </div>

              {/* Stock, Threshold, Unit Price */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700">Initial Stock</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={newMedData.stock}
                    onChange={(e) => setNewMedData({ ...newMedData, stock: Number(e.target.value) })}
                    className="input-field mt-1"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Min Alert Threshold</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={newMedData.minThreshold}
                    onChange={(e) => setNewMedData({ ...newMedData, minThreshold: Number(e.target.value) })}
                    className="input-field mt-1"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Unit Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={newMedData.unitPrice}
                    onChange={(e) => setNewMedData({ ...newMedData, unitPrice: Number(e.target.value) })}
                    className="input-field mt-1"
                  />
                </div>
              </div>

              {/* Batch Number & Expiry */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700">Batch / Lot Number</label>
                  <input
                    type="text"
                    required
                    value={newMedData.batchNo}
                    onChange={(e) => setNewMedData({ ...newMedData, batchNo: e.target.value })}
                    className="input-field mt-1 font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Expiry Date</label>
                  <input
                    type="date"
                    required
                    value={newMedData.expiryDate}
                    onChange={(e) => setNewMedData({ ...newMedData, expiryDate: e.target.value })}
                    className="input-field mt-1"
                  />
                </div>
              </div>

              {/* Manufacturer and Storage */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700">Manufacturer / Pharma Lab</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pfizer, GSK, Novartis"
                    value={newMedData.manufacturer}
                    onChange={(e) => setNewMedData({ ...newMedData, manufacturer: e.target.value })}
                    className="input-field mt-1"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Storage Conditions</label>
                  <select
                    value={newMedData.storageTemp}
                    onChange={(e) => setNewMedData({ ...newMedData, storageTemp: e.target.value })}
                    className="input-field mt-1"
                  >
                    <option value="Controlled Room Temp (20-25°C)">Controlled Room Temp (20-25°C)</option>
                    <option value="Refrigerated (2-8°C)">Refrigerated (2-8°C)</option>
                    <option value="Cold Storage / Frozen (-20°C)">Cold Storage / Frozen (-20°C)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddMedModalOpen(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save to Formulary Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
