import React, { useState, useMemo } from "react";
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  Users,
  DollarSign,
  Activity,
  BedDouble,
  Pill,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Layers,
  ChevronRight,
} from "lucide-react";
import { useHospital } from "../../context/HospitalContext";

export default function ReportsAnalyticsModule() {
  const { patients, appointments, invoices, beds, pharmacy } = useHospital();

  const [timeRange, setTimeRange] = useState("Month"); // "Week" | "Month" | "Quarter" | "Year"
  const [metricMode, setMetricMode] = useState("patients"); // "patients" | "revenue"
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Dynamic datasets structured for each time range
  const analyticsDatasets = useMemo(() => {
    return {
      Week: {
        title: "Daily Patient Inflow & Clinical Revenue",
        subtitle: "7-day rolling inpatient admissions and outpatient volume",
        dataPoints: [
          { label: "Mon", subLabel: "Sep 13", patients: 38, admissions: 8, revenue: 9500, waitTime: "11m" },
          { label: "Tue", subLabel: "Sep 14", patients: 46, admissions: 11, revenue: 12200, waitTime: "13m" },
          { label: "Wed", subLabel: "Sep 15", patients: 54, admissions: 14, revenue: 14800, waitTime: "14m" },
          { label: "Thu", subLabel: "Sep 16", patients: 49, admissions: 10, revenue: 11900, waitTime: "12m" },
          { label: "Fri", subLabel: "Sep 17", patients: 62, admissions: 16, revenue: 17400, waitTime: "10m" },
          { label: "Sat", subLabel: "Sep 18", patients: 28, admissions: 6, revenue: 7100, waitTime: "9m" },
          { label: "Sun", subLabel: "Sep 19", patients: 21, admissions: 4, revenue: 5100, waitTime: "8m" },
        ],
        kpiWaitTime: "11 mins",
        kpiWaitTrend: "↓ 4 mins faster than baseline",
        kpiWaitGood: true,
        kpiBedTurnover: "88.5%",
        kpiBedSub: "Current active bed occupancy",
        kpiFillRate: "99.2%",
        kpiFillSub: "Pharmacy dispensary resilience",
        kpiRevenue: "$78,000",
        kpiRevenueTrend: "↑ 14.2% vs previous 7 days",
        kpiRevenueGood: true,
        departmentRevenue: [
          { name: "Cardiovascular Sciences", share: 36, amount: 28080, color: "bg-blue-600" },
          { name: "Neurosciences & Surgery", share: 25, amount: 19500, color: "bg-indigo-600" },
          { name: "Pediatrics & Child Health", share: 17, amount: 13260, color: "bg-purple-600" },
          { name: "Laboratory Pathology", share: 12, amount: 9360, color: "bg-emerald-600" },
          { name: "Pharmacy Dispensary", share: 10, amount: 7800, color: "bg-amber-600" },
        ],
        topMedicines: [
          { name: "Augmentin 625mg", count: 86, category: "Antibiotics", trend: "+14%" },
          { name: "Lipitor 20mg", count: 74, category: "Cardiology", trend: "+9%" },
          { name: "Glucophage 500mg", count: 58, category: "Antidiabetic", trend: "+4%" },
          { name: "Ventolin Inhaler", count: 42, category: "Respiratory", trend: "+18%" },
          { name: "Perfalgan 1000mg IV", count: 36, category: "Analgesics", trend: "-2%" },
        ],
      },
      Month: {
        title: "Weekly Patient Volume & Monthly Financial Trajectory",
        subtitle: "Aggregated outpatient encounters and surgical admissions across 5 weeks",
        dataPoints: [
          { label: "Week 1", subLabel: "Sep 1 - 7", patients: 192, admissions: 44, revenue: 48600, waitTime: "13m" },
          { label: "Week 2", subLabel: "Sep 8 - 14", patients: 218, admissions: 52, revenue: 56200, waitTime: "14m" },
          { label: "Week 3", subLabel: "Sep 15 - 21", patients: 246, admissions: 61, revenue: 64800, waitTime: "15m" },
          { label: "Week 4", subLabel: "Sep 22 - 28", patients: 232, admissions: 57, revenue: 59400, waitTime: "14m" },
          { label: "Current", subLabel: "Sep 29 - 30", patients: 96, admissions: 22, revenue: 24200, waitTime: "12m" },
        ],
        kpiWaitTime: "13.6 mins",
        kpiWaitTrend: "↓ 2.4 mins faster than monthly goal",
        kpiWaitGood: true,
        kpiBedTurnover: "3.2 days",
        kpiBedSub: "Optimal clinical patient throughput",
        kpiFillRate: "98.4%",
        kpiFillSub: "Prescription fulfillment consistency",
        kpiRevenue: "$253,200",
        kpiRevenueTrend: "↑ 18.2% vs previous month",
        kpiRevenueGood: true,
        departmentRevenue: [
          { name: "Cardiovascular Sciences", share: 38, amount: 96216, color: "bg-blue-600" },
          { name: "Neurosciences & Surgery", share: 24, amount: 60768, color: "bg-indigo-600" },
          { name: "Pediatrics & Child Health", share: 16, amount: 40512, color: "bg-purple-600" },
          { name: "Laboratory Pathology", share: 12, amount: 30384, color: "bg-emerald-600" },
          { name: "Pharmacy Dispensary", share: 10, amount: 25320, color: "bg-amber-600" },
        ],
        topMedicines: [
          { name: "Augmentin 625mg", count: 320, category: "Antibiotics", trend: "+12%" },
          { name: "Lipitor 20mg", count: 284, category: "Cardiology", trend: "+8%" },
          { name: "Glucophage 500mg", count: 210, category: "Antidiabetic", trend: "+5%" },
          { name: "Ventolin Inhaler", count: 175, category: "Respiratory", trend: "+14%" },
          { name: "Perfalgan 1000mg IV", count: 140, category: "Analgesics", trend: "-3%" },
        ],
      },
      Quarter: {
        title: "Quarterly Performance & Growth Indicators",
        subtitle: "Multi-quarter trend tracking seasonal clinical admissions and turnover",
        dataPoints: [
          { label: "Q1 '25", subLabel: "Jan - Mar 25", patients: 580, admissions: 135, revenue: 148000, waitTime: "18m" },
          { label: "Q2 '25", subLabel: "Apr - Jun 25", patients: 645, admissions: 154, revenue: 168000, waitTime: "16m" },
          { label: "Q3 '25", subLabel: "Jul - Sep 25", patients: 710, admissions: 176, revenue: 189000, waitTime: "15m" },
          { label: "Q4 '25", subLabel: "Oct - Dec 25", patients: 785, admissions: 198, revenue: 212000, waitTime: "16m" },
          { label: "Q1 '26", subLabel: "Jan - Mar 26", patients: 860, admissions: 215, revenue: 236000, waitTime: "14m" },
          { label: "Q2 '26", subLabel: "Apr - Jun 26", patients: 940, admissions: 242, revenue: 264000, waitTime: "13m" },
        ],
        kpiWaitTime: "14.8 mins",
        kpiWaitTrend: "↓ 3.2 mins quarterly improvement",
        kpiWaitGood: true,
        kpiBedTurnover: "3.1 days",
        kpiBedSub: "Quarterly bed turnover cycle",
        kpiFillRate: "98.8%",
        kpiFillSub: "Sustained inventory availability",
        kpiRevenue: "$762,000",
        kpiRevenueTrend: "↑ 21.6% vs same quarter last year",
        kpiRevenueGood: true,
        departmentRevenue: [
          { name: "Cardiovascular Sciences", share: 39, amount: 297180, color: "bg-blue-600" },
          { name: "Neurosciences & Surgery", share: 23, amount: 175260, color: "bg-indigo-600" },
          { name: "Pediatrics & Child Health", share: 16, amount: 121920, color: "bg-purple-600" },
          { name: "Laboratory Pathology", share: 13, amount: 99060, color: "bg-emerald-600" },
          { name: "Pharmacy Dispensary", share: 9, amount: 68580, color: "bg-amber-600" },
        ],
        topMedicines: [
          { name: "Augmentin 625mg", count: 960, category: "Antibiotics", trend: "+16%" },
          { name: "Lipitor 20mg", count: 840, category: "Cardiology", trend: "+11%" },
          { name: "Glucophage 500mg", count: 680, category: "Antidiabetic", trend: "+7%" },
          { name: "Ventolin Inhaler", count: 540, category: "Respiratory", trend: "+15%" },
          { name: "Perfalgan 1000mg IV", count: 420, category: "Analgesics", trend: "+2%" },
        ],
      },
      Year: {
        title: "Annual Hospital Growth & Multi-Year Scale",
        subtitle: "Multi-year clinical adoption, expanding facilities, and hospital revenue",
        dataPoints: [
          { label: "2021", subLabel: "FY 2021", patients: 1480, admissions: 340, revenue: 380000, waitTime: "22m" },
          { label: "2022", subLabel: "FY 2022", patients: 2180, admissions: 510, revenue: 540000, waitTime: "19m" },
          { label: "2023", subLabel: "FY 2023", patients: 2890, admissions: 680, revenue: 710000, waitTime: "17m" },
          { label: "2024", subLabel: "FY 2024", patients: 3640, admissions: 890, revenue: 920000, waitTime: "15m" },
          { label: "2025", subLabel: "FY 2025", patients: 4520, admissions: 1120, revenue: 1180000, waitTime: "14m" },
          { label: "2026", subLabel: "FY 2026 YTD", patients: 5880, admissions: 1460, revenue: 1480000, waitTime: "13m" },
        ],
        kpiWaitTime: "13.2 mins",
        kpiWaitTrend: "↓ 8.8 mins sustained multi-year drop",
        kpiWaitGood: true,
        kpiBedTurnover: "2.8 days",
        kpiBedSub: "Highest efficiency cohort in state",
        kpiFillRate: "99.4%",
        kpiFillSub: "Integrated AI supply chain resilience",
        kpiRevenue: "$1,480,000",
        kpiRevenueTrend: "↑ 25.4% YoY enterprise growth",
        kpiRevenueGood: true,
        departmentRevenue: [
          { name: "Cardiovascular Sciences", share: 41, amount: 606800, color: "bg-blue-600" },
          { name: "Neurosciences & Surgery", share: 24, amount: 355200, color: "bg-indigo-600" },
          { name: "Pediatrics & Child Health", share: 15, amount: 222000, color: "bg-purple-600" },
          { name: "Laboratory Pathology", share: 12, amount: 177600, color: "bg-emerald-600" },
          { name: "Pharmacy Dispensary", share: 8, amount: 118400, color: "bg-amber-600" },
        ],
        topMedicines: [
          { name: "Augmentin 625mg", count: 3840, category: "Antibiotics", trend: "+22%" },
          { name: "Lipitor 20mg", count: 3260, category: "Cardiology", trend: "+19%" },
          { name: "Glucophage 500mg", count: 2680, category: "Antidiabetic", trend: "+14%" },
          { name: "Ventolin Inhaler", count: 2150, category: "Respiratory", trend: "+28%" },
          { name: "Perfalgan 1000mg IV", count: 1890, category: "Analgesics", trend: "+8%" },
        ],
      },
    };
  }, []);

  const currentDataset = analyticsDatasets[timeRange] || analyticsDatasets.Month;

  // Max value calculation for dynamic scaling of bars
  const maxValue = useMemo(() => {
    const values = currentDataset.dataPoints.map((d) =>
      metricMode === "patients" ? d.patients : d.revenue
    );
    return Math.max(...values, 1);
  }, [currentDataset, metricMode]);

  // Aggregate stats for the current selected dataset
  const totalMetric = useMemo(() => {
    return currentDataset.dataPoints.reduce(
      (acc, d) => acc + (metricMode === "patients" ? d.patients : d.revenue),
      0
    );
  }, [currentDataset, metricMode]);

  const peakItem = useMemo(() => {
    return [...currentDataset.dataPoints].sort((a, b) =>
      metricMode === "patients" ? b.patients - a.patients : b.revenue - a.revenue
    )[0];
  }, [currentDataset, metricMode]);

  // Dynamic CSV Exporter matching the exact selected time range
  const handleExportCSV = () => {
    let csvHeader = "Interval,Sub_Label,Patients,Inpatient_Admissions,Revenue_USD,Avg_Wait_Time\n";
    let csvRows = currentDataset.dataPoints
      .map(
        (p) =>
          `"${p.label}","${p.subLabel}",${p.patients},${p.admissions},${p.revenue},"${p.waitTime}"`
      )
      .join("\n");

    const csvContent = "data:text/csv;charset=utf-8," + csvHeader + csvRows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `AuraCare_Hospital_Analytics_${timeRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
              Hospital Analytics & Operational Reports
            </h1>
            <span className="badge-blue font-bold">Live Data</span>
          </div>
          <p className="text-xs text-slate-500 sm:text-sm">
            Clinical metrics, patient volumes, revenue streams, and hospital performance statistics.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Dynamic Time Range Filter Tabs */}
          <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
            {["Week", "Month", "Quarter", "Year"].map((range) => {
              const isSelected = timeRange === range;
              return (
                <button
                  key={range}
                  onClick={() => {
                    setTimeRange(range);
                    setHoveredIndex(null);
                  }}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                    isSelected
                      ? "bg-white text-blue-700 shadow-sm"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                  }`}
                >
                  {range}
                </button>
              );
            })}
          </div>

          <button onClick={handleExportCSV} className="btn-primary text-xs">
            <Download className="h-4 w-4" /> Export {timeRange} CSV
          </button>
        </div>
      </div>

      {/* 4 Performance Indicators Dynamically Changing with Time Range */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* KPI 1: Wait Time */}
        <div className="card p-4 transition-all duration-300 hover:shadow-md">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Average Patient Wait Time</span>
            <Clock className="h-4 w-4 text-blue-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{currentDataset.kpiWaitTime}</p>
          <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-0.5 mt-1">
            <ArrowDownRight className="h-3 w-3" /> {currentDataset.kpiWaitTrend}
          </span>
        </div>

        {/* KPI 2: Bed Turnover */}
        <div className="card p-4 transition-all duration-300 hover:shadow-md">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Bed Turnover / Occupancy</span>
            <BedDouble className="h-4 w-4 text-purple-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{currentDataset.kpiBedTurnover}</p>
          <span className="text-[11px] font-semibold text-purple-700 flex items-center gap-0.5 mt-1">
            <Activity className="h-3 w-3" /> {currentDataset.kpiBedSub}
          </span>
        </div>

        {/* KPI 3: Prescription Fill Rate */}
        <div className="card p-4 transition-all duration-300 hover:shadow-md">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Prescription Fill Rate</span>
            <Pill className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{currentDataset.kpiFillRate}</p>
          <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-0.5 mt-1">
            <Sparkles className="h-3 w-3" /> {currentDataset.kpiFillSub}
          </span>
        </div>

        {/* KPI 4: Hospital Revenue */}
        <div className="card p-4 transition-all duration-300 hover:shadow-md bg-gradient-to-br from-white to-blue-50/40">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Net Hospital Revenue ({timeRange})</span>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </div>
          <p className="text-2xl font-black text-blue-900 mt-2">{currentDataset.kpiRevenue}</p>
          <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-0.5 mt-1">
            <ArrowUpRight className="h-3 w-3" /> {currentDataset.kpiRevenueTrend}
          </span>
        </div>
      </div>

      {/* Visual Chart: Dynamic Bar Graph with Metric Mode Switcher */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-2">
          {/* Chart Header & Controls */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-slate-900">{currentDataset.title}</h3>
                <span className="badge-blue text-[10px]">{timeRange} View</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{currentDataset.subtitle}</p>
            </div>

            {/* Metric Mode Toggle (Patients vs Revenue) */}
            <div className="flex items-center gap-1.5 self-start sm:self-auto">
              <span className="text-[11px] font-semibold text-slate-400">View by:</span>
              <div className="flex rounded-lg bg-slate-100 p-0.5 text-xs font-semibold border border-slate-200">
                <button
                  onClick={() => setMetricMode("patients")}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition ${
                    metricMode === "patients"
                      ? "bg-white text-blue-700 shadow-xs font-bold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Users className="h-3 w-3" /> Patients
                </button>
                <button
                  onClick={() => setMetricMode("revenue")}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition ${
                    metricMode === "revenue"
                      ? "bg-white text-emerald-700 shadow-xs font-bold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <DollarSign className="h-3 w-3" /> Revenue ($)
                </button>
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar for Selected Range */}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <div>
              <span className="text-slate-400">Total in {timeRange}: </span>
              <strong className="text-slate-900 font-mono">
                {metricMode === "patients"
                  ? `${totalMetric.toLocaleString()} Patients`
                  : `$${totalMetric.toLocaleString()}`}
              </strong>
            </div>
            {peakItem && (
              <div className="flex items-center gap-1 text-blue-700 font-medium">
                <span className="h-2 w-2 rounded-full bg-blue-600" />
                <span>Peak Period: <strong>{peakItem.label}</strong> ({metricMode === "patients" ? `${peakItem.patients} patients` : `$${peakItem.revenue.toLocaleString()}`})</span>
              </div>
            )}
          </div>

          {/* Dynamic Interactive CSS Bar Chart */}
          <div className="mt-6 flex h-56 items-end gap-2 sm:gap-4 px-2 relative">
            {currentDataset.dataPoints.map((item, idx) => {
              const currentValue = metricMode === "patients" ? item.patients : item.revenue;
              const heightPercent = Math.max(12, Math.round((currentValue / maxValue) * 100));
              const isHovered = hoveredIndex === idx;

              return (
                <div
                  key={`${timeRange}-${idx}`}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="flex-1 flex flex-col items-center gap-2 group cursor-pointer relative"
                >
                  {/* Floating Interactive Tooltip */}
                  {isHovered && (
                    <div className="absolute -top-24 z-30 flex flex-col items-center pointer-events-none animate-fade-in">
                      <div className="rounded-xl bg-slate-900 text-white p-2.5 shadow-xl text-[11px] min-w-[130px] text-center border border-slate-700">
                        <p className="font-extrabold text-blue-300">{item.label} ({item.subLabel})</p>
                        <div className="mt-1 space-y-0.5 text-left border-t border-slate-700 pt-1">
                          <p className="flex justify-between">
                            <span className="text-slate-400">Patients:</span>
                            <strong>{item.patients}</strong>
                          </p>
                          <p className="flex justify-between">
                            <span className="text-slate-400">Admitted:</span>
                            <strong>{item.admissions}</strong>
                          </p>
                          <p className="flex justify-between text-emerald-300 font-bold">
                            <span className="text-slate-400">Revenue:</span>
                            <span>${item.revenue.toLocaleString()}</span>
                          </p>
                        </div>
                      </div>
                      <div className="w-2 h-2 bg-slate-900 rotate-45 -mt-1" />
                    </div>
                  )}

                  {/* Value label above bar */}
                  <span
                    className={`text-[10px] font-mono font-bold transition-opacity duration-200 ${
                      isHovered ? "text-blue-700 opacity-100" : "text-slate-400 opacity-80 group-hover:opacity-100"
                    }`}
                  >
                    {metricMode === "patients"
                      ? item.patients
                      : `$${(item.revenue / 1000).toFixed(0)}k`}
                  </span>

                  {/* Bar track and bar fill with dynamic height */}
                  <div className="w-full rounded-t-xl bg-slate-100/90 h-40 flex items-end overflow-hidden p-1 transition">
                    <div
                      className={`w-full rounded-lg transition-all duration-700 ease-out shadow-xs ${
                        isHovered
                          ? metricMode === "patients"
                            ? "bg-gradient-to-t from-blue-700 to-indigo-600 scale-x-105"
                            : "bg-gradient-to-t from-emerald-600 to-teal-500 scale-x-105"
                          : metricMode === "patients"
                          ? "bg-gradient-to-t from-blue-600 to-indigo-500"
                          : "bg-gradient-to-t from-emerald-500 to-teal-400"
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>

                  {/* Bottom Labels */}
                  <div className="text-center">
                    <p className="text-xs font-bold text-slate-800 leading-tight">{item.label}</p>
                    <p className="text-[10px] text-slate-400 font-medium leading-tight hidden sm:block">
                      {item.subLabel}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Revenue by Department Dynamically Scaled */}
        <div className="card p-5">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900">Revenue Breakdown</h3>
            <p className="text-xs text-slate-500">Contribution by specialty during {timeRange}</p>
          </div>

          <div className="mt-4 space-y-3.5 text-xs">
            {currentDataset.departmentRevenue.map((dept, idx) => (
              <div key={idx}>
                <div className="flex justify-between font-semibold text-slate-700 mb-1">
                  <span className="truncate max-w-[170px] font-medium">{dept.name}</span>
                  <span className="font-mono text-slate-900">
                    ${dept.amount.toLocaleString()} ({dept.share}%)
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full ${dept.color} rounded-full transition-all duration-700 ease-out`}
                    style={{ width: `${dept.share}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Department Summary Note */}
          <div className="mt-5 rounded-xl bg-blue-50/70 p-3 border border-blue-100 text-xs text-blue-900 space-y-1">
            <p className="font-bold flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5 text-blue-600" />
              Highest Contributor: Cardiovascular Sciences
            </p>
            <p className="text-[11px] text-slate-600">
              Interventional cath lab and cardiac telemetry generated {currentDataset.departmentRevenue[0].share}% of all hospital billings in this period.
            </p>
          </div>
        </div>
      </div>

      {/* Top Medicines Dispensed for this Period */}
      <div className="card p-5">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Top Dispensed Pharmaceuticals ({timeRange} Snapshot)
            </h3>
            <p className="text-xs text-slate-500">High-volume medications prescribed across wards</p>
          </div>
          <span className="text-xs font-semibold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
            Formulary Utilization Rate
          </span>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold">
              <tr>
                <th className="py-2.5 px-3">Medication & Formula</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Units Dispensed</th>
                <th className="py-2.5 px-3">Demand Trend</th>
                <th className="py-2.5 px-3 text-right">Supply Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {currentDataset.topMedicines.map((med, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition">
                  <td className="py-2.5 px-3 font-bold text-slate-900">{med.name}</td>
                  <td className="py-2.5 px-3">
                    <span className="badge-blue">{med.category}</span>
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-800">
                    {med.count.toLocaleString()} doses
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-emerald-600">{med.trend}</td>
                  <td className="py-2.5 px-3 text-right">
                    <span className="badge-emerald">Stock Healthy</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
