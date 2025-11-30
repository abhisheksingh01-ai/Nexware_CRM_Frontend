// src/components/adminDashboard/ProfileSettings.jsx
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const PRIMARY = "#176BFF";
const TEXT = "#1A1A1A";
const MUTED = "#6A6A6A";
const PAGE_BG = "#F5F6FA";
const CARD_BG = "#FFFFFF";
const BORDER = "#E6E8EE";

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function ProfileSettings({ fetchProfile, saveProfile }) {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [originalProfile, setOriginalProfile] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileRef = useRef(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        if (fetchProfile) {
          const p = await fetchProfile();
          if (!mounted) return;
          setProfile(p);
          setOriginalProfile(p);
          setAvatarPreview(p?.avatarUrl ?? null);
        } else {
          // mock profile
          await new Promise((r) => setTimeout(r, 200));
          const mock = {
            id: "admin-1",
            name: "Admin User",
            email: "admin@company.com",
            phone: "9876543210",
            role: "admin",
            avatarUrl: null,
          };
          if (!mounted) return;
          setProfile(mock);
          setOriginalProfile(mock);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => (mounted = false);
  }, [fetchProfile]);

  useEffect(() => {
    // create preview url when avatarFile changes
    if (!avatarFile) return;
    const url = URL.createObjectURL(avatarFile);
    setAvatarPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [avatarFile]);

  function handleChange(field, value) {
    setProfile((p) => ({ ...p, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
    setMessage("");
  }

  function handleFile(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    // basic validation: image only, max 3MB
    if (!f.type.startsWith("image/")) {
      setErrors((ex) => ({ ...ex, avatar: "Please upload an image file." }));
      return;
    }
    if (f.size > 3 * 1024 * 1024) {
      setErrors((ex) => ({ ...ex, avatar: "Max file size 3MB." }));
      return;
    }
    setAvatarFile(f);
    setErrors((ex) => ({ ...ex, avatar: undefined }));
  }

  function runValidation({ allowEmptyPassword = true } = {}) {
    const e = {};
    if (!profile?.name || String(profile.name).trim().length < 2) e.name = "Enter a valid name.";
    if (!profile?.email) e.email = "Email is required.";
    else if (!validateEmail(profile.email)) e.email = "Enter a valid email.";
    if (!allowEmptyPassword && (!profile.password || profile.password.length < 8))
      e.password = "Password must be at least 8 characters.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSave(e) {
    e.preventDefault();
    setMessage("");
    // we allow keeping password empty (no change) — require min 8 only if provided
    const valid = runValidation({ allowEmptyPassword: true });
    if (!valid) return;
    setSaving(true);
    try {
      const payload = {
        id: profile.id,
        name: String(profile.name).trim(),
        email: String(profile.email).trim().toLowerCase(),
        phone: profile.phone ? String(profile.phone).trim() : "",
        password: profile.password ? profile.password : undefined, // optional
        avatarFile, // may be null
      };

      if (saveProfile) {
        await saveProfile(payload);
      } else {
        // mock save delay
        await new Promise((r) => setTimeout(r, 700));
        // pretend upload returned URL if avatarFile present
        if (avatarFile) {
          const fakeUrl = avatarPreview; // in real app use uploaded URL
          setProfile((p) => ({ ...p, avatarUrl: fakeUrl }));
        }
      }

      setMessage("Profile saved successfully.");
      // clear password field after save
      setProfile((p) => ({ ...p, password: "" }));
      setOriginalProfile((p) => ({ ...profile, password: "" }));
      setAvatarFile(null);
    } catch (err) {
      console.error(err);
      setMessage("Failed to save profile. Try again.");
    } finally {
      setSaving(false);
    }
  }

  function hasUnsavedChanges() {
    if (!originalProfile || !profile) return false;
    // compare simple fields
    if (String(originalProfile.name || "") !== String(profile.name || "")) return true;
    if (String((originalProfile.email || "").toLowerCase()) !== String((profile.email || "").toLowerCase())) return true;
    if (String(originalProfile.phone || "") !== String(profile.phone || "")) return true;
    if (!!avatarFile) return true;
    if (profile.password && profile.password.length > 0) return true;
    return false;
  }

  function handleClose() {
    if (hasUnsavedChanges()) {
      const ok = window.confirm("You have unsaved changes — discard and go back?");
      if (!ok) return;
    }
    // navigate back - change route if you want a fixed landing like "/admin"
    navigate(-1);
  }

  if (loading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: PAGE_BG }}>
        <div className="rounded-lg p-6 shadow" style={{ background: CARD_BG }}>
          <div className="animate-pulse space-y-2">
            <div className="h-6 w-48 bg-[#e6e8ee] rounded" />
            <div className="h-4 w-64 bg-[#e6e8ee] rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6" style={{ background: PAGE_BG }}>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold mb-1" style={{ color: TEXT }}>
              Profile Settings
            </h2>
            <p className="text-sm" style={{ color: MUTED }}>
              Update your profile information and change password.
            </p>
          </div>

          {/* Close / Back button */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleClose}
              className="px-3 py-2 rounded text-sm border"
              style={{ borderColor: BORDER, color: MUTED }}
            >
              Back
            </button>
            <button
              onClick={() => {
                // reset to original & clear file
                setProfile(originalProfile);
                setAvatarFile(null);
                setAvatarPreview(originalProfile?.avatarUrl ?? null);
                setErrors({});
                setMessage("");
              }}
              className="px-3 py-2 rounded text-sm"
              style={{ border: `1px solid ${BORDER}`, background: "#fff", color: MUTED }}
            >
              Reset
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6" style={{ border: `1px solid ${BORDER}` }}>
          {message && (
            <div className="mb-4 px-3 py-2 rounded text-sm" style={{ background: "#E8F0FF", color: PRIMARY }}>
              {message}
            </div>
          )}

          <form onSubmit={handleSave} className="grid grid-cols-1 gap-4">
            {/* Avatar + upload */}
            <div className="flex items-start gap-4">
              <div>
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center overflow-hidden border"
                  style={{ borderColor: BORDER, background: "#fff" }}
                >
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-lg font-semibold" style={{ color: PRIMARY }}>
                      {String(profile.name || "A").charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                <div className="mt-2 flex items-center gap-2">
                  <label
                    htmlFor="avatar"
                    className="px-3 py-1 rounded text-sm cursor-pointer"
                    style={{ background: "#E8F0FF", color: PRIMARY }}
                  >
                    Upload
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setAvatarFile(null);
                      setAvatarPreview(originalProfile?.avatarUrl ?? null);
                      fileRef.current && (fileRef.current.value = "");
                    }}
                    className="px-3 py-1 rounded text-sm border"
                    style={{ borderColor: BORDER, color: MUTED }}
                  >
                    Remove
                  </button>
                </div>

                <input ref={fileRef} id="avatar" name="avatar" type="file" accept="image/*" onChange={handleFile} className="hidden" />
                {errors.avatar && <div className="text-xs mt-1" style={{ color: "#E44141" }}>{errors.avatar}</div>}
              </div>

              {/* Form fields */}
              <div className="flex-1 grid grid-cols-1 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: TEXT }}>Full name</label>
                  <input
                    value={profile.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className="w-full rounded-md border px-3 py-2"
                    style={{ borderColor: BORDER }}
                    aria-invalid={!!errors.name}
                  />
                  {errors.name && <div className="text-xs mt-1" style={{ color: "#E44141" }}>{errors.name}</div>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: TEXT }}>Email</label>
                  <input
                    value={profile.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="w-full rounded-md border px-3 py-2"
                    style={{ borderColor: BORDER }}
                    type="email"
                    aria-invalid={!!errors.email}
                  />
                  {errors.email && <div className="text-xs mt-1" style={{ color: "#E44141" }}>{errors.email}</div>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: TEXT }}>Phone</label>
                  <input
                    value={profile.phone || ""}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className="w-full rounded-md border px-3 py-2"
                    style={{ borderColor: BORDER }}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: TEXT }}>Role</label>
                  <input value={profile.role} readOnly className="w-full rounded-md border px-3 py-2 bg-[#f8fafc]" style={{ borderColor: BORDER, color: MUTED }} />
                </div>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: TEXT }}>Change password (leave blank to keep current)</label>
              <input
                value={profile.password || ""}
                onChange={(e) => handleChange("password", e.target.value)}
                className="w-full rounded-md border px-3 py-2"
                style={{ borderColor: BORDER }}
                type="password"
                placeholder="At least 8 characters"
                aria-invalid={!!errors.password}
              />
              {errors.password && <div className="text-xs mt-1" style={{ color: "#E44141" }}>{errors.password}</div>}
            </div>

            {/* Actions (save) */}
            <div className="flex items-center justify-end gap-3 mt-2">
              <button
                type="button"
                onClick={() => {
                  // revert to original loaded profile
                  setAvatarFile(null);
                  setAvatarPreview(originalProfile?.avatarUrl ?? null);
                  setProfile((p) => ({ ...originalProfile, password: "" }));
                  setErrors({});
                  setMessage("");
                }}
                className="px-4 py-2 rounded"
                style={{ border: `1px solid ${BORDER}`, background: "#fff", color: MUTED }}
                disabled={saving}
              >
                Reset
              </button>

              <button
                type="submit"
                onClick={handleSave}
                className="px-4 py-2 rounded text-white"
                style={{ background: PRIMARY, opacity: saving ? 0.7 : 1 }}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
