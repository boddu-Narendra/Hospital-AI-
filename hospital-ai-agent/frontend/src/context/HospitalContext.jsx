import React, { createContext, useContext, useState, useEffect } from "react";
import {
  INITIAL_USERS,
  INITIAL_PATIENTS,
  INITIAL_APPOINTMENTS,
  INITIAL_CONSULTATIONS,
  INITIAL_MEDICAL_RECORDS,
  INITIAL_PHARMACY,
  INITIAL_LAB_TESTS,
  INITIAL_BEDS,
  INITIAL_INVOICES,
  INITIAL_NOTIFICATIONS,
  INITIAL_SECURITY_MATRIX,
  INITIAL_AUDIT_LOGS,
} from "../data/mockHospitalData";

const HospitalContext = createContext(null);

const loadStorage = (key, fallback) => {
  try {
    const item = localStorage.getItem(`hms_${key}`);
    return item ? JSON.parse(item) : fallback;
  } catch (err) {
    console.error(`Failed to load ${key} from localStorage`, err);
    return fallback;
  }
};

const saveStorage = (key, data) => {
  try {
    localStorage.setItem(`hms_${key}`, JSON.stringify(data));
  } catch (err) {
    console.error(`Failed to save ${key} to localStorage`, err);
  }
};

export const HospitalProvider = ({ children }) => {
  // Current Role & User State
  const [currentRole, setCurrentRole] = useState(() => loadStorage("role", "admin"));
  const [users, setUsers] = useState(() => loadStorage("users", INITIAL_USERS));
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = loadStorage("current_user", null);
    if (savedUser) return savedUser;
    return INITIAL_USERS.find((u) => u.role === "admin") || INITIAL_USERS[0];
  });

  // Clinical & Administrative State
  const [patients, setPatients] = useState(() => loadStorage("patients", INITIAL_PATIENTS));
  const [appointments, setAppointments] = useState(() => loadStorage("appointments", INITIAL_APPOINTMENTS));
  const [consultations, setConsultations] = useState(() => loadStorage("consultations", INITIAL_CONSULTATIONS));
  const [medicalRecords, setMedicalRecords] = useState(() => loadStorage("medical_records", INITIAL_MEDICAL_RECORDS));
  const [pharmacy, setPharmacy] = useState(() => loadStorage("pharmacy", INITIAL_PHARMACY));
  const [labTests, setLabTests] = useState(() => loadStorage("lab_tests", INITIAL_LAB_TESTS));
  const [beds, setBeds] = useState(() => loadStorage("beds", INITIAL_BEDS));
  const [invoices, setInvoices] = useState(() => loadStorage("invoices", INITIAL_INVOICES));
  const [notifications, setNotifications] = useState(() => loadStorage("notifications", INITIAL_NOTIFICATIONS));
  const [securityMatrix, setSecurityMatrix] = useState(() => loadStorage("security_matrix", INITIAL_SECURITY_MATRIX));
  const [auditLogs, setAuditLogs] = useState(() => loadStorage("audit_logs", INITIAL_AUDIT_LOGS));

  // Global UI States
  const [searchQuery, setSearchQuery] = useState("");
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Sync to localStorage
  useEffect(() => saveStorage("role", currentRole), [currentRole]);
  useEffect(() => saveStorage("users", users), [users]);
  useEffect(() => saveStorage("current_user", currentUser), [currentUser]);
  useEffect(() => saveStorage("patients", patients), [patients]);
  useEffect(() => saveStorage("appointments", appointments), [appointments]);
  useEffect(() => saveStorage("consultations", consultations), [consultations]);
  useEffect(() => saveStorage("medical_records", medicalRecords), [medicalRecords]);
  useEffect(() => saveStorage("pharmacy", pharmacy), [pharmacy]);
  useEffect(() => saveStorage("lab_tests", labTests), [labTests]);
  useEffect(() => saveStorage("beds", beds), [beds]);
  useEffect(() => saveStorage("invoices", invoices), [invoices]);
  useEffect(() => saveStorage("notifications", notifications), [notifications]);
  useEffect(() => saveStorage("security_matrix", securityMatrix), [securityMatrix]);
  useEffect(() => saveStorage("audit_logs", auditLogs), [auditLogs]);

  // Helper to show transient toasts
  const showToast = (message, type = "info") => {
    setToastMessage({ message, type, id: Date.now() });
    setTimeout(() => {
      setToastMessage((prev) => (prev?.message === message ? null : prev));
    }, 4000);
  };

  // Audit Logger
  const logAction = (action, moduleName, status = "Success") => {
    const newLog = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      user: `${currentUser.name} (${currentRole.toUpperCase()})`,
      action,
      module: moduleName,
      timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
      ip: "192.168.1.50",
      status,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Role Switcher
  const switchRole = (newRole) => {
    setCurrentRole(newRole);
    const matchingUser = users.find((u) => u.role === newRole) || {
      id: `usr-${newRole}-temp`,
      name: `${newRole.charAt(0).toUpperCase() + newRole.slice(1)} User`,
      email: `${newRole}@hospital.com`,
      role: newRole,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    };
    setCurrentUser(matchingUser);
    showToast(`Switched active persona to ${newRole.toUpperCase()}`, "success");
    logAction(`Switched role to ${newRole}`, "Security");
  };

  // User Management Actions
  const addUser = (userData) => {
    const newUser = {
      id: `usr-${Date.now().toString().slice(-4)}`,
      status: "active",
      joinedDate: new Date().toISOString().split("T")[0],
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
      ...userData,
    };
    setUsers((prev) => [newUser, ...prev]);
    showToast(`User ${newUser.name} created successfully!`, "success");
    logAction(`Created user ${newUser.name}`, "User Management");
    return newUser;
  };

  const updateUserStatus = (userId, newStatus) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
    );
    showToast(`User status updated to ${newStatus}`, "info");
    logAction(`Updated user status for ID ${userId}`, "User Management");
  };

  // Doctor Management Actions
  const doctors = users.filter((u) => u.role === "doctor");

  const toggleDoctorAvailability = (doctorId) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === doctorId) {
          const newAvail = u.availability === "on_duty" ? "off_duty" : "on_duty";
          showToast(`Dr. ${u.name.replace("Dr. ", "")} is now ${newAvail.replace("_", " ")}`, "info");
          return { ...u, availability: newAvail };
        }
        return u;
      })
    );
    logAction(`Toggled doctor availability for ${doctorId}`, "Doctor Management");
  };

  const addDoctor = (docData) => {
    const newDoctor = {
      id: `usr-doc-${Date.now().toString().slice(-4)}`,
      name: docData.name.startsWith("Dr.") ? docData.name : `Dr. ${docData.name}`,
      email: docData.email || `${docData.name.toLowerCase().replace(/[^a-z0-9]/g, "")}@hospital.com`,
      password: docData.password || "doctor123",
      role: "doctor",
      specialty: docData.specialty || "General Medicine",
      department: docData.department || "Cardiovascular Sciences",
      avatar: docData.avatar || "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=200&q=80",
      phone: docData.phone || "+1 (555) 234-5678",
      status: "active",
      fee: Number(docData.fee || 150),
      room: docData.room || "OPD-201",
      rating: 5.0,
      experience: docData.experience || "3 years",
      availability: "on_duty",
      schedule: docData.schedule || "Mon - Fri, 09:00 AM - 04:00 PM",
      joinedDate: new Date().toISOString().split("T")[0],
    };
    setUsers((prev) => [newDoctor, ...prev]);
    showToast(`${newDoctor.name} added to hospital faculty!`, "success");
    logAction(`Added doctor ${newDoctor.name}`, "Doctor Management");
    return newDoctor;
  };

  // Patient Management Actions
  const addPatient = (patientData) => {
    const newId = `PAT-${1000 + patients.length + 1}`;
    const appointmentId = patientData.appointmentId || `APT-${Math.floor(1000 + Math.random() * 9000)}`;
    const email = patientData.email || `${appointmentId.toLowerCase()}@hospital.com`;

    const newPatient = {
      id: newId,
      appointmentId: appointmentId,
      name: patientData.name,
      age: Number(patientData.age || 30),
      gender: patientData.gender || "Male",
      bloodGroup: patientData.bloodGroup || "O+",
      phone: patientData.phone || "+1 (555) 000-0000",
      email: email,
      address: patientData.address || "On file",
      emergencyContact: patientData.emergencyContact || "None",
      allergies: patientData.allergies || "None",
      chronicConditions: patientData.chronicConditions || "None",
      admissionStatus: patientData.admissionStatus || "Outpatient",
      bedId: null,
      registeredDate: new Date().toISOString().split("T")[0],
      primaryDoctorId: patientData.primaryDoctorId || (doctors[0]?.id || ""),
      primaryDoctorName: patientData.primaryDoctorName || (doctors[0]?.name || "Dr. Sarah Jenkins"),
    };

    setPatients((prev) => [newPatient, ...prev]);

    // Also register in users directory so new patient can log in immediately
    const patientUser = {
      id: `usr-${newId}`,
      name: newPatient.name,
      email: email,
      role: "patient",
      appointment_id: appointmentId,
      phone: newPatient.phone,
      status: "active",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
      joinedDate: new Date().toISOString().split("T")[0],
    };
    setUsers((prev) => [patientUser, ...prev]);

    showToast(`Patient ${newPatient.name} registered (Passcode: ${appointmentId})`, "success");
    logAction(`Registered patient ${newPatient.name}`, "Patient Management");
    return newPatient;
  };

  // Unified Authentication Helper (validates both dummy and newly registered users)
  const authenticateUser = ({ role, identifier, password }) => {
    const trimmed = (identifier || "").trim().toLowerCase();

    if (role === "patient") {
      const foundPat = patients.find(
        (p) =>
          p.appointmentId.toLowerCase() === trimmed ||
          (p.email && p.email.toLowerCase() === trimmed) ||
          (p.phone && p.phone.replace(/\D/g, "") === trimmed.replace(/\D/g, ""))
      );
      if (foundPat) {
        const userObj = {
          id: foundPat.id,
          name: foundPat.name,
          email: foundPat.email,
          role: "patient",
          appointment_id: foundPat.appointmentId,
          avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
        };
        switchRole("patient");
        setCurrentUser(userObj);
        return { success: true, user: userObj };
      }

      const foundUser = users.find(
        (u) =>
          u.role === "patient" &&
          ((u.appointment_id && u.appointment_id.toLowerCase() === trimmed) ||
            u.email.toLowerCase() === trimmed)
      );
      if (foundUser) {
        switchRole("patient");
        setCurrentUser(foundUser);
        return { success: true, user: foundUser };
      }
      return {
        success: false,
        error: "Invalid appointment passcode or patient email. Please check your credentials or register a new account.",
      };
    }

    // Staff roles (admin, doctor, nurse, receptionist)
    const foundStaff = users.find(
      (u) =>
        u.role === role &&
        (u.email.toLowerCase() === trimmed || u.name.toLowerCase().includes(trimmed))
    );

    if (foundStaff) {
      switchRole(role);
      setCurrentUser(foundStaff);
      return { success: true, user: foundStaff };
    }

    return {
      success: false,
      error: `No ${role} account found matching "${identifier}". Please check your email or add a new account.`,
    };
  };

  const updatePatient = (patientId, updateFields) => {
    setPatients((prev) =>
      prev.map((p) => (p.id === patientId ? { ...p, ...updateFields } : p))
    );
    showToast("Patient records updated successfully", "success");
    logAction(`Updated details for patient ${patientId}`, "Patient Management");
  };

  // Appointment Management Actions
  const bookAppointment = (appData) => {
    const newApp = {
      id: `APP-${Date.now().toString().slice(-3)}`,
      status: "Scheduled",
      priority: "Normal",
      ...appData,
    };
    setAppointments((prev) => [newApp, ...prev]);
    showToast(`Appointment booked with ${newApp.doctorName} for ${newApp.patientName}`, "success");
    logAction(`Booked appointment for ${newApp.patientName}`, "Appointments");

    // Add automatic notification
    addNotification({
      title: "New Appointment Booked",
      message: `${newApp.patientName} scheduled with ${newApp.doctorName} on ${newApp.date} at ${newApp.time}.`,
      category: "Appointments",
      severity: "info",
      link: "/appointments",
    });

    return newApp;
  };

  const updateAppointmentStatus = (appId, newStatus) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, status: newStatus } : a))
    );
    showToast(`Appointment status changed to ${newStatus}`, "info");
    logAction(`Appointment ${appId} marked as ${newStatus}`, "Appointments");
  };

  const cancelAppointment = (appId, reason = "Cancelled by patient/doctor") => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, status: "Cancelled", cancelReason: reason } : a))
    );
    showToast(`Appointment ${appId} has been cancelled`, "warning");
    logAction(`Cancelled appointment ${appId}`, "Appointments");
  };

  // Doctor Consultation Actions
  const recordConsultation = (consultData) => {
    const newConsult = {
      id: `CNS-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().replace("T", " ").slice(0, 16),
      ...consultData,
    };
    setConsultations((prev) => [newConsult, ...prev]);

    // Create medical record entry
    const newRecord = {
      id: `REC-${Date.now().toString().slice(-4)}`,
      patientId: newConsult.patientId,
      patientName: newConsult.patientName,
      recordType: "Consultation Note",
      date: newConsult.date.split(" ")[0],
      title: `Consultation: ${newConsult.diagnosis.split("-")[1] || newConsult.diagnosis}`,
      doctor: newConsult.doctorName,
      department: newConsult.department,
      summary: `Diagnosis: ${newConsult.diagnosis}. Vitals: BP ${newConsult.vitals?.bloodPressure || "N/A"}, HR ${newConsult.vitals?.heartRate || "N/A"}. Treatment: ${newConsult.treatmentPlan}`,
      attachments: ["Clinical_Summary.pdf"],
    };
    setMedicalRecords((prev) => [newRecord, ...prev]);

    // Update appointment status if matching
    if (newConsult.appointmentId) {
      updateAppointmentStatus(newConsult.appointmentId, "Completed");
    }

    // Auto-create invoice item for consultation
    const docFee = doctors.find((d) => d.name === newConsult.doctorName)?.fee || 150;
    createInvoice({
      patientId: newConsult.patientId,
      patientName: newConsult.patientName,
      items: [
        { description: `Specialist Consultation - ${newConsult.doctorName}`, category: "Consultation", amount: docFee },
      ],
      subtotal: docFee,
      insuranceCover: Math.round(docFee * 0.7),
      tax: 0,
      totalPayable: Math.round(docFee * 0.3),
      paidAmount: 0,
      status: "Pending",
    });

    showToast("Consultation recorded and EHR updated!", "success");
    logAction(`Completed consultation for ${newConsult.patientName}`, "Consultation");
    return newConsult;
  };

  // Pharmacy Actions
  const restockMedicine = (medId, additionalUnits) => {
    setPharmacy((prev) =>
      prev.map((med) => {
        if (med.id === medId) {
          const updatedStock = med.stock + Number(additionalUnits);
          const newStatus = updatedStock <= med.minThreshold ? "low_stock" : "in_stock";
          return { ...med, stock: updatedStock, status: newStatus };
        }
        return med;
      })
    );
    showToast(`Restocked ${additionalUnits} units!`, "success");
    logAction(`Restocked medicine ID ${medId} by ${additionalUnits}`, "Pharmacy");
  };

  const dispenseMedicine = (medId, unitsToDispense, patientName = "Patient") => {
    let dispensed = false;
    setPharmacy((prev) =>
      prev.map((med) => {
        if (med.id === medId) {
          if (med.stock < unitsToDispense) {
            showToast(`Insufficient stock! Available: ${med.stock}`, "warning");
            return med;
          }
          dispensed = true;
          const updatedStock = med.stock - Number(unitsToDispense);
          const newStatus = updatedStock <= med.minThreshold ? "low_stock" : "in_stock";
          if (newStatus === "low_stock") {
            addNotification({
              title: "Low Pharmacy Stock Warning",
              message: `${med.name} (${med.brand}) reached low threshold (${updatedStock} left).`,
              category: "Pharmacy",
              severity: "warning",
              link: "/pharmacy",
            });
          }
          return { ...med, stock: updatedStock, status: newStatus };
        }
        return med;
      })
    );

    if (dispensed) {
      showToast(`Dispensed ${unitsToDispense} units for ${patientName}`, "success");
      logAction(`Dispensed medicine ${medId} (${unitsToDispense} units) to ${patientName}`, "Pharmacy");
    }
  };

  const addMedicine = (medData) => {
    const stockNum = Math.max(0, parseInt(medData.stock, 10) || 0);
    const minThresholdNum = Math.max(0, parseInt(medData.minThreshold, 10) || 30);
    const unitPriceNum = Math.max(0, parseFloat(medData.unitPrice) || 10);
    const brandName = (medData.brand || medData.name || "Medicine").trim();
    const genericName = (medData.name || medData.brand || "Pharmaceutical").trim();

    const newMed = {
      id: medData.id?.trim() || `MED-${Date.now().toString().slice(-4)}`,
      name: genericName,
      brand: brandName,
      category: medData.category || "General Formulary",
      dosageForm: medData.dosageForm || "Tablet",
      strength: medData.strength || "500mg",
      stock: stockNum,
      minThreshold: minThresholdNum,
      unitPrice: unitPriceNum,
      batchNo: medData.batchNo || `BATCH-${Date.now().toString().slice(-4)}`,
      expiryDate: medData.expiryDate || "2028-01-01",
      manufacturer: medData.manufacturer || "Certified Laboratories",
      prescriptionRequired: medData.prescriptionRequired !== false,
      storageTemp: medData.storageTemp || "Controlled Room Temp (20-25°C)",
      status: stockNum <= minThresholdNum ? "low_stock" : "in_stock",
    };
    setPharmacy((prev) => [newMed, ...prev]);
    showToast(`Added ${newMed.brand} (${newMed.name}) to pharmacy formulary!`, "success");
    logAction(`Added medicine ${newMed.brand} [${newMed.id}]`, "Pharmacy");
    return newMed;
  };

  const deleteMedicine = (medId) => {
    setPharmacy((prev) => prev.filter((m) => m.id !== medId));
    showToast(`Medicine #${medId} removed from inventory`, "info");
    logAction(`Removed medicine #${medId}`, "Pharmacy");
  };


  // Laboratory Actions
  const orderLabTest = (testData) => {
    const newTest = {
      id: `LAB-${Date.now().toString().slice(-3)}`,
      dateRequested: new Date().toISOString().split("T")[0],
      status: "Requested",
      approvalStatus: "Pending",
      technician: "Pending Assignment",
      priority: "Normal",
      results: [],
      ...testData,
    };
    setLabTests((prev) => [newTest, ...prev]);
    showToast(`Lab test "${newTest.testName}" ordered for ${newTest.patientName}`, "success");
    logAction(`Ordered lab test ${newTest.testName}`, "Laboratory");

    addNotification({
      title: "New Lab Test Order",
      message: `${newTest.testName} requested for ${newTest.patientName}.`,
      category: "Laboratory",
      severity: "info",
      link: "/laboratory",
    });

    return newTest;
  };

  const updateLabResults = (testId, resultsArray, notes = "") => {
    setLabTests((prev) =>
      prev.map((t) => {
        if (t.id === testId) {
          return {
            ...t,
            results: resultsArray,
            notes,
            status: "Completed",
            technician: currentUser.name || "Alex Vance, MLS",
          };
        }
        return t;
      })
    );
    showToast("Laboratory results recorded successfully", "success");
    logAction(`Recorded results for lab test ${testId}`, "Laboratory");
  };

  const approveLabTest = (testId) => {
    let approvedItem = null;
    setLabTests((prev) =>
      prev.map((t) => {
        if (t.id === testId) {
          approvedItem = { ...t, approvalStatus: "Approved" };
          return approvedItem;
        }
        return t;
      })
    );
    showToast(`Lab report #${testId} signed and approved!`, "success");
    logAction(`Approved lab report ${testId}`, "Laboratory");

    if (approvedItem) {
      addNotification({
        title: "Lab Results Ready & Approved",
        message: `${approvedItem.testName} for ${approvedItem.patientName} is now ready to view.`,
        category: "Laboratory",
        severity: "success",
        link: "/laboratory",
      });
    }
  };

  // Bed Management Actions
  const allocateBed = (bedId, patientId) => {
    const targetPatient = patients.find((p) => p.id === patientId);
    if (!targetPatient) {
      showToast("Patient not found", "error");
      return;
    }

    setBeds((prev) =>
      prev.map((b) =>
        b.id === bedId
          ? {
              ...b,
              status: "Occupied",
              patientId: targetPatient.id,
              patientName: targetPatient.name,
              admittedSince: new Date().toISOString().split("T")[0],
            }
          : b
      )
    );

    // Update patient status
    setPatients((prev) =>
      prev.map((p) => (p.id === patientId ? { ...p, admissionStatus: "Admitted", bedId } : p))
    );

    showToast(`Allocated ${bedId} to ${targetPatient.name}`, "success");
    logAction(`Allocated bed ${bedId} to ${targetPatient.name}`, "Bed Management");
  };

  const dischargeBed = (bedId) => {
    let dischargedPatientId = null;
    setBeds((prev) =>
      prev.map((b) => {
        if (b.id === bedId) {
          dischargedPatientId = b.patientId;
          return {
            ...b,
            status: "Cleaning",
            patientId: null,
            patientName: null,
            admittedSince: null,
          };
        }
        return b;
      })
    );

    if (dischargedPatientId) {
      setPatients((prev) =>
        prev.map((p) =>
          p.id === dischargedPatientId ? { ...p, admissionStatus: "Discharged", bedId: null } : p
        )
      );
    }

    showToast(`Bed ${bedId} freed and scheduled for sanitization`, "info");
    logAction(`Discharged bed ${bedId}`, "Bed Management");
  };

  const setBedStatus = (bedId, status) => {
    setBeds((prev) =>
      prev.map((b) => (b.id === bedId ? { ...b, status } : b))
    );
    showToast(`Bed ${bedId} marked as ${status}`, "info");
    logAction(`Set bed ${bedId} status to ${status}`, "Bed Management");
  };

  const addBed = (bedData) => {
    const wardCode = (bedData.ward || "GEN").replace(/[^a-zA-Z]/g, "").slice(0, 3).toUpperCase() || "BED";
    const generatedId = bedData.id?.trim() || `BED-${wardCode}-${Math.floor(100 + Math.random() * 900)}`;
    const newBed = {
      id: generatedId,
      ward: bedData.ward || "General Ward (Male)",
      room: bedData.room || "Room 101",
      type: bedData.type || "General Bed",
      status: bedData.status || "Available",
      patientId: bedData.patientId || null,
      patientName: bedData.patientName || null,
      admittedSince: bedData.status === "Occupied" ? new Date().toISOString().split("T")[0] : null,
      dailyRate: Math.max(0, Number(bedData.dailyRate || 250)),
      features: bedData.features || ["Standard Care", "Oxygen Point"],
    };
    setBeds((prev) => [newBed, ...prev]);
    showToast(`Added bed ${newBed.id} (${newBed.room}) to ${newBed.ward}!`, "success");
    logAction(`Added bed ${newBed.id} in ${newBed.ward}`, "Bed Management");
    return newBed;
  };

  const deleteBed = (bedId) => {
    setBeds((prev) => prev.filter((b) => b.id !== bedId));
    showToast(`Bed ${bedId} removed from ward registry`, "info");
    logAction(`Removed bed ${bedId}`, "Bed Management");
  };

  const addMedicalRecord = (recordData) => {
    const targetPatient = patients.find((p) => p.id === recordData.patientId) || {
      id: recordData.patientId || `PAT-${Date.now().toString().slice(-4)}`,
      name: recordData.patientName || "Patient",
    };
    const patientName = recordData.patientName?.trim() || targetPatient.name;
    const newRecord = {
      id: `REC-${Date.now().toString().slice(-4)}`,
      date: recordData.date || new Date().toISOString().split("T")[0],
      patientId: targetPatient.id,
      patientName: patientName,
      recordType: recordData.recordType || "Consultation Note",
      title: recordData.title || "Clinical Assessment Note",
      doctor: recordData.doctor || currentUser?.name || "Dr. Sarah Jenkins",
      department: recordData.department || "Cardiovascular Sciences",
      summary: recordData.summary,
      attachments: recordData.attachments || ["Clinical_Report.pdf"],
    };
    setMedicalRecords((prev) => [newRecord, ...prev]);
    showToast(`Medical report for ${newRecord.patientName} created!`, "success");
    logAction(`Added medical report for ${newRecord.patientName}`, "Medical Records");
    return newRecord;
  };

  const deleteMedicalRecord = (recId) => {
    setMedicalRecords((prev) => prev.filter((r) => r.id !== recId));
    showToast(`Medical record #${recId} archived`, "info");
    logAction(`Archived medical record ${recId}`, "Medical Records");
  };


  // Billing Actions
  const createInvoice = (invData) => {
    const newInvoice = {
      id: `INV-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().split("T")[0],
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
      status: "Pending",
      paidAmount: 0,
      paymentMethod: null,
      paymentDate: null,
      ...invData,
    };
    setInvoices((prev) => [newInvoice, ...prev]);
    showToast(`Invoice #${newInvoice.id} generated for $${newInvoice.totalPayable}`, "success");
    logAction(`Generated invoice ${newInvoice.id} for ${newInvoice.patientName}`, "Billing");
    return newInvoice;
  };

  const recordPayment = (invoiceId, amount, method = "Credit Card") => {
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id === invoiceId) {
          const totalPaid = (inv.paidAmount || 0) + Number(amount);
          const isFullyPaid = totalPaid >= inv.totalPayable;
          return {
            ...inv,
            paidAmount: totalPaid,
            status: isFullyPaid ? "Paid" : "Partial",
            paymentMethod: method,
            paymentDate: new Date().toISOString().replace("T", " ").slice(0, 16),
          };
        }
        return inv;
      })
    );
    showToast(`Payment of $${amount} recorded for invoice #${invoiceId}`, "success");
    logAction(`Payment of $${amount} recorded for #${invoiceId}`, "Billing");

    addNotification({
      title: "Payment Received",
      message: `$${amount} paid for Invoice #${invoiceId} via ${method}.`,
      category: "Billing",
      severity: "success",
      link: "/billing",
    });
  };

  // Notification Actions
  const addNotification = (notif) => {
    const newNotif = {
      id: `NOTIF-${Date.now().toString().slice(-3)}`,
      read: false,
      timestamp: "Just now",
      severity: "info",
      ...notif,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markNotificationRead = (notifId) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast("All notifications marked as read", "info");
  };

  const clearNotifications = () => {
    setNotifications([]);
    showToast("Notifications cleared", "info");
  };

  // Security & RBAC Actions
  const togglePermission = (role, moduleKey, permType) => {
    setSecurityMatrix((prev) => ({
      ...prev,
      [role]: {
        ...prev[role],
        [moduleKey]: {
          ...prev[role]?.[moduleKey],
          [permType]: !prev[role]?.[moduleKey]?.[permType],
        },
      },
    }));
    showToast(`Permission updated for ${role.toUpperCase()} on ${moduleKey}`, "info");
    logAction(`Toggled ${permType} permission for ${role} on ${moduleKey}`, "Security");
  };

  // Global AI Health Assistant Drawer
  const toggleAiDrawer = () => setIsAiDrawerOpen((prev) => !prev);

  // Unread notifications count
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <HospitalContext.Provider
      value={{
        // Auth & Personas
        currentUser,
        currentRole,
        switchRole,
        setCurrentUser,
        authenticateUser,

        // Data collections
        users,
        addUser,
        updateUserStatus,
        doctors,
        toggleDoctorAvailability,
        addDoctor,
        patients,
        addPatient,
        updatePatient,
        appointments,
        bookAppointment,
        updateAppointmentStatus,
        cancelAppointment,
        consultations,
        recordConsultation,
        medicalRecords,
        addMedicalRecord,
        deleteMedicalRecord,
        pharmacy,
        restockMedicine,
        dispenseMedicine,
        addMedicine,
        deleteMedicine,
        labTests,
        orderLabTest,
        updateLabResults,
        approveLabTest,
        beds,
        allocateBed,
        dischargeBed,
        setBedStatus,
        addBed,
        deleteBed,
        invoices,
        createInvoice,
        recordPayment,
        notifications,
        addNotification,
        markNotificationRead,
        markAllNotificationsRead,
        clearNotifications,
        unreadCount,
        securityMatrix,
        togglePermission,
        auditLogs,
        logAction,

        // UI Helpers
        searchQuery,
        setSearchQuery,
        isAiDrawerOpen,
        setIsAiDrawerOpen,
        toggleAiDrawer,
        showToast,
        toastMessage,
      }}
    >
      {children}
    </HospitalContext.Provider>
  );
};

export const useHospital = () => {
  const context = useContext(HospitalContext);
  if (!context) {
    throw new Error("useHospital must be used within a HospitalProvider");
  }
  return context;
};
