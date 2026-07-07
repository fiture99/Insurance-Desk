import React, { useState } from "react";
import {
  Plus, Search, Check, FileText, Users, LayoutGrid, X,
  AlertCircle, ChevronRight, Lock, Unlock, LogOut, ShieldCheck,
  Eye, EyeOff, UserPlus, Trash2, Pencil, Save, Settings,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────

type Role      = "admin" | "staff";
type StaffUser = { id: string; username: string; password: string; displayName: string; role: Role; createdAt: string };
type Member    = {
  id: string; policyNo: string; name: string;
  insurer: string; employer: string; role: string;
  status: string; phone?: string; dob?: string;
};
type Request   = { id: string; insurer: string; type: string; memberName: string; policyNo: string; reason: string; dateReceived: string; stage: string; notes: string };

// ── Seed data ──────────────────────────────────────────────────────────────

const seedUsers: StaffUser[] = [
  { id: "u-1", username: "admin", password: "admin123", displayName: "Administrator",  role: "admin", createdAt: "2025-01-01" },
  { id: "u-2", username: "fatou", password: "desk2025",  displayName: "Fatou Jallow",   role: "staff", createdAt: "2025-03-12" },
];

const seedMembers: Member[] = [
  { id: "3286/P", policyNo: "POL-87397", name: "Mr Sherifo Sanyang",         insurer: "Horizon Health Assurance",  employer: "Standard Chartered",               role: "Principal", status: "Active", phone: "5539336", dob: "" },
  { id: "7924/B", policyNo: "POL-54118", name: "Miss Fatou Sambou",           insurer: "Sunu Assurances",           employer: "National Water & Electricity Co.", role: "Principal", status: "Active", phone: "2857401", dob: "" },
  { id: "8517/P", policyNo: "POL-83579", name: "Mr Lamin Manneh",             insurer: "Sunu Assurances",           employer: "National Water & Electricity Co.", role: "Principal", status: "Active", phone: "6521269", dob: "" },
  { id: "2796/P", policyNo: "POL-88172", name: "Mrs Valarie Jennifer Manneh", insurer: "Prudential Life Gambia",    employer: "National Water & Electricity Co.", role: "Principal", status: "Active", phone: "2532909", dob: "" },
  { id: "9797/B", policyNo: "POL-48469", name: "Mrs Haddy Sambou",            insurer: "Horizon Health Assurance",  employer: "Gam Petroleum",                   role: "Principal", status: "Active", phone: "5647075", dob: "" },
  { id: "9689/P", policyNo: "POL-12552", name: "Mrs Sira Mundow Jatta",       insurer: "Prudential Life Gambia",    employer: "Gam Petroleum",                   role: "Principal", status: "Active", phone: "2938414", dob: "" },
  { id: "1964/P", policyNo: "POL-19287", name: "Mr Lamin Badjie",             insurer: "Continental Health Cover",  employer: "GNPC",                            role: "Principal", status: "Active", phone: "6313054", dob: "" },
  { id: "2612/P", policyNo: "POL-24322", name: "Miss Mariama Darboe",         insurer: "Continental Health Cover",  employer: "Standard Chartered",              role: "Principal", status: "Active", phone: "4085880", dob: "" },
  { id: "1035/B", policyNo: "POL-47388", name: "Miss Fatou Camara",           insurer: "Prudential Life Gambia",    employer: "Gambia Ports Authority",          role: "Principal", status: "Active", phone: "5548443", dob: "" },
  { id: "8811/P", policyNo: "POL-34356", name: "Miss Virone Vatnani",         insurer: "Horizon Health Assurance",  employer: "Access Bank",                     role: "Principal", status: "Active", phone: "2574798", dob: "" },
  { id: "2343/B", policyNo: "POL-44179", name: "Mrs Varsha Badjie",           insurer: "Continental Health Cover",  employer: "Access Bank",                     role: "Principal", status: "Active", phone: "3713450", dob: "" },
  { id: "2753/P", policyNo: "POL-54942", name: "Mr Momodou Sanyang",          insurer: "Sunu Assurances",           employer: "Gam Petroleum",                   role: "Principal", status: "Active", phone: "3707898", dob: "" },
  { id: "5533/P", policyNo: "POL-93507", name: "Mrs Fatou Vatnani",           insurer: "Sunu Assurances",           employer: "Gam Petroleum",                   role: "Principal", status: "Active", phone: "4197440", dob: "" },
  { id: "6050/B", policyNo: "POL-99399", name: "Mr Momodou Sonko",            insurer: "Sunu Assurances",           employer: "Gam Petroleum",                   role: "Principal", status: "Active", phone: "4093207", dob: "" },
  { id: "8541/B", policyNo: "POL-39219", name: "Miss Fatou Vatnani",          insurer: "Sunu Assurances",           employer: "Gambia Ports Authority",          role: "Principal", status: "Active", phone: "2198511", dob: "" },
  { id: "4114/B", policyNo: "POL-10221", name: "Mr Ousman Njie",              insurer: "Prudential Life Gambia",    employer: "Standard Chartered",              role: "Principal", status: "Active", phone: "6361407", dob: "" },
  { id: "7211/P", policyNo: "POL-63225", name: "Mrs Mariama Jallow",          insurer: "Continental Health Cover",  employer: "Access Bank",                     role: "Principal", status: "Active", phone: "6596430", dob: "" },
];

const seedRequests: Request[] = [
  { id: "REQ-1001", insurer: "Horizon Health Assurance", type: "Remove dependent", memberName: "Mrs Haddy Sambou",    policyNo: "POL-48469", reason: "Exceeded age limit under policy", dateReceived: new Date().toISOString().slice(0, 10), stage: "Received",  notes: "Formal letter to follow. Email treated as authorization." },
  { id: "REQ-1002", insurer: "Sunu Assurances",          type: "Update details",   memberName: "Mr Lamin Manneh",     policyNo: "POL-83579", reason: "Phone number change",             dateReceived: new Date().toISOString().slice(0, 10), stage: "Reviewed",  notes: "Member called in. New number to be confirmed with employer." },
  { id: "REQ-1003", insurer: "Continental Health Cover", type: "Add dependent",    memberName: "Mrs Mariama Jallow",  policyNo: "POL-63225", reason: "New spouse to be added to policy", dateReceived: new Date().toISOString().slice(0, 10), stage: "Received",  notes: "Marriage certificate received via email." },
];

// ── Constants ──────────────────────────────────────────────────────────────

const STAGES        = ["Received", "Reviewed", "Actioned", "Confirmed"];
const REQUEST_TYPES = ["Add dependent", "Remove dependent", "Update details", "Reinstate"];
const ROLES_MEMBER  = ["Principal", "Dependent", "Spouse", "Child"];
const STAGE_COLOR: Record<string, string> = {
  Received: "#E3993A", Reviewed: "#3D7EA6", Actioned: "#0E7A77", Confirmed: "#55606B",
};

// ── Shared styles ──────────────────────────────────────────────────────────

const input: React.CSSProperties = {
  padding: "8px 10px", fontSize: 13.5, border: "1px solid #D7DBE0",
  borderRadius: 7, fontFamily: "inherit", color: "#1B2A41", background: "#fff", width: "100%",
};

const btnPrimary: React.CSSProperties = {
  border: "none", background: "#0E7A77", color: "#fff",
  borderRadius: 7, padding: "8px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer",
};

const btnSecondary: React.CSSProperties = {
  border: "1px solid #D7DBE0", background: "#fff",
  borderRadius: 7, padding: "8px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer",
};

// ── Atoms ──────────────────────────────────────────────────────────────────

function Badge({ children, color = "#55606B", bg = "#F0F1F3" }: { children: React.ReactNode; color?: string; bg?: string }) {
  return <span style={{ display: "inline-block", fontSize: 11, fontWeight: 700, color, background: bg, borderRadius: 5, padding: "3px 8px", letterSpacing: 0.2 }}>{children}</span>;
}

function EmptyNote({ text }: { text: string }) {
  return <div style={{ padding: "16px 4px", color: "#9AA2AB", fontSize: 13.5, fontStyle: "italic" }}>{text}</div>;
}

function Field({ label, children, style }: { label: string; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 5, fontSize: 12.5, fontWeight: 600, color: "#55606B", ...style }}>
      {label}{children}
    </label>
  );
}

function PasswordInput({ value, onChange, placeholder, autoFocus }: { value: string; onChange: (v: string) => void; placeholder?: string; autoFocus?: boolean }) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <input type={show ? "text" : "password"} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} autoFocus={autoFocus} style={{ ...input, paddingRight: 36 }} />
      <button type="button" onClick={() => setShow((s) => !s)} style={{ position: "absolute", right: 9, top: "50%", transform: "translateY(-50%)", border: "none", background: "none", color: "#9AA2AB", cursor: "pointer", padding: 0, display: "flex" }}>
        {show ? <EyeOff size={15} /> : <Eye size={15} />}
      </button>
    </div>
  );
}

// ── Stage rail ─────────────────────────────────────────────────────────────

function StageRail({ stage, compact }: { stage: string; compact?: boolean }) {
  const idx = STAGES.indexOf(stage);
  if (compact) {
    return (
      <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
        {STAGES.map((s, i) => <div key={s} title={s} style={{ width: 8, height: 8, borderRadius: 99, background: i <= idx ? STAGE_COLOR[stage] : "#E3E6EA" }} />)}
      </div>
    );
  }
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {STAGES.map((s, i) => (
        <React.Fragment key={s}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 74 }}>
            <div style={{ width: 22, height: 22, borderRadius: 99, display: "flex", alignItems: "center", justifyContent: "center", background: i <= idx ? STAGE_COLOR[s] : "#fff", border: `2px solid ${i <= idx ? STAGE_COLOR[s] : "#D7DBE0"}`, color: i <= idx ? "#fff" : "#9AA2AB", fontSize: 11, fontWeight: 700 }}>
              {i < idx ? <Check size={13} /> : i + 1}
            </div>
            <span style={{ marginTop: 6, fontSize: 11, fontFamily: "'IBM Plex Mono', monospace", color: i <= idx ? "#1B2A41" : "#9AA2AB", letterSpacing: 0.2 }}>{s}</span>
          </div>
          {i < STAGES.length - 1 && <div style={{ flex: 1, height: 2, background: i < idx ? STAGE_COLOR[s] : "#E3E6EA", marginBottom: 18 }} />}
        </React.Fragment>
      ))}
    </div>
  );
}

// ── Member modal (add / edit) ──────────────────────────────────────────────

type MemberForm = {
  policyNo: string; name: string;
  insurer: string; employer: string;
  role: string; status: string;
  phone: string; dob: string;
};

function MemberModal({
  initial, existingPolicies, onClose, onSave,
}: {
  initial?: Member;
  existingPolicies: string[];
  onClose: () => void;
  onSave: (f: MemberForm) => void;
}) {
  const [form, setForm] = useState<MemberForm>({
    policyNo: initial?.policyNo ?? "",
    name:     initial?.name     ?? "",
    insurer:  initial?.insurer  ?? "",
    employer: initial?.employer ?? "",
    role:     initial?.role     ?? "Dependent",
    status:   initial?.status   ?? "Active",
    phone:    initial?.phone    ?? "",
    dob:      initial?.dob      ?? "",
  });
  const [err, setErr] = useState("");
  const set = (k: keyof MemberForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const isEdit = !!initial;

  function submit() {
    if (!form.policyNo.trim()) { setErr("Policy number is required."); return; }
    if (!form.name.trim())     { setErr("Name is required."); return; }
    if (!form.insurer.trim())  { setErr("Insurer is required."); return; }
    if (!form.employer.trim()) { setErr("Employer is required."); return; }
    if (!isEdit && existingPolicies.includes(form.policyNo.trim())) { setErr("A member with this policy number already exists."); return; }
    onSave({ ...form, policyNo: form.policyNo.trim(), name: form.name.trim() });
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(27,42,65,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 20 }}>
      <div style={{ background: "#fff", borderRadius: 12, width: 500, maxWidth: "90vw", padding: 26, maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontFamily: "'Spectral', serif", fontSize: 19, fontWeight: 600, margin: 0 }}>{isEdit ? "Edit member" : "Add member"}</h2>
          <button onClick={onClose} style={{ border: "none", background: "none", cursor: "pointer" }}><X size={18} /></button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 18 }}>
          <Field label="Policy number">
            <input
              value={form.policyNo}
              onChange={set("policyNo")}
              style={{ ...input, fontFamily: "'IBM Plex Mono', monospace", ...(isEdit ? { background: "#F6F7F9", color: "#9AA2AB" } : {}) }}
              placeholder="e.g. GNPC/2025/B"
              readOnly={isEdit}
            />
            {isEdit && <span style={{ fontSize: 11, color: "#9AA2AB", marginTop: 1 }}>Policy number cannot be changed after creation.</span>}
          </Field>

          <Field label="Full name">
            <input value={form.name} onChange={set("name")} style={input} placeholder="e.g. Sarjo Badjie" autoFocus={!isEdit} />
          </Field>

          <div style={{ display: "flex", gap: 10 }}>
            <Field label="Insurer (insurance company)" style={{ flex: 1 }}>
              <input value={form.insurer} onChange={set("insurer")} style={input} placeholder="e.g. Sunshine Insurance" />
            </Field>
            <Field label="Employer (employing company)" style={{ flex: 1 }}>
              <input value={form.employer} onChange={set("employer")} style={input} placeholder="e.g. GNPC" />
            </Field>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <Field label="Relationship on policy" style={{ flex: 1 }}>
              <select value={form.role} onChange={set("role")} style={input}>
                {ROLES_MEMBER.map((r) => <option key={r}>{r}</option>)}
              </select>
            </Field>
            <Field label="Status" style={{ flex: 1 }}>
              <select value={form.status} onChange={set("status")} style={input}>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </Field>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <Field label="Phone number" style={{ flex: 1 }}>
              <input value={form.phone} onChange={set("phone")} style={input} placeholder="+220 999 0000" />
            </Field>
            <Field label="Date of birth" style={{ flex: 1 }}>
              <input type="date" value={form.dob} onChange={set("dob")} style={input} />
            </Field>
          </div>
        </div>

        {err && <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#C1483F", fontSize: 12.5, fontWeight: 600, marginTop: 10 }}><AlertCircle size={13} />{err}</div>}

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 20 }}>
          <button onClick={onClose} style={btnSecondary}>Cancel</button>
          <button onClick={submit} style={btnPrimary}>{isEdit ? <><Save size={13} style={{ marginRight: 5 }} />Save changes</> : <><Plus size={13} style={{ marginRight: 5 }} />Add member</>}</button>
        </div>
      </div>
    </div>
  );
}

// ── Members tab ────────────────────────────────────────────────────────────

function MembersTab({ members, canEdit, query, setQuery, onAdd, onUpdate, onDelete }: {
  members: Member[]; canEdit: boolean; query: string; setQuery: (q: string) => void;
  onAdd: (f: MemberForm) => void; onUpdate: (id: string, f: MemberForm) => void; onDelete: (id: string) => void;
}) {
  const [showAdd,   setShowAdd]   = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const filtered = members.filter((m) =>
    [m.policyNo, m.name, m.insurer, m.employer, m.phone].some((v) => (v ?? "").toLowerCase().includes(query.toLowerCase()))
  );
  const editing = members.find((m) => m.id === editingId);
  const existingPolicies = members.map((m) => m.policyNo);

  const cols = canEdit
    ? "1.3fr 1fr 1.1fr 1fr 0.8fr 0.7fr 72px"
    : "1.3fr 1fr 1.1fr 1fr 0.8fr 0.7fr";

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: "'Spectral', serif", fontSize: 26, fontWeight: 600, margin: 0 }}>Members</h1>
          <p style={{ color: "#55606B", fontSize: 14, marginTop: 4 }}>Principals and dependents covered under insurance policies.</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ position: "relative" }}>
            <Search size={14} style={{ position: "absolute", left: 10, top: 10, color: "#9AA2AB" }} />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Policy no, name, insurer…" style={{ padding: "8px 10px 8px 30px", fontSize: 13, border: "1px solid #D7DBE0", borderRadius: 7, width: 240, fontFamily: "inherit" }} />
          </div>
          {canEdit && (
            <button onClick={() => setShowAdd(true)} style={{ ...btnPrimary, display: "flex", alignItems: "center", gap: 6 }}>
              <UserPlus size={14} /> Add member
            </button>
          )}
        </div>
      </div>

      {!canEdit && <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 10, color: "#9AA2AB", fontSize: 12.5 }}><Lock size={12} /> View only — sign in to add or edit members.</div>}

      <div style={{ marginTop: 16, background: "#fff", border: "1px solid #E3E6EA", borderRadius: 10, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <div style={{ minWidth: 760 }}>
            <div style={{ display: "grid", gridTemplateColumns: cols, padding: "10px 16px", fontSize: 11, fontWeight: 700, color: "#55606B", textTransform: "uppercase", letterSpacing: 0.3, borderBottom: "1px solid #E3E6EA" }}>
              <div>Name</div>
              <div>Policy no.</div>
              <div>Insurer</div>
              <div>Employer</div>
              <div>Relationship</div>
              <div>Status</div>
              {canEdit && <div />}
            </div>

            {filtered.length === 0 && <div style={{ padding: 20 }}><EmptyNote text="No members match your search." /></div>}

            {filtered.map((m) => (
              <div key={m.id} style={{ display: "grid", gridTemplateColumns: cols, padding: "12px 16px", fontSize: 13, borderBottom: "1px solid #F0F1F3", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{m.name}</div>
                  {m.phone && <div style={{ fontSize: 11.5, color: "#9AA2AB", marginTop: 1 }}>{m.phone}</div>}
                  {m.dob   && <div style={{ fontSize: 11.5, color: "#9AA2AB" }}>DOB: {m.dob}</div>}
                </div>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: "#3D7EA6", fontWeight: 600 }}>{m.policyNo}</div>
                <div style={{ fontSize: 12.5 }}>{m.insurer}</div>
                <div style={{ fontSize: 12.5 }}>{m.employer}</div>
                <div style={{ color: "#55606B", fontSize: 12.5 }}>{m.role}</div>
                <div>
                  <Badge color={m.status === "Active" ? "#0E7A77" : "#C1483F"} bg={m.status === "Active" ? "#E4F3F1" : "#FBEBEA"}>{m.status}</Badge>
                </div>
                {canEdit && (
                  <div style={{ display: "flex", gap: 4 }}>
                    <button onClick={() => setEditingId(m.id)} style={{ border: "none", background: "none", color: "#3D7EA6", cursor: "pointer", padding: 4, display: "flex", borderRadius: 5 }} title="Edit">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => { if (window.confirm(`Remove ${m.name} from the members list?`)) onDelete(m.id); }} style={{ border: "none", background: "none", color: "#C1483F", cursor: "pointer", padding: 4, display: "flex", borderRadius: 5 }} title="Remove">
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {showAdd && (
        <MemberModal
          existingPolicies={existingPolicies}
          onClose={() => setShowAdd(false)}
          onSave={(f) => { onAdd(f); setShowAdd(false); }}
        />
      )}
      {editing && (
        <MemberModal
          initial={editing}
          existingPolicies={existingPolicies}
          onClose={() => setEditingId(null)}
          onSave={(f) => { onUpdate(editing.id, f); setEditingId(null); }}
        />
      )}
    </>
  );
}

// ── Login modal ────────────────────────────────────────────────────────────

function LoginModal({ users, onClose, onSuccess }: { users: StaffUser[]; onClose: () => void; onSuccess: (u: StaffUser) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");

  function submit() {
    const match = users.find((u) => u.username === username.trim() && u.password === password);
    if (match) { onSuccess(match); } else { setError("Incorrect username or password."); }
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(27,42,65,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 20 }}>
      <div style={{ background: "#fff", borderRadius: 12, width: 360, maxWidth: "90vw", padding: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontFamily: "'Spectral', serif", fontSize: 19, fontWeight: 600, margin: 0 }}>Staff sign-in</h2>
          <button onClick={onClose} style={{ border: "none", background: "none", cursor: "pointer" }}><X size={18} /></button>
        </div>
        <p style={{ fontSize: 13, color: "#55606B", marginTop: 6 }}>Sign in with your Insurance Desk credentials.</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 18 }}>
          <Field label="Username">
            <input value={username} onChange={(e) => { setUsername(e.target.value); setError(""); }} onKeyDown={(e) => e.key === "Enter" && submit()} autoFocus placeholder="e.g. fatou" style={input} />
          </Field>
          <Field label="Password">
            <PasswordInput value={password} onChange={(v) => { setPassword(v); setError(""); }} placeholder="••••••••" />
          </Field>
        </div>
        {error && <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#C1483F", fontSize: 12.5, fontWeight: 600, marginTop: 10 }}><AlertCircle size={13} />{error}</div>}
        <button onClick={submit} style={{ ...btnPrimary, marginTop: 18, width: "100%", padding: "10px 14px", fontSize: 13.5 }}>Sign in</button>
      </div>
    </div>
  );
}

// ── Manage staff panel ─────────────────────────────────────────────────────

function ManageStaffPanel({ users, onAdd, onRemove }: { users: StaffUser[]; onAdd: (u: Omit<StaffUser, "id" | "createdAt">) => void; onRemove: (id: string) => void }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ username: "", password: "", displayName: "", role: "staff" as Role });
  const [err, setErr] = useState("");
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  function submit() {
    if (!form.username.trim() || !form.password || !form.displayName.trim()) { setErr("All fields are required."); return; }
    if (users.some((u) => u.username === form.username.trim())) { setErr("Username already exists."); return; }
    onAdd({ username: form.username.trim(), password: form.password, displayName: form.displayName.trim(), role: form.role });
    setForm({ username: "", password: "", displayName: "", role: "staff" });
    setShowForm(false); setErr("");
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: "'Spectral', serif", fontSize: 26, fontWeight: 600, margin: 0 }}>Staff accounts</h1>
          <p style={{ color: "#55606B", fontSize: 14, marginTop: 4 }}>Create and manage staff who can log and update requests.</p>
        </div>
        <button onClick={() => setShowForm((s) => !s)} style={{ ...btnPrimary, display: "flex", alignItems: "center", gap: 6 }}>
          <UserPlus size={14} /> Add staff
        </button>
      </div>

      {showForm && (
        <div style={{ marginTop: 18, background: "#fff", border: "1px solid #E3E6EA", borderRadius: 10, padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#1B2A41", marginBottom: 14 }}>New staff account</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", gap: 10 }}>
              <Field label="Display name" style={{ flex: 1 }}><input value={form.displayName} onChange={set("displayName")} style={input} placeholder="e.g. Fatou Jallow" /></Field>
              <Field label="Username" style={{ flex: 1 }}><input value={form.username} onChange={set("username")} style={input} placeholder="e.g. fatou" /></Field>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <Field label="Password" style={{ flex: 1 }}><PasswordInput value={form.password} onChange={(v) => setForm((f) => ({ ...f, password: v }))} placeholder="Set a password" /></Field>
              <Field label="Role" style={{ flex: 1 }}><select value={form.role} onChange={set("role")} style={input}><option value="staff">Staff</option><option value="admin">Admin</option></select></Field>
            </div>
          </div>
          {err && <div style={{ color: "#C1483F", fontSize: 12, fontWeight: 600, marginTop: 8 }}>{err}</div>}
          <div style={{ display: "flex", gap: 8, marginTop: 14, justifyContent: "flex-end" }}>
            <button onClick={() => { setShowForm(false); setErr(""); }} style={btnSecondary}>Cancel</button>
            <button onClick={submit} style={btnPrimary}>Create account</button>
          </div>
        </div>
      )}

      <div style={{ marginTop: 18, background: "#fff", border: "1px solid #E3E6EA", borderRadius: 10, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 0.7fr 0.9fr 40px", padding: "10px 16px", fontSize: 11, fontWeight: 700, color: "#55606B", textTransform: "uppercase", letterSpacing: 0.3, borderBottom: "1px solid #E3E6EA" }}>
          <div>Name</div><div>Username</div><div>Role</div><div>Added</div><div />
        </div>
        {users.filter((u) => u.role !== "admin").length === 0 && <div style={{ padding: 20 }}><EmptyNote text="No staff accounts yet." /></div>}
        {users.filter((u) => u.role !== "admin").map((u) => (
          <div key={u.id} style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 0.7fr 0.9fr 40px", padding: "12px 16px", fontSize: 13.5, borderBottom: "1px solid #F0F1F3", alignItems: "center" }}>
            <div style={{ fontWeight: 600 }}>{u.displayName}</div>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", color: "#55606B" }}>{u.username}</div>
            <div><Badge color="#3D7EA6" bg="#EBF3F8">{u.role}</Badge></div>
            <div style={{ color: "#9AA2AB", fontSize: 12 }}>{u.createdAt}</div>
            <div><button onClick={() => onRemove(u.id)} style={{ border: "none", background: "none", color: "#C1483F", cursor: "pointer", padding: 4, display: "flex" }}><Trash2 size={14} /></button></div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Settings panel ─────────────────────────────────────────────────────────

function SettingsPanel({ hospitalName, onSave }: { hospitalName: string; onSave: (name: string) => void }) {
  const [draft, setDraft] = useState(hospitalName);
  const [saved, setSaved] = useState(false);

  function save() {
    onSave(draft.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div>
      <h1 style={{ fontFamily: "'Spectral', serif", fontSize: 26, fontWeight: 600, margin: 0 }}>Settings</h1>
      <p style={{ color: "#55606B", fontSize: 14, marginTop: 4 }}>Configure this facility's Insurance Desk instance.</p>

      <div style={{ marginTop: 24, background: "#fff", border: "1px solid #E3E6EA", borderRadius: 10, padding: 22 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#1B2A41", marginBottom: 4 }}>Facility / hospital name</div>
        <p style={{ fontSize: 12.5, color: "#55606B", margin: "0 0 14px" }}>
          This name appears in the sidebar and identifies this copy of the app. Each hospital runs its own separate instance — data never crosses between facilities.
        </p>
        <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
          <Field label="Hospital or clinic name" style={{ flex: 1 }}>
            <input value={draft} onChange={(e) => { setDraft(e.target.value); setSaved(false); }} style={input} placeholder="e.g. Royal Victoria Teaching Hospital" />
          </Field>
          <button onClick={save} style={{ ...btnPrimary, whiteSpace: "nowrap", height: 38 }}>
            {saved ? <><Check size={13} style={{ marginRight: 5 }} />Saved</> : <><Save size={13} style={{ marginRight: 5 }} />Save</>}
          </button>
        </div>
        <div style={{ marginTop: 16, padding: "12px 14px", background: "#F6F7F9", borderRadius: 8, fontSize: 12.5, color: "#55606B" }}>
          <strong style={{ color: "#1B2A41" }}>Multi-hospital isolation:</strong> Each hospital deploys and logs into its own independent instance of AfricMed Insurance Desk. There is no shared database — member records, requests, and staff accounts for one hospital are completely separate from every other facility.
        </div>
      </div>
    </div>
  );
}

// ── New request modal ──────────────────────────────────────────────────────

function NewRequestModal({ members, onClose, onSubmit }: { members: Member[]; onClose: () => void; onSubmit: (f: Omit<Request, "id" | "stage">) => void }) {
  const [form, setForm] = useState({ insurer: "", type: REQUEST_TYPES[0], memberName: "", policyNo: "", reason: "", notes: "", dateReceived: new Date().toISOString().slice(0, 10) });
  const [suggestions, setSuggestions] = useState<Member[]>([]);
  const [showSugg, setShowSugg]       = useState(false);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const needsExisting = form.type === "Remove dependent" || form.type === "Reinstate";
  const needsNew      = form.type === "Add dependent";
  const matched       = members.find((m) => m.policyNo === form.policyNo);
  const policyExists  = needsNew      && !!matched;
  const policyMissing = needsExisting && form.policyNo.length > 0 && !matched;
  const canSubmit     = !!form.memberName && !!form.policyNo && !policyExists;

  function handlePolicyChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setForm((f) => ({ ...f, policyNo: val }));
    if (needsExisting && val.length > 0) {
      const hits = members.filter((m) => m.policyNo.toLowerCase().includes(val.toLowerCase()) || m.name.toLowerCase().includes(val.toLowerCase()));
      setSuggestions(hits); setShowSugg(hits.length > 0);
    } else { setShowSugg(false); }
  }

  function pickSuggestion(m: Member) {
    setForm((f) => ({ ...f, policyNo: m.policyNo, memberName: m.name, insurer: m.insurer }));
    setShowSugg(false);
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(27,42,65,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10 }}>
      <div style={{ background: "#fff", borderRadius: 12, width: 480, maxWidth: "90vw", padding: 24, maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontFamily: "'Spectral', serif", fontSize: 19, fontWeight: 600, margin: 0 }}>Log a request</h2>
          <button onClick={onClose} style={{ border: "none", background: "none", cursor: "pointer" }}><X size={18} /></button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
          <Field label="Request type">
            <select value={form.type} onChange={(e) => { setForm((f) => ({ ...f, type: e.target.value, policyNo: "", memberName: "" })); setShowSugg(false); }} style={input}>
              {REQUEST_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Insurer (insurance company)">
            <input value={form.insurer} onChange={set("insurer")} style={input} placeholder="e.g. Sunshine Insurance" />
          </Field>

          <Field label="Policy number" style={{ position: "relative" }}>
            <input
              value={form.policyNo}
              onChange={handlePolicyChange}
              onBlur={() => setTimeout(() => setShowSugg(false), 150)}
              onFocus={() => { if (needsExisting && form.policyNo.length > 0 && suggestions.length > 0) setShowSugg(true); }}
              style={{ ...input, fontFamily: "'IBM Plex Mono', monospace", borderColor: policyMissing || policyExists ? "#C1483F" : "#D7DBE0" }}
              placeholder="e.g. GNPC/2025/B"
            />
            {showSugg && (
              <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "#fff", border: "1px solid #D7DBE0", borderRadius: 7, boxShadow: "0 4px 12px rgba(27,42,65,0.12)", zIndex: 30, marginTop: 2, overflow: "hidden" }}>
                {suggestions.map((m) => (
                  <button key={m.id} onMouseDown={() => pickSuggestion(m)} style={{ display: "block", width: "100%", textAlign: "left", padding: "9px 12px", border: "none", background: "none", borderBottom: "1px solid #F0F1F3", fontSize: 12.5, cursor: "pointer" }}>
                    <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700, color: "#3D7EA6" }}>{m.policyNo}</span>
                    <span style={{ color: "#55606B", marginLeft: 10 }}>{m.name}</span>
                    <span style={{ float: "right", fontSize: 11, fontWeight: 700, color: m.status === "Active" ? "#0E7A77" : "#C1483F" }}>{m.status}</span>
                  </button>
                ))}
              </div>
            )}
          </Field>

          {policyMissing && <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#C1483F", fontSize: 12, fontWeight: 600, marginTop: -4 }}><AlertCircle size={12} />No member found with this policy number.</div>}
          {policyExists  && <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#C1483F", fontSize: 12, fontWeight: 600, marginTop: -4 }}><AlertCircle size={12} />Policy number {form.policyNo} already exists ({matched!.name}). Use a new one.</div>}

          <Field label="Member name">
            <input value={form.memberName} onChange={set("memberName")} style={input} placeholder="e.g. Sarjo Badjie" />
          </Field>
          <Field label="Reason">
            <input value={form.reason} onChange={set("reason")} style={input} placeholder="e.g. Exceeded age limit under policy" />
          </Field>
          <Field label="Notes (optional)">
            <textarea value={form.notes} onChange={set("notes")} style={{ ...input, minHeight: 56, resize: "vertical" }} />
          </Field>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 20 }}>
          <button onClick={onClose} style={btnSecondary}>Cancel</button>
          <button disabled={!canSubmit} onClick={() => onSubmit(form)} style={{ ...btnPrimary, background: !canSubmit ? "#A9C9C7" : "#0E7A77", cursor: canSubmit ? "pointer" : "default" }}>Log request</button>
        </div>
      </div>
    </div>
  );
}

// ── Request pieces ─────────────────────────────────────────────────────────

function StatCard({ label, value, accent }: { label: string; value: number; accent?: string }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #E3E6EA", borderRadius: 10, padding: "16px 18px", flex: 1, minWidth: 140 }}>
      <div style={{ fontSize: 12, color: "#55606B", fontWeight: 600, letterSpacing: 0.3, textTransform: "uppercase" }}>{label}</div>
      <div style={{ fontFamily: "'Spectral', serif", fontSize: 32, fontWeight: 600, color: accent || "#1B2A41", marginTop: 4 }}>{value}</div>
    </div>
  );
}

function TopBar({ title, subtitle, query, setQuery, actionLabel, onAction }: { title: string; subtitle: string; query: string; setQuery: (q: string) => void; actionLabel: string | null; onAction?: () => void }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12 }}>
      <div>
        <h1 style={{ fontFamily: "'Spectral', serif", fontSize: 26, fontWeight: 600, margin: 0 }}>{title}</h1>
        <p style={{ color: "#55606B", fontSize: 14, marginTop: 4 }}>{subtitle}</p>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <div style={{ position: "relative" }}>
          <Search size={14} style={{ position: "absolute", left: 10, top: 10, color: "#9AA2AB" }} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name, policy, insurer" style={{ padding: "8px 10px 8px 30px", fontSize: 13, border: "1px solid #D7DBE0", borderRadius: 7, width: 230, fontFamily: "inherit" }} />
        </div>
        {actionLabel && (
          <button onClick={onAction} style={{ ...btnPrimary, display: "flex", alignItems: "center", gap: 6 }}>
            <Plus size={14} /> {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}

function RequestRow({ r, onClick }: { r: Request; onClick: () => void }) {
  return (
    <div onClick={onClick} style={{ background: "#fff", border: "1px solid #E3E6EA", borderRadius: 9, padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <StageRail stage={r.stage} compact />
        <div>
          <div style={{ fontWeight: 700, fontSize: 13.5 }}>
            {r.memberName}
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: "#3D7EA6", fontWeight: 600, marginLeft: 8 }}>{r.policyNo}</span>
          </div>
          <div style={{ fontSize: 12, color: "#55606B", marginTop: 1 }}>{r.type} — {r.insurer}</div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Badge color={STAGE_COLOR[r.stage]} bg="#F0F1F3">{r.stage}</Badge>
        <ChevronRight size={15} color="#9AA2AB" />
      </div>
    </div>
  );
}

function RequestDetail({ r, canEdit, onBack, onAdvance }: { r: Request; canEdit: boolean; onBack: () => void; onAdvance: () => void }) {
  const isFinal = r.stage === "Confirmed";
  return (
    <div>
      <button onClick={onBack} style={{ border: "none", background: "none", color: "#0E7A77", fontSize: 13, fontWeight: 700, padding: 0, marginBottom: 14, cursor: "pointer" }}>← Back to requests</button>
      <div style={{ background: "#fff", border: "1px solid #E3E6EA", borderRadius: 12, padding: 26 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 12, fontFamily: "'IBM Plex Mono', monospace", color: "#9AA2AB" }}>{r.id}</div>
            <h2 style={{ fontFamily: "'Spectral', serif", fontSize: 22, fontWeight: 600, margin: "4px 0" }}>{r.type} — {r.memberName}</h2>
            <div style={{ fontSize: 13, color: "#55606B" }}>
              {r.insurer} ·
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", color: "#3D7EA6", fontWeight: 600, marginLeft: 5 }}>{r.policyNo}</span>
              · received {r.dateReceived}
            </div>
          </div>
          {!isFinal && canEdit && (
            <button onClick={onAdvance} style={{ ...btnPrimary, padding: "9px 16px" }}>
              Mark as {STAGES[STAGES.indexOf(r.stage) + 1]}
            </button>
          )}
          {!isFinal && !canEdit && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#9AA2AB", fontSize: 12.5 }}><Lock size={12} /> Sign in to update</div>
          )}
        </div>
        <div style={{ marginTop: 28, padding: "18px 10px", background: "#FAFBFC", borderRadius: 10 }}><StageRail stage={r.stage} /></div>
        <div style={{ marginTop: 22 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#55606B", textTransform: "uppercase", letterSpacing: 0.3 }}>Reason</div>
          <div style={{ fontSize: 14, marginTop: 4 }}>{r.reason}</div>
        </div>
        {r.notes && (
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#55606B", textTransform: "uppercase", letterSpacing: 0.3 }}>Notes</div>
            <div style={{ fontSize: 14, marginTop: 4, color: "#3D4653" }}>{r.notes}</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main app ───────────────────────────────────────────────────────────────

export function InsuranceDesk() {
  const [users,        setUsers]        = useState<StaffUser[]>(seedUsers);
  const [requests,     setRequests]     = useState<Request[]>(seedRequests);
  const [members,      setMembers]      = useState<Member[]>(seedMembers);
  const [hospitalName, setHospitalName] = useState("");

  const [currentUser, setCurrentUser] = useState<StaffUser | null>(null);
  const [showLogin,   setShowLogin]   = useState(false);
  const [tab,         setTab]         = useState("overview");
  const [selected,    setSelected]    = useState<Request | null>(null);
  const [showNew,     setShowNew]     = useState(false);
  const [query,       setQuery]       = useState("");

  const isAdmin = currentUser?.role === "admin";
  const canEdit = !!currentUser;

  const pending         = requests.filter((r) => r.stage !== "Confirmed").length;
  const confirmedCount  = requests.filter((r) => r.stage === "Confirmed").length;
  const activeMembers   = members.filter((m) => m.status === "Active").length;
  const inactiveMembers = members.filter((m) => m.status === "Inactive").length;

  function advanceStage(reqId: string) {
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id !== reqId) return r;
        const idx  = STAGES.indexOf(r.stage);
        const next = STAGES[Math.min(idx + 1, STAGES.length - 1)];
        if (next === "Actioned" && r.type === "Remove dependent") setMembers((ms) => ms.map((m) => m.policyNo === r.policyNo ? { ...m, status: "Inactive" } : m));
        if (next === "Actioned" && r.type === "Reinstate")        setMembers((ms) => ms.map((m) => m.policyNo === r.policyNo ? { ...m, status: "Active"   } : m));
        if (next === "Actioned" && r.type === "Add dependent")    setMembers((ms) => ms.some((m) => m.policyNo === r.policyNo) ? ms : [...ms, { id: `m-${Date.now()}`, policyNo: r.policyNo, name: r.memberName, insurer: r.insurer, employer: "", role: "Dependent", status: "Active" }]);
        return { ...r, stage: next };
      })
    );
    setSelected((s) => s ? { ...s, stage: STAGES[Math.min(STAGES.indexOf(s.stage) + 1, 3)] } : s);
  }

  function addRequest(newReq: Omit<Request, "id" | "stage">) {
    setRequests((prev) => [{ ...newReq, id: `REQ-${1000 + prev.length + 1}`, stage: "Received" }, ...prev]);
    setShowNew(false);
  }

  function signOut() { setCurrentUser(null); setTab("overview"); setSelected(null); }

  const navItems = [
    { key: "overview", label: "Overview",       icon: LayoutGrid  },
    { key: "requests", label: "Requests",       icon: FileText    },
    { key: "members",  label: "Members",        icon: Users       },
    ...(isAdmin ? [
      { key: "staff",    label: "Staff accounts", icon: ShieldCheck },
      { key: "settings", label: "Settings",        icon: Settings    },
    ] : []),
  ];

  const filteredRequests = requests.filter((r) =>
    [r.memberName, r.policyNo, r.insurer].some((v) => (v ?? "").toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", display: "flex", minHeight: "100vh", background: "#F6F7F9", color: "#1B2A41" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Spectral:wght@500;600&family=IBM+Plex+Mono:wght@400;600&display=swap');
        * { box-sizing: border-box; }
        button, select, input, textarea { font-family: inherit; }
        button { cursor: pointer; }
        button:focus-visible, input:focus-visible { outline: 2px solid #0E7A77; outline-offset: 1px; }
      `}</style>

      {/* Sidebar */}
      <div style={{ width: 220, background: "#1B2A41", color: "#fff", padding: "22px 16px", flexShrink: 0, display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <div style={{ fontFamily: "'Spectral', serif", fontSize: 19, fontWeight: 600, letterSpacing: 0.2 }}>AfricMed</div>
        <div style={{ fontSize: 11.5, color: "#93A0B4", fontFamily: "'IBM Plex Mono', monospace", marginTop: 2 }}>Insurance Desk</div>
        {hospitalName && (
          <div style={{ marginTop: 8, padding: "6px 10px", background: "rgba(255,255,255,0.07)", borderRadius: 6, fontSize: 12, color: "#C8D0DC", fontWeight: 600 }}>
            {hospitalName}
          </div>
        )}

        <div style={{ marginTop: 30, display: "flex", flexDirection: "column", gap: 2 }}>
          {navItems.map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => { setTab(key); setQuery(""); setSelected(null); }} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: 7, border: "none", background: tab === key ? "rgba(255,255,255,0.12)" : "transparent", color: tab === key ? "#fff" : "#B8C1CE", fontSize: 13.5, fontWeight: 600, textAlign: "left" }}>
              <Icon size={16} />{label}
            </button>
          ))}
        </div>

        {pending > 0 && (
          <div style={{ marginTop: 28, padding: "10px 12px", background: "rgba(227,153,58,0.15)", borderRadius: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#E3993A", fontSize: 12, fontWeight: 700 }}><AlertCircle size={13} /> {pending} open</div>
            <div style={{ fontSize: 11.5, color: "#B8C1CE", marginTop: 3 }}>request{pending !== 1 ? "s" : ""} awaiting action</div>
          </div>
        )}

        <div style={{ marginTop: "auto", paddingTop: 24 }}>
          {currentUser ? (
            <div style={{ padding: "10px 12px", background: "rgba(14,122,119,0.18)", borderRadius: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#6FD6D1", fontSize: 12, fontWeight: 700 }}><Unlock size={13} />{currentUser.displayName}</div>
              <div style={{ fontSize: 11, color: "#93A0B4", marginTop: 2 }}>{currentUser.role === "admin" ? "Administrator" : "Staff"}</div>
              <button onClick={signOut} style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 8, border: "none", background: "none", color: "#B8C1CE", fontSize: 11.5, fontWeight: 600, padding: 0 }}>
                <LogOut size={12} /> Sign out
              </button>
            </div>
          ) : (
            <button onClick={() => setShowLogin(true)} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", border: "1px solid rgba(255,255,255,0.15)", background: "transparent", color: "#B8C1CE", borderRadius: 8, padding: "9px 12px", fontSize: 12.5, fontWeight: 600 }}>
              <Lock size={13} /> Staff sign-in
            </button>
          )}
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: "26px 34px", maxWidth: 1100, overflowY: "auto" }}>

        {tab === "overview" && (
          <>
            <h1 style={{ fontFamily: "'Spectral', serif", fontSize: 26, fontWeight: 600, margin: 0 }}>Overview</h1>
            <p style={{ color: "#55606B", fontSize: 14, marginTop: 4 }}>Every add, remove, and update instruction from insurance providers, tracked in one place.</p>
            <div style={{ display: "flex", gap: 14, marginTop: 22, flexWrap: "wrap" }}>
              <StatCard label="Open requests"  value={pending}         accent="#E3993A" />
              <StatCard label="Confirmed"      value={confirmedCount}  accent="#0E7A77" />
              <StatCard label="Active members" value={activeMembers}   accent="#1B2A41" />
              <StatCard label="Deactivated"    value={inactiveMembers} accent="#C1483F" />
            </div>
            <div style={{ marginTop: 30 }}>
              <h2 style={{ fontSize: 14, fontWeight: 700, color: "#55606B", textTransform: "uppercase", letterSpacing: 0.4 }}>Requests in progress</h2>
              <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
                {requests.filter((r) => r.stage !== "Confirmed").length === 0 && <EmptyNote text="Nothing open." />}
                {requests.filter((r) => r.stage !== "Confirmed").map((r) => <RequestRow key={r.id} r={r} onClick={() => { setSelected(r); setTab("requests"); }} />)}
              </div>
            </div>
          </>
        )}

        {tab === "requests" && !selected && (
          <>
            <TopBar title="Requests" subtitle="Instructions received from insurance providers by email or message." query={query} setQuery={setQuery} actionLabel={canEdit ? "Log request" : null} onAction={() => setShowNew(true)} />
            {!canEdit && <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 10, color: "#9AA2AB", fontSize: 12.5 }}><Lock size={12} /> View only — sign in to log or update requests.</div>}
            <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
              {filteredRequests.length === 0 && <EmptyNote text="No requests match." />}
              {filteredRequests.map((r) => <RequestRow key={r.id} r={r} onClick={() => setSelected(r)} />)}
            </div>
          </>
        )}

        {tab === "requests" && selected && (
          <RequestDetail r={selected} canEdit={canEdit} onBack={() => setSelected(null)} onAdvance={() => advanceStage(selected.id)} />
        )}

        {tab === "members" && (
          <MembersTab
            members={members}
            canEdit={canEdit}
            query={query}
            setQuery={setQuery}
            onAdd={(f) => setMembers((prev) => [...prev, { ...f, id: `m-${Date.now()}` }])}
            onUpdate={(id, f) => setMembers((prev) => prev.map((m) => m.id === id ? { ...m, ...f } : m))}
            onDelete={(id) => setMembers((prev) => prev.filter((m) => m.id !== id))}
          />
        )}

        {tab === "staff" && isAdmin && (
          <ManageStaffPanel
            users={users}
            onAdd={(u) => setUsers((prev) => [...prev, { ...u, id: `u-${Date.now()}`, createdAt: new Date().toISOString().slice(0, 10) }])}
            onRemove={(id) => setUsers((prev) => prev.filter((u) => u.id !== id))}
          />
        )}

        {tab === "settings" && isAdmin && (
          <SettingsPanel hospitalName={hospitalName} onSave={setHospitalName} />
        )}
      </div>

      {showNew   && <NewRequestModal members={members} onClose={() => setShowNew(false)} onSubmit={addRequest} />}
      {showLogin && <LoginModal users={users} onClose={() => setShowLogin(false)} onSuccess={(u) => { setCurrentUser(u); setShowLogin(false); }} />}
    </div>
  );
}
