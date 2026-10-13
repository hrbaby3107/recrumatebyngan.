import { useState } from "react";
import {
  Plus,
  X,
  GripVertical,
  ArrowUp,
  ArrowDown,
  Trash2,
  Copy,
  Check,
  Shield,
  Database,
  Download,
  Users,
  Linkedin,
  Mail,
  Calendar,
  MessageSquare,
} from "lucide-react";

type PushToast = (msg: string, type?: "success" | "info" | "error") => void;

/* ============ Pipeline ============ */

interface StageItem {
  id: string;
  name: string;
  color: string;
}

export function PipelineSection({ pushToast }: { pushToast: PushToast }) {
  const [defaultView, setDefaultView] = useState("Kanban");
  const [defaultJobStatus, setDefaultJobStatus] = useState("Open");
  const [stages, setStages] = useState<StageItem[]>([
    { id: "s1", name: "Sourced", color: "bg-slate-400" },
    { id: "s2", name: "Contacted", color: "bg-sky-500" },
    { id: "s3", name: "Interested", color: "bg-cyan-500" },
    { id: "s4", name: "Screening", color: "bg-teal-500" },
    { id: "s5", name: "Interview", color: "bg-amber-500" },
    { id: "s6", name: "Offer", color: "bg-violet-500" },
    { id: "s7", name: "Hired", color: "bg-emerald-500" },
    { id: "s8", name: "Rejected", color: "bg-red-500" },
  ]);
  const [newStage, setNewStage] = useState("");

  const addStage = () => {
    if (!newStage.trim()) return;
    setStages([...stages, { id: `s${Date.now()}`, name: newStage.trim(), color: "bg-slate-400" }]);
    setNewStage("");
  };

  const removeStage = (id: string) => setStages(stages.filter((s) => s.id !== id));
  const moveStage = (idx: number, dir: -1 | 1) => {
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= stages.length) return;
    const arr = [...stages];
    [arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]];
    setStages(arr);
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Recruitment Pipeline</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Customize your pipeline stages and defaults.</p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-base font-semibold text-slate-900 dark:text-white">Defaults</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Default candidate view</span>
            <select value={defaultView} onChange={(e) => setDefaultView(e.target.value)} className="form-input">
              <option>Kanban</option><option>List</option><option>Table</option>
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Default job status</span>
            <select value={defaultJobStatus} onChange={(e) => setDefaultJobStatus(e.target.value)} className="form-input">
              <option>Draft</option><option>Open</option><option>On Hold</option><option>Closed</option>
            </select>
          </label>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-base font-semibold text-slate-900 dark:text-white">Pipeline stages</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Drag-free reorder. Stages appear left-to-right on your Kanban.</p>
        <div className="mt-4 space-y-2">
          {stages.map((stage, idx) => (
            <div key={stage.id} className="flex items-center gap-2 rounded-lg border border-slate-100 bg-slate-50 p-2.5 dark:border-slate-800 dark:bg-slate-800/50">
              <GripVertical className="h-4 w-4 shrink-0 text-slate-300 dark:text-slate-600" />
              <span className={`h-3 w-3 shrink-0 rounded-full ${stage.color}`} />
              <span className="flex-1 text-sm font-medium text-slate-700 dark:text-slate-200">{stage.name}</span>
              <button onClick={() => moveStage(idx, -1)} disabled={idx === 0} className="rounded p-1 text-slate-400 hover:bg-slate-200 disabled:opacity-30 dark:hover:bg-slate-700"><ArrowUp className="h-3.5 w-3.5" /></button>
              <button onClick={() => moveStage(idx, 1)} disabled={idx === stages.length - 1} className="rounded p-1 text-slate-400 hover:bg-slate-200 disabled:opacity-30 dark:hover:bg-slate-700"><ArrowDown className="h-3.5 w-3.5" /></button>
              <button onClick={() => removeStage(stage.id)} className="rounded p-1 text-slate-400 hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-900/20"><Trash2 className="h-3.5 w-3.5" /></button>
            </div>
          ))}
        </div>
        <div className="mt-3 flex gap-2">
          <input
            value={newStage}
            onChange={(e) => setNewStage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addStage()}
            placeholder="New stage name..."
            className="form-input flex-1"
          />
          <button onClick={addStage} className="inline-flex items-center gap-1 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"><Plus className="h-4 w-4" /> Add</button>
        </div>
      </div>

      <button onClick={() => pushToast("Pipeline settings saved.", "success")} className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">Save Changes</button>
    </div>
  );
}

/* ============ Tags & Sources ============ */

export function TagsSection({ pushToast }: { pushToast: PushToast }) {
  const [candidateTags, setCandidateTags] = useState(["Java", "Python", "Banking", "English", "Remote", "Urgent", "Hot Candidate"]);
  const [sources, setSources] = useState(["LinkedIn", "Facebook", "TopCV", "VietnamWorks", "Referral", "Direct Apply", "Database", "Threads"]);
  const [skillCategories, setSkillCategories] = useState(["Frontend", "Backend", "DevOps", "QA", "BA", "Data", "Mobile"]);
  const [seniorities, setSeniorities] = useState(["Junior", "Middle", "Senior", "Lead"]);
  const [industries, setIndustries] = useState(["Banking", "Fintech", "E-commerce", "Insurance", "AI", "Healthcare"]);
  const [newTag, setNewTag] = useState("");

  const addTag = (list: string[], setList: (v: string[]) => void) => {
    if (!newTag.trim()) return;
    setList([...list, newTag.trim()]);
    setNewTag("");
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Tags & Sources</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Manage candidate tags, sources, and classification fields.</p>
      </div>

      <TagGroup title="Candidate tags" desc="Labels you can assign to candidates for quick filtering." items={candidateTags} setItems={setCandidateTags} newTag={newTag} setNewTag={setNewTag} onAdd={() => addTag(candidateTags, setCandidateTags)} />
      <TagGroup title="Candidate sources" desc="Where candidates come from." items={sources} setItems={setSources} newTag={newTag} setNewTag={setNewTag} onAdd={() => addTag(sources, setSources)} />
      <TagGroup title="Skill categories" desc="Group skills into categories for matching." items={skillCategories} setItems={setSkillCategories} newTag={newTag} setNewTag={setNewTag} onAdd={() => addTag(skillCategories, setSkillCategories)} />
      <TagGroup title="Seniority levels" items={seniorities} setItems={setSeniorities} newTag={newTag} setNewTag={setNewTag} onAdd={() => addTag(seniorities, setSeniorities)} />
      <TagGroup title="Industries" items={industries} setItems={setIndustries} newTag={newTag} setNewTag={setNewTag} onAdd={() => addTag(industries, setIndustries)} />

      <button onClick={() => pushToast("Tags & sources saved.", "success")} className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">Save Changes</button>
    </div>
  );
}

function TagGroup({ title, desc, items, setItems, newTag, setNewTag, onAdd }: {
  title: string;
  desc?: string;
  items: string[];
  setItems: (v: string[]) => void;
  newTag: string;
  setNewTag: (v: string) => void;
  onAdd: () => void;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <h2 className="text-base font-semibold text-slate-900 dark:text-white">{title}</h2>
      {desc && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{desc}</p>}
      <div className="mt-3 flex flex-wrap gap-2">
        {items.map((t, i) => (
          <span key={t} className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1.5 text-sm font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            {t}
            <button onClick={() => setItems(items.filter((_, idx) => idx !== i))} className="text-slate-400 hover:text-red-500"><X className="h-3.5 w-3.5" /></button>
          </span>
        ))}
        {items.length === 0 && <p className="text-sm text-slate-400">No items yet.</p>}
      </div>
      <div className="mt-3 flex gap-2">
        <input value={newTag} onChange={(e) => setNewTag(e.target.value)} onKeyDown={(e) => e.key === "Enter" && onAdd()} placeholder="Add new..." className="form-input flex-1" />
        <button onClick={onAdd} className="inline-flex items-center gap-1 rounded-xl border border-slate-300 px-3 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"><Plus className="h-4 w-4" /></button>
      </div>
    </div>
  );
}

/* ============ Message Templates ============ */

interface Template {
  id: string;
  name: string;
  category: string;
  subject: string;
  body: string;
}

const defaultTemplates: Template[] = [
  {
    id: "t1",
    name: "Initial Outreach",
    category: "Outreach",
    subject: "Opportunity: {{job_title}} at {{company}}",
    body: "Hi {{candidate_name}},\n\nI'm {{recruiter_name}}, an IT headhunter. I came across your profile and think you'd be a great fit for a {{job_title}} role at {{company}}.\n\nSalary range: {{salary}}\n\nWould you be open to a quick chat this week?\n\n{{signature}}",
  },
  {
    id: "t2",
    name: "Interview Invitation",
    category: "Interview",
    subject: "Interview invitation — {{job_title}} at {{company}}",
    body: "Hi {{candidate_name}},\n\nGreat news! The team would like to invite you to a technical interview for the {{job_title}} position at {{company}}.\n\nPlease let me know your availability for this week.\n\n{{signature}}",
  },
  {
    id: "t3",
    name: "Rejection",
    category: "Outcome",
    subject: "Update on your application — {{job_title}}",
    body: "Hi {{candidate_name}},\n\nThank you for taking the time to interview for the {{job_title}} role. While your background was impressive, the team has decided to move forward with another candidate.\n\nI'll keep your CV in my talent pool and reach out when a matching role comes up.\n\n{{signature}}",
  },
  {
    id: "t4",
    name: "Offer",
    category: "Outcome",
    subject: "Offer: {{job_title}} at {{company}}",
    body: "Hi {{candidate_name}},\n\nCongratulations! {{company}} would like to extend an offer for the {{job_title}} position.\n\nSalary: {{salary}}\nStart date: to be discussed\n\nPlease review the attached offer letter and let me know your thoughts.\n\n{{signature}}",
  },
];

export function TemplatesSection({ pushToast }: { pushToast: PushToast }) {
  const [templates, setTemplates] = useState<Template[]>(defaultTemplates);
  const [selected, setSelected] = useState<Template | null>(defaultTemplates[0]);
  const [editing, setEditing] = useState(false);

  const variables = ["{{candidate_name}}", "{{job_title}}", "{{company}}", "{{salary}}", "{{recruiter_name}}", "{{signature}}"];

  const updateField = (field: keyof Template, value: string) => {
    if (!selected) return;
    const updated = { ...selected, [field]: value };
    setSelected(updated);
    setTemplates(templates.map((t) => (t.id === updated.id ? updated : t)));
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Message Templates</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Pre-written messages with auto-fill variables for your workflow.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[200px_1fr]">
        {/* Template list */}
        <div className="space-y-2">
          {templates.map((t) => (
            <button
              key={t.id}
              onClick={() => { setSelected(t); setEditing(false); }}
              className={`flex w-full items-center justify-between rounded-lg border px-3 py-2.5 text-left text-sm font-medium transition ${
                selected?.id === t.id
                  ? "border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-600/10 dark:text-brand-300"
                  : "border-slate-200 text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:text-slate-400"
              }`}
            >
              <span className="truncate">{t.name}</span>
              <span className="ml-2 shrink-0 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-500 dark:bg-slate-800 dark:text-slate-400">{t.category}</span>
            </button>
          ))}
          <button
            onClick={() => {
              const t: Template = { id: `t${Date.now()}`, name: "New Template", category: "Custom", subject: "", body: "" };
              setTemplates([...templates, t]);
              setSelected(t);
              setEditing(true);
            }}
            className="flex w-full items-center justify-center gap-1 rounded-lg border border-dashed border-slate-300 px-3 py-2.5 text-sm font-medium text-slate-400 hover:border-brand-400 hover:text-brand-600 dark:border-slate-700 dark:hover:border-brand-600"
          >
            <Plus className="h-4 w-4" /> New template
          </button>
        </div>

        {/* Template editor */}
        {selected && (
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            {!editing ? (
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold text-slate-900 dark:text-white">{selected.name}</h2>
                  <div className="flex gap-2">
                    <button onClick={() => pushToast("Template copied to clipboard.", "info")} className="rounded-lg border border-slate-200 p-2 text-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"><Copy className="h-4 w-4" /></button>
                    <button onClick={() => setEditing(true)} className="rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-700">Edit</button>
                  </div>
                </div>
                <div className="mt-4 space-y-3">
                  <div><span className="text-xs text-slate-400">Subject</span><p className="text-sm font-medium text-slate-700 dark:text-slate-200">{selected.subject}</p></div>
                  <div><span className="text-xs text-slate-400">Body</span><pre className="mt-1 whitespace-pre-wrap rounded-lg bg-slate-50 p-4 text-sm text-slate-600 dark:bg-slate-800/50 dark:text-slate-300">{selected.body}</pre></div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block"><span className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Name</span><input value={selected.name} onChange={(e) => updateField("name", e.target.value)} className="form-input" /></label>
                  <label className="block"><span className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Category</span><input value={selected.category} onChange={(e) => updateField("category", e.target.value)} className="form-input" /></label>
                </div>
                <label className="block"><span className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Subject</span><input value={selected.subject} onChange={(e) => updateField("subject", e.target.value)} className="form-input" /></label>
                <label className="block"><span className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Body</span><textarea value={selected.body} onChange={(e) => updateField("body", e.target.value)} rows={8} className="form-input resize-none font-mono text-sm" /></label>
                <div>
                  <p className="mb-1.5 text-xs text-slate-400">Available variables (click to insert):</p>
                  <div className="flex flex-wrap gap-1.5">
                    {variables.map((v) => (
                      <span key={v} className="rounded bg-slate-100 px-2 py-1 font-mono text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400">{v}</span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setEditing(false); pushToast("Template saved.", "success"); }} className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">Save</button>
                  <button onClick={() => setEditing(false)} className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">Cancel</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ============ Workspace ============ */

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "Active" | "Invited";
}

const roles = [
  { name: "Admin", candidate: "Full", jd: "Full", settings: "Full" },
  { name: "Recruiter", candidate: "Own/Team", jd: "Create/Edit", settings: "Limited" },
  { name: "Hiring Manager", candidate: "View", jd: "View", settings: "No" },
  { name: "BD / Account", candidate: "View", jd: "Manage clients", settings: "No" },
];

const integrations = [
  { name: "Gmail", icon: Mail, desc: "Sync email outreach and replies", connected: false },
  { name: "Google Calendar", icon: Calendar, desc: "Sync interview schedules to calendar", connected: true },
  { name: "LinkedIn", icon: Linkedin, desc: "Import candidates from LinkedIn", connected: false },
  { name: "Slack", icon: MessageSquare, desc: "Get notifications in Slack", connected: false },
];

export function WorkspaceSection() {
  const { pushToast } = useAppSafe();
  const [members, setMembers] = useState<TeamMember[]>([
    { id: "m1", name: "Kylie (Ngan)", email: "ngan.tran4@reco-vn.com", role: "Admin", status: "Active" },
    { id: "m2", name: "John Doe", email: "john@reco-vn.com", role: "Recruiter", status: "Invited" },
  ]);
  const [newEmail, setNewEmail] = useState("");

  const invite = () => {
    if (!newEmail.trim()) return;
    setMembers([...members, { id: `m${Date.now()}`, name: newEmail.split("@")[0], email: newEmail, role: "Recruiter", status: "Invited" }]);
    setNewEmail("");
    pushToast("Invitation sent.", "success");
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Team & Roles</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Manage team members, permissions, and integrations.</p>
      </div>

      {/* Team */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-base font-semibold text-slate-900 dark:text-white">Team members</h2>
        <div className="mt-4 space-y-2">
          {members.map((m) => (
            <div key={m.id} className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/50">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-100 text-sm font-bold text-brand-700 dark:bg-brand-600/20 dark:text-brand-300">{m.name[0]}</div>
                <div><p className="text-sm font-semibold text-slate-900 dark:text-white">{m.name}</p><p className="text-xs text-slate-500 dark:text-slate-400">{m.email}</p></div>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300">{m.role}</span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${m.status === "Active" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400" : "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"}`}>{m.status}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 flex gap-2">
          <input value={newEmail} onChange={(e) => setNewEmail(e.target.value)} onKeyDown={(e) => e.key === "Enter" && invite()} placeholder="Invite by email..." className="form-input flex-1" />
          <button onClick={invite} className="inline-flex items-center gap-1 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"><Plus className="h-4 w-4" /> Invite</button>
        </div>
      </div>

      {/* Roles & Permissions */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-base font-semibold text-slate-900 dark:text-white">Roles & Permissions</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs text-slate-400 dark:border-slate-700">
                <th className="pb-2 font-medium">Role</th><th className="pb-2 font-medium">Candidate</th><th className="pb-2 font-medium">JD</th><th className="pb-2 font-medium">Settings</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((r) => (
                <tr key={r.name} className="border-b border-slate-100 dark:border-slate-800">
                  <td className="py-2.5 font-medium text-slate-900 dark:text-white">{r.name}</td>
                  <td className="py-2.5 text-slate-600 dark:text-slate-300">{r.candidate}</td>
                  <td className="py-2.5 text-slate-600 dark:text-slate-300">{r.jd}</td>
                  <td className="py-2.5 text-slate-600 dark:text-slate-300">{r.settings}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Integrations */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-base font-semibold text-slate-900 dark:text-white">Integrations</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Connect external tools to RecruMate.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {integrations.map((i) => (
            <div key={i.name} className="flex items-center justify-between rounded-lg border border-slate-100 p-4 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"><i.icon className="h-4.5 w-4.5" /></div>
                <div><p className="text-sm font-semibold text-slate-900 dark:text-white">{i.name}</p><p className="text-xs text-slate-500 dark:text-slate-400">{i.desc}</p></div>
              </div>
              {i.connected ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"><Check className="h-3 w-3" /> Connected</span>
              ) : (
                <button onClick={() => pushToast(`${i.name} integration coming soon.`, "info")} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">Connect</button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============ Privacy & Data ============ */

export function PrivacySection({ pushToast }: { pushToast: PushToast }) {
  const [retention, setRetention] = useState("12 months");
  const [autoArchive, setAutoArchive] = useState(true);
  const [cvParsing, setCvParsing] = useState(true);
  const [duplicateDetection, setDuplicateDetection] = useState(true);
  const [maxSize, setMaxSize] = useState("10 MB");
  const [fileTypes] = useState(["PDF", "DOC", "DOCX"]);
  const [namingConvention, setNamingConvention] = useState("FirstName_LastName_CV");

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">CV Storage & Data Privacy</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Manage how candidate data is stored and protected.</p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-white"><Database className="h-5 w-5 text-brand-500" /> CV Settings</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block"><span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">CV retention period</span>
            <select value={retention} onChange={(e) => setRetention(e.target.value)} className="form-input"><option>6 months</option><option>12 months</option><option>24 months</option><option>Indefinite</option></select>
          </label>
          <label className="block"><span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Maximum CV file size</span>
            <select value={maxSize} onChange={(e) => setMaxSize(e.target.value)} className="form-input"><option>5 MB</option><option>10 MB</option><option>20 MB</option></select>
          </label>
          <label className="block"><span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">CV naming convention</span>
            <input value={namingConvention} onChange={(e) => setNamingConvention(e.target.value)} className="form-input" />
          </label>
          <div><span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Allowed file types</span>
            <div className="flex gap-2 pt-1.5">
              {fileTypes.map((t) => <span key={t} className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-sm font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">{t}</span>)}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-white"><Shield className="h-5 w-5 text-brand-500" /> Automation</h2>
        <div className="mt-4 space-y-3">
          <ToggleRow title="Auto CV parsing" desc="Automatically extract candidate info from uploaded CVs." on={cvParsing} onToggle={() => setCvParsing(!cvParsing)} />
          <ToggleRow title="Duplicate candidate detection" desc="Warn when a candidate already exists in your talent pool." on={duplicateDetection} onToggle={() => setDuplicateDetection(!duplicateDetection)} />
          <ToggleRow title="Auto-archive inactive candidates" desc={`Archive candidates after ${retention} of inactivity.`} on={autoArchive} onToggle={() => setAutoArchive(!autoArchive)} />
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-white">Data Management</h2>
        <div className="mt-4 space-y-3">
          <DataRow label="Export all candidate data" desc="Download a CSV/ZIP of all candidates and CVs." buttonText="Export" onClick={() => pushToast("Export started. You'll receive an email when ready.", "info")} />
          <DataRow label="Delete candidate data" desc="Permanently remove a candidate and their CV." buttonText="Delete" danger onClick={() => pushToast("Use the candidate profile to delete individual records.", "info")} />
        </div>
      </div>

      <button onClick={() => pushToast("Privacy settings saved.", "success")} className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">Save Changes</button>
    </div>
  );
}

function ToggleRow({ title, desc, on, onToggle }: { title: string; desc: string; on: boolean; onToggle: () => void }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0 dark:border-slate-800">
      <div><p className="text-sm font-medium text-slate-900 dark:text-white">{title}</p><p className="text-xs text-slate-500 dark:text-slate-400">{desc}</p></div>
      <button onClick={onToggle} className={`relative h-6 w-11 shrink-0 rounded-full transition ${on ? "bg-brand-600" : "bg-slate-300 dark:bg-slate-700"}`}>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${on ? "left-[22px]" : "left-0.5"}`} />
      </button>
    </div>
  );
}

function DataRow({ label, desc, buttonText, onClick, danger }: { label: string; desc: string; buttonText: string; onClick: () => void; danger?: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0 dark:border-slate-800">
      <div><p className="text-sm font-medium text-slate-900 dark:text-white">{label}</p><p className="text-xs text-slate-500 dark:text-slate-400">{desc}</p></div>
      <button onClick={onClick} className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${danger ? "border border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/30 dark:hover:bg-red-900/20" : "border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"}`}>{buttonText}</button>
    </div>
  );
}

/* ============ Hook helper ============ */

import { useApp as useAppHook } from "../../store/AppContext";
function useAppSafe() {
  try { return useAppHook(); } catch { return { pushToast: () => {} }; }
}
