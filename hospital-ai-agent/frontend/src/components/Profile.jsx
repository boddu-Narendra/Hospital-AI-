import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase, isDemoMode, getDemoSession, saveDemoUsers, getDemoUsers, clearDemoSession } from "../supabaseClient";
import { API_ENDPOINTS } from "../apiConfig";

const PROFILE_API_URL = API_ENDPOINTS.profile;
const HISTORY_API_URL = API_ENDPOINTS.history;

function Profile() {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const location = useLocation();

  const [profile, setProfile] = useState(
    location.state?.profile || JSON.parse(localStorage.getItem("profile") || "null")
  );
  const [history, setHistory] = useState([]);
  const [authReady, setAuthReady] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});

  const loadProfile = async (accessToken) => {
    try {
      const res = await fetch(PROFILE_API_URL, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) throw new Error("Could not load profile");
      const data = await res.json();
      setProfile(data);
      setEditedProfile(data);
      localStorage.setItem("profile", JSON.stringify(data));
    } catch (error) {
      console.error(error);
    }
  };

  const loadHistory = async (accessToken) => {
    try {
      const res = await fetch(HISTORY_API_URL, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) throw new Error("Could not load history");
      const data = await res.json();
      setHistory(data.slice(-5)); // Last 5 interactions
    } catch (error) {
      console.error(error);
    }
  };

  const saveProfile = async () => {
    if (!session?.user?.id) return;
    try {
      if (isDemoMode) {
        const nextProfile = { ...profile, ...editedProfile };
        setProfile(nextProfile);
        setEditedProfile(nextProfile);
        localStorage.setItem("profile", JSON.stringify(nextProfile));

        const users = getDemoUsers();
        const index = users.findIndex((entry) => entry.id === session.user.id);
        if (index >= 0) {
          users[index].profile = nextProfile;
          users[index].appointment_id = nextProfile.appointment_id || users[index].appointment_id;
          saveDemoUsers(users);
        }

        setIsEditing(false);
        alert("Profile updated successfully!");
        return;
      }

      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: session.user.id,
          full_name: editedProfile.full_name,
          age: editedProfile.age,
          gender: editedProfile.gender,
          phone: editedProfile.phone,
          address: editedProfile.address,
        });
      if (error) throw error;
      setProfile(editedProfile);
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to update profile.");
    }
  };

  useEffect(() => {
    const init = async () => {
      if (isDemoMode) {
        const currentSession = getDemoSession();
        if (!currentSession) {
          navigate("/");
          return;
        }

        setSession(currentSession);
        const savedProfile = JSON.parse(localStorage.getItem("profile") || "null");
        setProfile(savedProfile || {});
        setEditedProfile(savedProfile || {});
        setAuthReady(true);
        return;
      }

      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession();

      if (!currentSession) {
        navigate("/");
        return;
      }

      setSession(currentSession);
      setAuthReady(true);
      if (currentSession?.access_token) {
        loadProfile(currentSession.access_token);
        loadHistory(currentSession.access_token);
      }
    };
    init();

    if (isDemoMode) return;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
      if (currentSession?.access_token) {
        loadProfile(currentSession.access_token);
        loadHistory(currentSession.access_token);
      } else {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (!authReady) {
    return (
      <main className="flex h-screen overflow-hidden items-center justify-center bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 p-6">
        <div className="card px-6 py-4 text-sm font-medium text-slate-700">Loading profile...</div>
      </main>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="card overflow-hidden">
        <div className="flex flex-col">
          <header className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50">
            <div>
              <h1 className="text-lg font-bold text-slate-800">Patient Profile</h1>
              <p className="text-xs text-slate-500">Demographic details and personal health record history</p>
            </div>
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <button
                    onClick={saveProfile}
                    className="btn-primary text-xs"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditedProfile(profile);
                    }}
                    className="btn-secondary text-xs"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn-primary text-xs"
                >
                  Edit Profile
                </button>
              )}
              <button
                onClick={() => navigate("/dashboard")}
                className="btn-secondary text-xs"
              >
                Dashboard
              </button>
            </div>
          </header>
          <div className="flex-1 overflow-y-auto p-3">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h2 className="mb-3 text-base font-medium text-slate-800">Personal Details</h2>
                <div className="space-y-2">
                  <div>
                    <label className="text-sm font-medium text-slate-600">Appointment ID</label>
                    <p className="text-sm text-slate-800">{profile?.appointment_id || "N/A"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Full Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedProfile.full_name || ""}
                        onChange={(e) => setEditedProfile({ ...editedProfile, full_name: e.target.value })}
                        className="input-field"
                      />
                    ) : (
                      <p className="text-sm text-slate-800">{profile?.full_name || "N/A"}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Age</label>
                    {isEditing ? (
                      <input
                        type="number"
                        value={editedProfile.age || ""}
                        onChange={(e) => setEditedProfile({ ...editedProfile, age: e.target.value ? Number(e.target.value) : null })}
                        className="input-field"
                      />
                    ) : (
                      <p className="text-sm text-slate-800">{profile?.age ?? "N/A"}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Gender</label>
                    {isEditing ? (
                      <select
                        value={editedProfile.gender || ""}
                        onChange={(e) => setEditedProfile({ ...editedProfile, gender: e.target.value })}
                        className="input-field"
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    ) : (
                      <p className="text-sm text-slate-800">{profile?.gender || "N/A"}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Phone</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editedProfile.phone || ""}
                        onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value.replace(/[^0-9]/g, '').slice(0, 10) })}
                        maxLength="10"
                        className="input-field"
                      />
                    ) : (
                      <p className="text-sm text-slate-800">{profile?.phone || "N/A"}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">Address</label>
                    {isEditing ? (
                      <textarea
                        value={editedProfile.address || ""}
                        onChange={(e) => setEditedProfile({ ...editedProfile, address: e.target.value })}
                        rows="1.5"
                        className="input-field resize-none"
                      />
                    ) : (
                      <p className="text-sm text-slate-800">{profile?.address || "N/A"}</p>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <h2 className="mb-3 text-base font-medium text-slate-800">Recent Health Interactions</h2>
                <div className="space-y-2">
                  {history.length > 0 ? (
                    history.map((item, index) => (
                      <div key={index} className="rounded-lg border border-slate-200 p-3">
                        <p className="text-xs text-slate-600">{new Date(item.created_at).toLocaleDateString()}</p>
                        <p className="text-sm text-slate-800"><strong>You:</strong> {item.user_message}</p>
                        <p className="text-sm text-slate-800"><strong>AI:</strong> {item.ai_response}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-600">No recent interactions.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;