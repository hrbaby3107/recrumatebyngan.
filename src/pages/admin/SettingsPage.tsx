import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  User,
  Bell,
  Palette,
  GitBranch,
  Tags,
  Mail,
  Users,
  Shield,
  Check,
  Moon,
  Sun,
  Save,
  X,
  Loader2,
  RotateCcw,
} from "lucide-react";
import { useApp } from "../../store/AppContext";
import { ACCENTS, type Density } from "../../lib/theme";
import { initialOf, type RecruiterProfile } from "../../lib/profile";
import { fileToAvatarDataUrl } from "../../lib/image";
import { PipelineSection, TagsSection, TemplatesSection, WorkspaceSection, PrivacySection } from "./SettingsSections";

type Section =
  | "profile"
  | "notifications"
  | "appearance"
  | "pipeline"
  | "tags"
  | "templates"
  | "workspace"
  | "privacy";

const sectionGroups: { group: string; items: { id: Section; label: string; icon: typeof User }[] }[] = [
  {
    group: "Account",
    items: [
      { id: "profile", label: "Profile", icon: User },
      { id: "notifications", label: "Notifications", icon: Bell },
      { id: "appearance", label: "Appearance", icon: Palette },
    ],
  },
  {
    group: "Recruitment",
    items: [
      { id: "pipeline", label: "Pipeline", icon: GitBranch },
      { id: "tags", label: "Tags & Sources", icon: Tags },
      { id: "templates", label: "Message Templates", icon: Mail },
    ],
  },
  {
    group: "Workspace",
    items: [{ id: "workspace", label: "Team & Roles", icon: Users }],
  },
  {
    group: "Data & Privacy",
    items: [{ id: "privacy", label: "CV Storage & Data", icon: Shield }],
  },
];

export default function SettingsPage() {
  const { pushToast } = useApp();
  const [section, setSection] = useState<Section>("profile");

  return (
    <div className="flex h-full flex-col lg:flex-row">
      {/* Settings sidebar */}
      <aside className="w-full shrink-0 border-b border-slate-200 bg-white p-4 lg:w-64 lg:border-b-0 lg:border-r dark:border-slate-800 dark:bg-slate-900">
        <h1 className="mb-4 flex items-center gap-2 px-2 text-lg font-bold text-slate-900 dark:text-white">
          <Settings className="h-5 w-5 text-brand-500" />
          Settings
        </h1>
        <nav className="space-y-4">
          {sectionGroups.map((g) => (
            <div key={g.group}>
              <p className="px-2 pb-1 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                {g.group}
              </p>
              {g.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSection(item.id)}
                  className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
                    section === item.id
                      ? "bg-brand-600 text-white"
                      : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </button>
              ))}
            </div>
          ))}
        </nav>
      </aside>

      {/* Settings content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-3xl">
          {section === "profile" && <ProfileSection />}
          {section === "notifications" && <NotificationsSection />}
          {section === "appearance" && <AppearanceSection />}
          {section === "pipeline" && <PipelineSection pushToast={pushToast} />}
          {section === "tags" && <TagsSection pushToast={pushToast} />}
          {section === "templates" && <TemplatesSection pushToast={pushToast} />}
          {section === "workspace" && <WorkspaceSection />}
          {section === "privacy" && <PrivacySection pushToast={pushToast} />}
        </div>
      </div>
    </div>
  );
}

/* ============ Shared UI ============ */

function Card({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900">
      <h2 className="text-base font-semibold text-slate-900 dark:text-white">{title}</h2>
      {desc && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{desc}</p>}
      <div className="mt-4">{children}</div>
    </div>
  );
}

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`relative h-6 w-11 shrink-0 rounded-full transition ${on ? "bg-brand-600" : "bg-slate-300 dark:bg-slate-700"}`}
    >
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${on ? "left-[22px]" : "left-0.5"}`} />
    </button>
  );
}

function Input({ label, value, onChange, placeholder, type = "text", error }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  error?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`form-input ${error ? "!border-red-400" : ""}`}
        placeholder={placeholder}
      />
      {error && <span className="mt-1 block text-xs font-medium text-red-600 dark:text-red-400">{error}</span>}
    </label>
  );
}

function SaveButton({ onSave, submit = false }: { onSave: () => void; submit?: boolean }) {
  return (
    <button
      type={submit ? "submit" : "button"}
      onClick={submit ? undefined : onSave}
      className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
    >
      <Save className="h-4 w-4" /> Save Changes
    </button>
  );
}

/* ============ Profile ============ */

function ProfileSection() {
  const { profile, updateProfile, pushToast } = useApp();
  const [editing, setEditing] = useState(false);
  const [avatarBusy, setAvatarBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const pickAvatar = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      pushToast("Please choose an image file (JPG, PNG...).", "error");
      return;
    }
    setAvatarBusy(true);
    try {
      updateProfile({ avatar: await fileToAvatarDataUrl(file) });
      pushToast("Avatar updated.", "success");
    } catch {
      pushToast("Couldn't read that image. Try another one.", "error");
    } finally {
      setAvatarBusy(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Recruiter Profile</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Your public-facing recruiter identity.</p>
        </div>
        <button
          onClick={() => setEditing(true)}
          className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          Edit Profile
        </button>
      </div>

      <Card title="Avatar & Identity">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex flex-col items-center gap-2">
            {profile.avatar ? (
              <img src={profile.avatar} alt={profile.name} className="h-20 w-20 rounded-full object-cover" />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-600 text-2xl font-bold text-white">
                {initialOf(profile.name)}
              </div>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) pickAvatar(f);
                e.target.value = "";
              }}
            />
            <button
              onClick={() => fileRef.current?.click()}
              disabled={avatarBusy}
              className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700 disabled:opacity-60 dark:text-brand-400"
            >
              {avatarBusy && <Loader2 className="h-3 w-3 animate-spin" />}
              Change avatar
            </button>
            {profile.avatar && (
              <button
                onClick={() => updateProfile({ avatar: "" })}
                className="text-xs text-slate-400 hover:text-red-600"
              >
                Remove
              </button>
            )}
          </div>
          <div className="flex-1 space-y-3">
            <ProfileRow label="Name" value={profile.name} />
            <ProfileRow label="Job title" value={profile.jobTitle} />
            <ProfileRow label="Email" value={profile.email} />
            <ProfileRow label="Phone" value={profile.phone} />
            <ProfileRow label="LinkedIn" value={profile.linkedin} />
            <ProfileRow label="Facebook" value={profile.facebook} />
          </div>
        </div>
      </Card>

      <Card title="Default signature" desc="Added to the messages you send from templates.">
        <pre className="whitespace-pre-wrap font-sans text-sm text-slate-700 dark:text-slate-300">
          {profile.signature || "—"}
        </pre>
      </Card>

      {editing && (
        <EditProfileModal
          initial={profile}
          onClose={() => setEditing(false)}
          onSave={(patch) => {
            updateProfile(patch);
            setEditing(false);
            pushToast("Profile updated.", "success");
          }}
        />
      )}
    </div>
  );
}

function normalizeUrl(v: string): string {
  const t = v.trim();
  if (!t) return "";
  return /^https?:\/\//i.test(t) ? t : `https://${t}`;
}

function EditProfileModal({
  initial,
  onClose,
  onSave,
}: {
  initial: RecruiterProfile;
  onClose: () => void;
  onSave: (patch: Partial<RecruiterProfile>) => void;
}) {
  const [form, setForm] = useState({
    name: initial.name,
    jobTitle: initial.jobTitle,
    email: initial.email,
    phone: initial.phone,
    linkedin: initial.linkedin,
    facebook: initial.facebook,
    signature: initial.signature,
  });
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: { name?: string; email?: string } = {};
    if (!form.name.trim()) errs.name = "Name is required.";
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) errs.email = "Enter a valid email address.";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    onSave({
      name: form.name.trim(),
      jobTitle: form.jobTitle.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      linkedin: normalizeUrl(form.linkedin),
      facebook: normalizeUrl(form.facebook),
      signature: form.signature,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.form
        onSubmit={submit}
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Edit Profile</h2>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Name *" value={form.name} error={errors.name} onChange={(v) => setForm({ ...form, name: v })} />
          <Input label="Job title" value={form.jobTitle} onChange={(v) => setForm({ ...form, jobTitle: v })} />
          <Input label="Email *" type="email" value={form.email} error={errors.email} onChange={(v) => setForm({ ...form, email: v })} />
          <Input label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
          <Input label="LinkedIn URL" value={form.linkedin} placeholder="https://linkedin.com/in/..." onChange={(v) => setForm({ ...form, linkedin: v })} />
          <Input label="Facebook URL" value={form.facebook} placeholder="https://facebook.com/..." onChange={(v) => setForm({ ...form, facebook: v })} />
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Default signature</span>
            <textarea
              value={form.signature}
              onChange={(e) => setForm({ ...form, signature: e.target.value })}
              rows={4}
              className="form-input resize-none"
            />
          </label>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <SaveButton onSave={() => undefined} submit />
        </div>
      </motion.form>
    </div>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-2 dark:border-slate-800">
      <span className="text-sm text-slate-500 dark:text-slate-400">{label}</span>
      <span className="break-all text-right text-sm font-medium text-slate-900 dark:text-white">{value || "—"}</span>
    </div>
  );
}

/* ============ Notifications ============ */

function NotificationsSection() {
  const { pushToast, profile } = useApp();
  const [channels, setChannels] = useState({ email: true, inApp: true });
  const [prefs, setPrefs] = useState({
    newCandidate: true,
    movedToInterview: true,
    interviewReminder: true,
    followUpDue: true,
    offerPending: false,
    noReply: true,
    newApplication: true,
    upcomingInterview: true,
    taskOverdue: true,
  });

  const items: { key: keyof typeof prefs; label: string; desc: string }[] = [
    { key: "newCandidate", label: "New candidate applied", desc: "When someone submits a CV or applies to a job." },
    { key: "movedToInterview", label: "Candidate moved to Interview", desc: "When a candidate reaches the interview stage." },
    { key: "interviewReminder", label: "Interview reminder", desc: "Reminder before a scheduled interview." },
    { key: "followUpDue", label: "Follow-up due", desc: "When a follow-up task is due today or overdue." },
    { key: "offerPending", label: "Offer pending", desc: "When an offer is awaiting candidate response." },
    { key: "noReply", label: "Candidate hasn't replied", desc: "No response after 3 days since last contact." },
    { key: "newApplication", label: "New application for assigned JD", desc: "New application on a job you own." },
    { key: "upcomingInterview", label: "Upcoming interview", desc: "Interview scheduled in the next 24 hours." },
    { key: "taskOverdue", label: "Task overdue", desc: "A task has passed its due date." },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Notifications</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Choose what alerts you receive and how.</p>
      </div>

      <Card title="Delivery channels" desc="Where should notifications be sent?">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-slate-400" />
              <div><p className="text-sm font-medium text-slate-900 dark:text-white">Email</p><p className="text-xs text-slate-500">Send to {profile.email}</p></div>
            </div>
            <Toggle on={channels.email} onToggle={() => setChannels({ ...channels, email: !channels.email })} />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-slate-400" />
              <div><p className="text-sm font-medium text-slate-900 dark:text-white">In-app</p><p className="text-xs text-slate-500">Show in the ATS notification panel</p></div>
            </div>
            <Toggle on={channels.inApp} onToggle={() => setChannels({ ...channels, inApp: !channels.inApp })} />
          </div>
        </div>
      </Card>

      <Card title="Notification preferences" desc="Toggle individual alerts on or off.">
        <div className="space-y-1">
          {items.map((item) => (
            <div key={item.key} className="flex items-center justify-between border-b border-slate-100 py-3 last:border-0 dark:border-slate-800">
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">{item.label}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{item.desc}</p>
              </div>
              <Toggle on={prefs[item.key]} onToggle={() => setPrefs({ ...prefs, [item.key]: !prefs[item.key] })} />
            </div>
          ))}
        </div>
      </Card>

      <SaveButton onSave={() => pushToast("Notification settings saved.", "success")} />
    </div>
  );
}

/* ============ Appearance ============ */

function AppearanceSection() {
  const { darkMode, setDarkMode, appearance, updateAppearance, resetAppearance, pushToast } = useApp();

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Appearance</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Customize how RecruMate looks. Changes apply instantly and are saved automatically.
        </p>
      </div>

      <Card title="Theme">
        <div className="grid grid-cols-2 gap-3">
          {[
            { dark: false, label: "Light", icon: Sun },
            { dark: true, label: "Dark", icon: Moon },
          ].map((m) => {
            const active = darkMode === m.dark;
            return (
              <button
                key={m.label}
                onClick={() => setDarkMode(m.dark)}
                className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition ${
                  active
                    ? "border-brand-500 bg-brand-50 dark:bg-brand-600/10"
                    : "border-slate-200 hover:border-slate-300 dark:border-slate-700"
                }`}
              >
                <m.icon className={`h-5 w-5 ${active ? "text-brand-600" : "text-slate-400"}`} />
                <span className="flex-1 text-sm font-medium text-slate-900 dark:text-white">{m.label}</span>
                {active && <Check className="h-4 w-4 text-brand-600" />}
              </button>
            );
          })}
        </div>
      </Card>

      <Card title="Accent color" desc="The primary color used across the whole app.">
        <div className="flex flex-wrap gap-2">
          {ACCENTS.map((a) => {
            const active = appearance.accent === a.id;
            return (
              <button
                key={a.id}
                onClick={() => updateAppearance({ accent: a.id })}
                className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition ${
                  active
                    ? "border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-600/10 dark:text-brand-300"
                    : "border-slate-200 text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:text-slate-400"
                }`}
              >
                <span
                  className="flex h-5 w-5 items-center justify-center rounded-full"
                  style={{ backgroundColor: a.swatch }}
                >
                  {active && <Check className="h-3 w-3 text-white" />}
                </span>
                {a.label}
              </button>
            );
          })}
        </div>
      </Card>

      <Card title="Display preferences">
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField
            label="Density"
            value={appearance.density}
            onChange={(v) => updateAppearance({ density: v as Density })}
            options={["Compact", "Comfortable"]}
          />
          <SelectField
            label="Language"
            value={appearance.language}
            onChange={(v) => updateAppearance({ language: v })}
            options={["English", "Vietnamese"]}
          />
          <SelectField
            label="Date format"
            value={appearance.dateFormat}
            onChange={(v) => updateAppearance({ dateFormat: v })}
            options={["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"]}
          />
          <SelectField
            label="Time zone"
            value={appearance.timeZone}
            onChange={(v) => updateAppearance({ timeZone: v })}
            options={["Asia/Ho_Chi_Minh (GMT+7)", "Asia/Singapore (GMT+8)", "UTC"]}
          />
        </div>
        <p className="mt-3 text-xs text-slate-400">
          Language, date format and time zone are remembered but don't change the interface yet.
        </p>
      </Card>

      <button
        onClick={() => {
          resetAppearance();
          pushToast("Appearance reset to default.", "info");
        }}
        className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
      >
        <RotateCcw className="h-4 w-4" /> Reset to default
      </button>
    </div>
  );
}

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="form-input">
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}
