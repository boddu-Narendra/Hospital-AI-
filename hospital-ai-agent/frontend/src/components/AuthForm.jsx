import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Shield,
  Stethoscope,
  HeartPulse,
  UserCheck,
  User,
  Heart,
  Lock,
  ArrowRight,
  KeyRound,
  X,
  CheckCircle2,
  ArrowLeft,
  UserPlus,
} from "lucide-react";
import { saveDemoSession } from "../supabaseClient";
import { useHospital } from "../context/HospitalContext";

export default function AuthForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    switchRole,
    addDoctor,
    addPatient,
    authenticateUser,
    doctors,
    users,
    patients,
  } = useHospital();

  const initialRole = location.state?.role || "patient";
  const initialIsLogin = location.state?.register ? false : true;

  const [activeRole, setActiveRole] = useState(initialRole);
  const [isLogin, setIsLogin] = useState(initialIsLogin);

  // Sync activeRole if navigated with a new role in state
  useEffect(() => {
    if (location.state?.role) {
      setActiveRole(location.state.role);
    }
  }, [location.state?.role]);

  // Common credentials
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  // Patient Registration fields
  const [patientData, setPatientData] = useState({
    name: "",
    age: "30",
    gender: "Female",
    bloodGroup: "O+",
    phone: "",
    email: "",
    address: "",
    emergencyContact: "",
    allergies: "None",
    chronicConditions: "None",
    primaryDoctorId: location.state?.doctorId || (doctors[0]?.id || ""),
  });

  // Doctor Registration fields
  const [doctorData, setDoctorData] = useState({
    name: "",
    email: "",
    password: "doctor123",
    specialty: "Cardiology",
    department: "Cardiovascular Sciences",
    fee: 150,
    room: "OPD-305",
    phone: "",
    schedule: "Mon - Fri, 09:00 AM - 04:00 PM",
  });

  // General Staff Registration fields (Nurse, Receptionist, Admin)
  const [staffData, setStaffData] = useState({
    name: "",
    email: "",
    password: "staffpassword",
    department: "Administration",
    phone: "",
  });

  // Feedback & Modal state
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);

  // Default pre-fills for demo quick logins
  const handleSelectRoleTab = (role) => {
    setActiveRole(role);
    setMessage("");
    if (role === "admin") {
      setIdentifier("admin@hospital.com");
      setPassword("admin123");
    } else if (role === "doctor") {
      setIdentifier(doctors[0]?.email || "s.jenkins@hospital.com");
      setPassword("doctor123");
    } else if (role === "nurse") {
      setIdentifier("e.rostova@hospital.com");
      setPassword("nurse123");
    } else if (role === "receptionist") {
      setIdentifier("reception@hospital.com");
      setPassword("reception123");
    } else {
      setIdentifier("APT-8821");
      setPassword("");
    }
  };

  // 1-Click Persona Demo Login
  const handleQuickRoleLogin = (role) => {
    handleSelectRoleTab(role);
    switchRole(role);
    const userToLogin = users.find((u) => u.role === role) || {
      id: `usr-${role}`,
      name: `${role.toUpperCase()} User`,
      email: `${role}@hospital.com`,
      role,
    };
    saveDemoSession({
      access_token: `demo-${role}-${Date.now()}`,
      user: userToLogin,
    });
    setMessageType("success");
    setMessage(`Logged in as ${role.toUpperCase()}! Redirecting...`);
    setTimeout(() => navigate("/dashboard"), 400);
  };

  // Handle Login
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    const authResult = authenticateUser({
      role: activeRole,
      identifier: identifier || (activeRole === "patient" ? "APT-8821" : "admin@hospital.com"),
      password,
    });

    if (authResult.success) {
      saveDemoSession({
        access_token: `session-${authResult.user.id}-${Date.now()}`,
        user: authResult.user,
      });
      setMessageType("success");
      setMessage(`Login successful! Redirecting to ${activeRole.toUpperCase()} workspace...`);
      setTimeout(() => navigate("/dashboard"), 600);
    } else {
      setMessageType("error");
      setMessage(authResult.error || "Authentication failed. Please check credentials.");
      setIsLoading(false);
    }
  };

  // Handle Registration
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    try {
      if (activeRole === "patient") {
        if (!patientData.name.trim()) throw new Error("Full patient name is required.");
        if (!patientData.phone.trim()) throw new Error("Phone number is required.");

        const newPat = addPatient(patientData);
        saveDemoSession({
          access_token: `session-${newPat.id}`,
          user: {
            id: newPat.id,
            name: newPat.name,
            email: newPat.email,
            role: "patient",
            appointment_id: newPat.appointmentId,
          },
        });
        setMessageType("success");
        setMessage(`Registration successful! Your Passcode is ${newPat.appointmentId}. Redirecting...`);
        setTimeout(() => navigate("/dashboard"), 800);
        return;
      }

      if (activeRole === "doctor") {
        if (!doctorData.name.trim()) throw new Error("Doctor name is required.");
        if (!doctorData.email.trim()) throw new Error("Doctor email is required.");

        const newDoc = addDoctor(doctorData);
        saveDemoSession({
          access_token: `session-${newDoc.id}`,
          user: newDoc,
        });
        setMessageType("success");
        setMessage(`Doctor profile created for ${newDoc.name}! Redirecting...`);
        setTimeout(() => navigate("/dashboard"), 800);
        return;
      }

      // Staff (Admin, Nurse, Receptionist)
      if (!staffData.name.trim()) throw new Error("Full name is required.");
      if (!staffData.email.trim()) throw new Error("Email address is required.");

      const newStaff = {
        id: `usr-${activeRole}-${Date.now().toString().slice(-4)}`,
        name: staffData.name,
        email: staffData.email,
        role: activeRole,
        department: staffData.department || "Hospital Administration",
        phone: staffData.phone,
        status: "active",
        joinedDate: new Date().toISOString().split("T")[0],
      };

      saveDemoSession({
        access_token: `session-${newStaff.id}`,
        user: newStaff,
      });
      switchRole(activeRole);
      setMessageType("success");
      setMessage(`Staff account created for ${newStaff.name}! Redirecting...`);
      setTimeout(() => navigate("/dashboard"), 800);
    } catch (err) {
      setMessageType("error");
      setMessage(err.message || "Failed to complete registration.");
      setIsLoading(false);
    }
  };

  const handleForgotPasswordSubmit = (e) => {
    e.preventDefault();
    setForgotSent(true);
    setTimeout(() => {
      setIsForgotModalOpen(false);
      setForgotSent(false);
      setForgotEmail("");
      setMessage("A password recovery link has been dispatched to your email address.");
      setMessageType("success");
    }, 1200);
  };

  const roles = [
    { key: "patient", label: "Patient", icon: User },
    { key: "doctor", label: "Doctor", icon: Stethoscope },
    { key: "nurse", label: "Nurse", icon: HeartPulse },
    { key: "receptionist", label: "Reception", icon: UserCheck },
    { key: "admin", label: "Admin", icon: Shield },
  ];

  return (
    <div className="mx-auto flex h-full min-h-[620px] w-full max-w-5xl items-center justify-center p-2 sm:p-4">
      <div className="grid w-full overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-2xl shadow-slate-300/40 md:grid-cols-12">
        {/* Left Visual Brand Column (5 Cols) */}
        <div
          className="relative hidden md:col-span-5 md:flex md:flex-col md:justify-between p-8 text-white"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/85 via-indigo-900/80 to-slate-900/85" />
          <div className="relative z-10">
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-200 hover:text-white transition mb-6"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Hospital Home
            </button>

            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-blue-700 font-bold">
                <Heart className="h-5 w-5 fill-blue-600 text-blue-600" />
              </div>
              <span className="text-xl font-extrabold tracking-tight">AuraCare OS</span>
            </div>
            <p className="mt-2 text-xs text-blue-200 leading-relaxed">
              Unified Clinical Portal for Patients, Physicians, Nurses, Front Desk & Administration.
            </p>
          </div>

          <div className="relative z-10 space-y-3">
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-md border border-white/15">
              <p className="text-xs font-bold text-blue-100">1-Click Quick Demo Sign In:</p>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {roles.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => handleQuickRoleLogin(item.key)}
                    className="rounded-lg bg-white/20 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-white hover:text-blue-900 transition active:scale-95"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-[11px] text-blue-200">
              HIPAA compliant data architecture with role-based access control and AI clinical triage.
            </p>
          </div>
        </div>

        {/* Right Form Column (7 Cols) */}
        <div className="flex flex-col justify-center p-6 sm:p-8 md:col-span-7">
          <div className="mb-4 flex items-center justify-between">
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 md:hidden"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Home
            </button>
            <div className="ml-auto text-xs">
              <span className="text-slate-500">
                {isLogin ? "Need a new account? " : "Already have an account? "}
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setMessage("");
                }}
                className="font-bold text-blue-600 hover:text-blue-700"
              >
                {isLogin ? "Register here" : "Sign In"}
              </button>
            </div>
          </div>

          {/* 5-Role Tabs */}
          <div className="mb-6">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Select Your Role:
            </label>
            <div className="flex flex-wrap gap-1.5 rounded-2xl bg-slate-100 p-1.5">
              {roles.map((r) => {
                const Icon = r.icon;
                const isSelected = activeRole === r.key;
                return (
                  <button
                    key={r.key}
                    type="button"
                    onClick={() => handleSelectRoleTab(r.key)}
                    className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 px-2 text-xs font-bold transition ${
                      isSelected
                        ? "bg-white text-blue-700 shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{r.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Header */}
          <div className="mb-4">
            <h2 className="text-xl font-extrabold text-slate-900 capitalize">
              {isLogin ? `${activeRole} Portal Sign In` : `Register New ${activeRole}`}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {activeRole === "patient"
                ? "Enter your appointment passcode or phone number to view medical records and appointments."
                : `Enter your credentials to access the ${activeRole} clinical and operational workspace.`}
            </p>
          </div>

          {/* FORM: LOGIN MODE */}
          {isLogin ? (
            <form onSubmit={handleLoginSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700">
                  {activeRole === "patient"
                    ? "Appointment ID / Passcode or Email"
                    : `${activeRole.toUpperCase()} Official Email`}
                </label>
                <input
                  type="text"
                  required
                  placeholder={
                    activeRole === "patient"
                      ? "e.g. APT-8821 or emma.watson@hospital.com"
                      : `${activeRole}@hospital.com`
                  }
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="input-field mt-1 text-sm font-semibold"
                />
                {activeRole === "patient" && (
                  <p className="text-[11px] text-slate-400 mt-1">
                    Demo passcode: <strong className="font-mono text-blue-600">APT-8821</strong> (or any newly registered patient ID).
                  </p>
                )}
              </div>

              {activeRole !== "patient" && (
                <div>
                  <label className="font-semibold text-slate-700">Account Password</label>
                  <input
                    type="password"
                    required
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field mt-1 text-sm"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full py-2.5 text-sm font-bold shadow-sm mt-2"
              >
                {isLoading ? "Authenticating..." : `Sign In as ${activeRole.toUpperCase()}`}
              </button>
            </form>
          ) : (
            /* FORM: REGISTRATION MODE */
            <form onSubmit={handleRegisterSubmit} className="space-y-3 text-xs">
              {/* Patient Registration Fields */}
              {activeRole === "patient" && (
                <>
                  <div>
                    <label className="font-semibold text-slate-700">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={patientData.name}
                      onChange={(e) => setPatientData({ ...patientData, name: e.target.value })}
                      className="input-field mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="font-semibold text-slate-700">Age</label>
                      <input
                        type="number"
                        required
                        value={patientData.age}
                        onChange={(e) => setPatientData({ ...patientData, age: e.target.value })}
                        className="input-field mt-1"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">Gender</label>
                      <select
                        value={patientData.gender}
                        onChange={(e) => setPatientData({ ...patientData, gender: e.target.value })}
                        className="input-field mt-1"
                      >
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">Blood</label>
                      <select
                        value={patientData.bloodGroup}
                        onChange={(e) => setPatientData({ ...patientData, bloodGroup: e.target.value })}
                        className="input-field mt-1"
                      >
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                        <option value="AB+">AB+</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-semibold text-slate-700">Phone</label>
                      <input
                        type="tel"
                        required
                        placeholder="10 digit number"
                        value={patientData.phone}
                        onChange={(e) => setPatientData({ ...patientData, phone: e.target.value })}
                        className="input-field mt-1"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">Email</label>
                      <input
                        type="email"
                        placeholder="patient@example.com"
                        value={patientData.email}
                        onChange={(e) => setPatientData({ ...patientData, email: e.target.value })}
                        className="input-field mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700">Preferred Physician</label>
                    <select
                      value={patientData.primaryDoctorId}
                      onChange={(e) => setPatientData({ ...patientData, primaryDoctorId: e.target.value })}
                      className="input-field mt-1"
                    >
                      {doctors.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name} ({d.specialty})
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              {/* Doctor Registration Fields */}
              {activeRole === "doctor" && (
                <>
                  <div>
                    <label className="font-semibold text-slate-700">Doctor Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Meredith Grey"
                      value={doctorData.name}
                      onChange={(e) => setDoctorData({ ...doctorData, name: e.target.value })}
                      className="input-field mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-semibold text-slate-700">Specialty</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Cardiology, Neurology"
                        value={doctorData.specialty}
                        onChange={(e) => setDoctorData({ ...doctorData, specialty: e.target.value })}
                        className="input-field mt-1"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">Department</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Cardiovascular Sciences"
                        value={doctorData.department}
                        onChange={(e) => setDoctorData({ ...doctorData, department: e.target.value })}
                        className="input-field mt-1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-semibold text-slate-700">Email Address</label>
                      <input
                        type="email"
                        required
                        placeholder="doctor@hospital.com"
                        value={doctorData.email}
                        onChange={(e) => setDoctorData({ ...doctorData, email: e.target.value })}
                        className="input-field mt-1"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">Consultation Fee ($)</label>
                      <input
                        type="number"
                        value={doctorData.fee}
                        onChange={(e) => setDoctorData({ ...doctorData, fee: Number(e.target.value) })}
                        className="input-field mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700">Account Password</label>
                    <input
                      type="password"
                      required
                      value={doctorData.password}
                      onChange={(e) => setDoctorData({ ...doctorData, password: e.target.value })}
                      className="input-field mt-1"
                    />
                  </div>
                </>
              )}

              {/* Other Staff Registration Fields */}
              {activeRole !== "patient" && activeRole !== "doctor" && (
                <>
                  <div>
                    <label className="font-semibold text-slate-700">Staff Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Full Name"
                      value={staffData.name}
                      onChange={(e) => setStaffData({ ...staffData, name: e.target.value })}
                      className="input-field mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-semibold text-slate-700">Official Email</label>
                      <input
                        type="email"
                        required
                        placeholder="staff@hospital.com"
                        value={staffData.email}
                        onChange={(e) => setStaffData({ ...staffData, email: e.target.value })}
                        className="input-field mt-1"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700">Password</label>
                      <input
                        type="password"
                        required
                        value={staffData.password}
                        onChange={(e) => setStaffData({ ...staffData, password: e.target.value })}
                        className="input-field mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700">Department</label>
                    <input
                      type="text"
                      placeholder="e.g. ICU, Admissions, Front Desk"
                      value={staffData.department}
                      onChange={(e) => setStaffData({ ...staffData, department: e.target.value })}
                      className="input-field mt-1"
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full py-2.5 text-sm font-bold shadow-sm mt-2"
              >
                {isLoading ? "Creating Account..." : `Complete ${activeRole.toUpperCase()} Registration`}
              </button>
            </form>
          )}

          {/* Forgot Passcode / Password Link */}
          {isLogin && (
            <div className="mt-4 flex justify-end text-xs">
              <button
                type="button"
                onClick={() => setIsForgotModalOpen(true)}
                className="text-slate-500 hover:text-slate-800"
              >
                Forgot {activeRole === "patient" ? "Appointment ID" : "Password"}?
              </button>
            </div>
          )}

          {/* Status Message */}
          {message && (
            <div
              className={`mt-4 rounded-xl p-3 text-xs font-semibold border ${
                messageType === "success"
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                  : "bg-rose-50 text-rose-800 border-rose-200"
              }`}
            >
              {message}
            </div>
          )}
        </div>
      </div>

      {/* Forgot Password Modal */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Reset Credentials</h3>
              <button
                onClick={() => setIsForgotModalOpen(false)}
                className="rounded-xl p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleForgotPasswordSubmit} className="mt-4 space-y-3 text-xs">
              <p className="text-slate-600">
                Enter your registered email address or appointment passcode to receive a secure recovery code.
              </p>

              <div>
                <label className="font-semibold text-slate-700">Email or ID</label>
                <input
                  type="text"
                  required
                  placeholder="user@hospital.com or APT-8821"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="input-field mt-1"
                />
              </div>

              {forgotSent && (
                <div className="flex items-center gap-2 text-emerald-600 font-semibold mt-2">
                  <CheckCircle2 className="h-4 w-4" /> Reset link sent! Redirecting...
                </div>
              )}

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Send Recovery Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
