import React, { useState } from "react";
import {
  Plus, Search, Check, FileText, Users, LayoutGrid, X,
  AlertCircle, ChevronRight, Lock, Unlock, LogOut, ShieldCheck, Eye, EyeOff, UserPlus, Trash2
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────

type Role = "admin" | "staff";
type StaffUser = { id: string; username: string; password: string; displayName: string; role: Role; createdAt: string };
type Member   = { id: string; name: string; company: string; role: string; status: string };
type Request  = { id: string; company: string; type: string; memberName: string; memberId: string; reason: string; dateReceived: string; stage: string; notes: string };

// ── Seed data ──────────────────────────────────────────────────────────────

const seedUsers: StaffUser[] = [
  { id: "u-1", username: "admin",   password: "admin123",  displayName: "Administrator", role: "admin", createdAt: "2025-01-01" },
  { id: "u-2", username: "fatou",   password: "desk2025",  displayName: "Fatou Jallow",  role: "staff", createdAt: "2025-03-12" },
];

const seedMembers: Member[] = [
  { id: "2025/B", name: "Sarjo Badjie",       company: "GNPC", role: "Dependent", status: "Active" },
  { id: "2154/B", name: "Asmaw K. Sanyang",   company: "GNPC", role: "Dependent", status: "Active" },
  { id: "1180/P", name: "Momodou Ceesay",     company: "GNPC", role: "Principal", status: "Active" },
];

const seedRequests: Request[] = [
  { id: "REQ-1001", company: "GNPC", type: "Remove dependent", memberName: "Sarjo Badjie",     memberId: "2025/B", reason: "Exceeded age limit under policy", dateReceived: new Date().toISOString().slice(0, 10), stage: "Received", notes: "Formal letter to follow. Email treated as authorization." },
  { id: "REQ-1002", company: "GNPC", type: "Remove dependent", memberName: "Asmaw K. Sanyang", memberId: "2154/B", reason: "Exceeded age limit under policy", dateReceived: new Date().toISOString().slice(0, 10), stage: "Received", notes: "Formal letter to follow. Email treated as authorization." },
];

// ── Constants ──────────────────────────────────────────────────────────────

const STAGES       = ["Received", "Reviewed", "Actioned", "Confirmed"];
const REQUEST_TYPES = ["Add dependent", "Remove dependent", "Update details", "Reinstate"];
const STAGE_COLOR: Record<string, string> = {
  Received: "#E3993A", Reviewed: "#3D7EA6", Actioned: "#0E7A77", Confirmed: "#55606B",
};

// ── Shared styles ──────────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  padding: "8px 10px", fontSize: 13.5, border: "1px solid #D7DBE0",
  borderRadius: 7, fontFamily: "inherit", color: "#1B2A41", background: "#fff", width: "100%",
};

// ── Tiny atoms ─────────────────────────────────────────────────────────────

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
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        style={{ ...inputStyle, paddingRight: 36 }}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        style={{ position: "absolute", right: 9, top: "50%", transform: "translateY(-50%)", border: "none", background: "none", color: "#9AA2AB", cursor: "pointer", padding: 0, display: "flex" }}
      >
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

// ── Login modal ────────────────────────────────────────────────────────────

function LoginModal({ users, onClose, onSuccess }: { users: StaffUser[]; onClose: () => void; onSuccess: (u: StaffUser) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");

  function submit() {
    const match = users.find((u) => u.username === username.trim() && u.password === password);
    if (match) { onSuccess(match); }
    else { setError("Incorrect username or password."); }
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
            <input
              value={username}
              onChange={(e) => { setUsername(e.target.value); setError(""); }}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              autoFocus
              placeholder="e.g. fatou"
              style={inputStyle}
            />
          </Field>
          <Field label="Password">
            <PasswordInput value={password} onChange={(v) => { setPassword(v); setError(""); }} placeholder="••••••••" />
          </Field>
        </div>

        {error && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#C1483F", fontSize: 12.5, fontWeight: 600, marginTop: 10 }}>
            <AlertCircle size={13} /> {error}
          </div>
        )}

        <button
          onClick={submit}
          style={{ marginTop: 18, width: "100%", border: "none", background: "#0E7A77", color: "#fff", borderRadius: 7, padding: "10px 14px", fontSize: 13.5, fontWeight: 700, cursor: "pointer" }}
        >
          Sign in
        </button>
      </div>
    </div>
  );
}

// ── Admin: manage staff panel ──────────────────────────────────────────────

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
    setShowForm(false);
    setErr("");
  }

  const staffOnly = users.filter((u) => u.role !== "admin");

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: "'Spectral', serif", fontSize: 26, fontWeight: 600, margin: 0 }}>Staff accounts</h1>
          <p style={{ color: "#55606B", fontSize: 14, marginTop: 4 }}>Create and manage staff who can log and update requests.</p>
        </div>
        <button
          onClick={() => setShowForm((s) => !s)}
          style={{ display: "flex", alignItems: "center", gap: 6, background: "#0E7A77", color: "#fff", border: "none", borderRadius: 7, padding: "8px 14px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}
        >
          <UserPlus size={14} /> Add staff
        </button>
      </div>

      {showForm && (
        <div style={{ marginTop: 18, background: "#fff", border: "1px solid #E3E6EA", borderRadius: 10, padding: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#1B2A41", marginBottom: 14 }}>New staff account</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", gap: 10 }}>
              <Field label="Display name" style={{ flex: 1 }}>
                <input value={form.displayName} onChange={set("displayName")} style={inputStyle} placeholder="e.g. Fatou Jallow" />
              </Field>
              <Field label="Username" style={{ flex: 1 }}>
                <input value={form.username} onChange={set("username")} style={inputStyle} placeholder="e.g. fatou" />
              </Field>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <Field label="Password" style={{ flex: 1 }}>
                <PasswordInput value={form.password} onChange={(v) => setForm((f) => ({ ...f, password: v }))} placeholder="Set a password" />
              </Field>
              <Field label="Role" style={{ flex: 1 }}>
                <select value={form.role} onChange={set("role")} style={inputStyle}>
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                </select>
              </Field>
            </div>
          </div>
          {err && <div style={{ color: "#C1483F", fontSize: 12, fontWeight: 600, marginTop: 8 }}>{err}</div>}
          <div style={{ display: "flex", gap: 8, marginTop: 14, justifyContent: "flex-end" }}>
            <button onClick={() => { setShowForm(false); setErr(""); }} style={{ border: "1px solid #D7DBE0", background: "#fff", borderRadius: 7, padding: "7px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
            <button onClick={submit} style={{ border: "none", background: "#0E7A77", color: "#fff", borderRadius: 7, padding: "7px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Create account</button>
          </div>
        </div>
      )}

      <div style={{ marginTop: 18, background: "#fff", border: "1px solid #E3E6EA", borderRadius: 10, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 0.7fr 0.9fr 40px", padding: "10px 16px", fontSize: 11, fontWeight: 700, color: "#55606B", textTransform: "uppercase", letterSpacing: 0.3, borderBottom: "1px solid #E3E6EA" }}>
          <div>Name</div><div>Username</div><div>Role</div><div>Added</div><div />
        </div>
        {staffOnly.length === 0 && <div style={{ padding: 20 }}><EmptyNote text="No staff accounts yet. Add one above." /></div>}
        {staffOnly.map((u) => (
          <div key={u.id} style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 0.7fr 0.9fr 40px", padding: "12px 16px", fontSize: 13.5, borderBottom: "1px solid #F0F1F3", alignItems: "center" }}>
            <div style={{ fontWeight: 600 }}>{u.displayName}</div>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", color: "#55606B" }}>{u.username}</div>
            <div><Badge color="#3D7EA6" bg="#EBF3F8">{u.role}</Badge></div>
            <div style={{ color: "#9AA2AB", fontSize: 12 }}>{u.createdAt}</div>
            <div>
              <button onClick={() => onRemove(u.id)} style={{ border: "none", background: "none", color: "#C1483F", cursor: "pointer", padding: 4, display: "flex" }}>
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── New request modal ──────────────────────────────────────────────────────

function NewRequestModal({ members, onClose, onSubmit }: { members: Member[]; onClose: () => void; onSubmit: (f: Omit<Request, "id" | "stage">) => void }) {
  const [form, setForm] = useState({ company: "GNPC", type: REQUEST_TYPES[0], memberName: "", memberId: "", reason: "", notes: "", dateReceived: new Date().toISOString().slice(0, 10) });
  const [idSuggestions, setIdSuggestions] = useState<Member[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const needsExisting = form.type === "Remove dependent" || form.type === "Reinstate";
  const needsNew      = form.type === "Add dependent";
  const matched       = members.find((m) => m.id === form.memberId);
  const idExists      = needsNew      && !!matched;
  const idMissing     = needsExisting && form.memberId.length > 0 && !matched;
  const canSubmit     = !!form.memberName && !!form.memberId && !idExists;

  function handleIdChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setForm((f) => ({ ...f, memberId: val }));
    if (needsExisting && val.length > 0) {
      const hits = members.filter((m) => m.id.toLowerCase().includes(val.toLowerCase()) || m.name.toLowerCase().includes(val.toLowerCase()));
      setIdSuggestions(hits);
      setShowSuggestions(hits.length > 0);
    } else { setShowSuggestions(false); }
  }

  function pickSuggestion(m: Member) {
    setForm((f) => ({ ...f, memberId: m.id, memberName: m.name, company: m.company }));
    setShowSuggestions(false);
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(27,42,65,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10 }}>
      <div style={{ background: "#fff", borderRadius: 12, width: 460, maxWidth: "90vw", padding: 24, maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontFamily: "'Spectral', serif", fontSize: 19, fontWeight: 600, margin: 0 }}>Log a request</h2>
          <button onClick={onClose} style={{ border: "none", background: "none", cursor: "pointer" }}><X size={18} /></button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
          <Field label="Request type">
            <select value={form.type} onChange={(e) => { setForm((f) => ({ ...f, type: e.target.value, memberId: "", memberName: "" })); setShowSuggestions(false); }} style={inputStyle}>
              {REQUEST_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Insurance company">
            <input value={form.company} onChange={set("company")} style={inputStyle} />
          </Field>
          <div style={{ display: "flex", gap: 10 }}>
            <Field label="Member name" style={{ flex: 1 }}>
              <input value={form.memberName} onChange={set("memberName")} style={inputStyle} placeholder="e.g. Sarjo Badjie" />
            </Field>
            <Field label="Member ID" style={{ flex: 1, position: "relative" }}>
              <input
                value={form.memberId}
                onChange={handleIdChange}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                onFocus={() => { if (needsExisting && form.memberId.length > 0 && idSuggestions.length > 0) setShowSuggestions(true); }}
                style={{ ...inputStyle, borderColor: idMissing || idExists ? "#C1483F" : "#D7DBE0" }}
                placeholder="e.g. 2025/B"
              />
              {showSuggestions && (
                <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "#fff", border: "1px solid #D7DBE0", borderRadius: 7, boxShadow: "0 4px 12px rgba(27,42,65,0.12)", zIndex: 30, marginTop: 2, overflow: "hidden" }}>
                  {idSuggestions.map((m) => (
                    <button key={m.id} onMouseDown={() => pickSuggestion(m)} style={{ display: "block", width: "100%", textAlign: "left", padding: "9px 12px", border: "none", background: "none", borderBottom: "1px solid #F0F1F3", fontSize: 12.5, cursor: "pointer" }}>
                      <span style={{ fontWeight: 700 }}>{m.id}</span>
                      <span style={{ color: "#55606B", marginLeft: 8 }}>{m.name}</span>
                      <span style={{ float: "right", fontSize: 11, fontWeight: 700, color: m.status === "Active" ? "#0E7A77" : "#C1483F" }}>{m.status}</span>
                    </button>
                  ))}
                </div>
              )}
            </Field>
          </div>
          {idMissing && <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#C1483F", fontSize: 12, fontWeight: 600, marginTop: -4 }}><AlertCircle size={12} />No member with this ID — check the Members list.</div>}
          {idExists  && <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#C1483F", fontSize: 12, fontWeight: 600, marginTop: -4 }}><AlertCircle size={12} />ID {form.memberId} already exists ({matched!.name}). Use a new ID.</div>}
          <Field label="Reason">
            <input value={form.reason} onChange={set("reason")} style={inputStyle} placeholder="e.g. Exceeded age limit under policy" />
          </Field>
          <Field label="Notes (optional)">
            <textarea value={form.notes} onChange={set("notes")} style={{ ...inputStyle, minHeight: 56, resize: "vertical" }} />
          </Field>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 20 }}>
          <button onClick={onClose} style={{ border: "1px solid #D7DBE0", background: "#fff", borderRadius: 7, padding: "8px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
          <button disabled={!canSubmit} onClick={() => onSubmit(form)} style={{ border: "none", background: !canSubmit ? "#A9C9C7" : "#0E7A77", color: "#fff", borderRadius: 7, padding: "8px 16px", fontSize: 13, fontWeight: 700, cursor: canSubmit ? "pointer" : "default" }}>Log request</button>
        </div>
      </div>
    </div>
  );
}

// ── Supporting pieces ──────────────────────────────────────────────────────

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
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name, ID, company" style={{ padding: "8px 10px 8px 30px", fontSize: 13, border: "1px solid #D7DBE0", borderRadius: 7, width: 220, fontFamily: "inherit" }} />
        </div>
        {actionLabel && (
          <button onClick={onAction} style={{ display: "flex", alignItems: "center", gap: 6, background: "#0E7A77", color: "#fff", border: "none", borderRadius: 7, padding: "8px 14px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
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
          <div style={{ fontWeight: 700, fontSize: 13.5 }}>{r.memberName} <span style={{ color: "#9AA2AB", fontWeight: 500 }}>· {r.memberId}</span></div>
          <div style={{ fontSize: 12, color: "#55606B", marginTop: 1 }}>{r.type} — {r.company}</div>
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
            <div style={{ fontSize: 13, color: "#55606B" }}>{r.company} · Member ID {r.memberId} · received {r.dateReceived}</div>
          </div>
          {!isFinal && canEdit && (
            <button onClick={onAdvance} style={{ background: "#0E7A77", color: "#fff", border: "none", borderRadius: 7, padding: "9px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
              Mark as {STAGES[STAGES.indexOf(r.stage) + 1]}
            </button>
          )}
          {!isFinal && !canEdit && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#9AA2AB", fontSize: 12.5 }}>
              <Lock size={12} /> Sign in to update
            </div>
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
  const [users,    setUsers]    = useState<StaffUser[]>(seedUsers);
  const [requests, setRequests] = useState<Request[]>(seedRequests);
  const [members,  setMembers]  = useState<Member[]>(seedMembers);

  const [currentUser, setCurrentUser] = useState<StaffUser | null>(null);
  const [showLogin,   setShowLogin]   = useState(false);
  const [tab,         setTab]         = useState("overview");
  const [selected,    setSelected]    = useState<Request | null>(null);
  const [showNew,     setShowNew]     = useState(false);
  const [query,       setQuery]       = useState("");

  const isAdmin = currentUser?.role === "admin";
  const canEdit = !!currentUser;

  const pending          = requests.filter((r) => r.stage !== "Confirmed").length;
  const confirmedCount   = requests.filter((r) => r.stage === "Confirmed").length;
  const activeMembers    = members.filter((m) => m.status === "Active").length;
  const inactiveMembers  = members.filter((m) => m.status === "Inactive").length;

  function advanceStage(reqId: string) {
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id !== reqId) return r;
        const idx  = STAGES.indexOf(r.stage);
        const next = STAGES[Math.min(idx + 1, STAGES.length - 1)];
        if (next === "Actioned" && r.type === "Remove dependent") setMembers((ms) => ms.map((m) => m.id === r.memberId ? { ...m, status: "Inactive" } : m));
        if (next === "Actioned" && r.type === "Reinstate")        setMembers((ms) => ms.map((m) => m.id === r.memberId ? { ...m, status: "Active"   } : m));
        if (next === "Actioned" && r.type === "Add dependent")    setMembers((ms) => ms.some((m) => m.id === r.memberId) ? ms : [...ms, { id: r.memberId, name: r.memberName, company: r.company, role: "Dependent", status: "Active" }]);
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
    { key: "overview",  label: "Overview",  icon: LayoutGrid },
    { key: "requests",  label: "Requests",  icon: FileText   },
    { key: "members",   label: "Members",   icon: Users      },
    ...(isAdmin ? [{ key: "staff", label: "Staff accounts", icon: ShieldCheck }] : []),
  ];

  const filteredRequests = requests.filter((r) =>
    [r.memberName, r.memberId, r.company].some((v) => v.toLowerCase().includes(query.toLowerCase()))
  );
  const filteredMembers = members.filter((m) =>
    [m.name, m.id, m.company].some((v) => v.toLowerCase().includes(query.toLowerCase()))
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
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#6FD6D1", fontSize: 12, fontWeight: 700 }}>
                <Unlock size={13} /> {currentUser.displayName}
              </div>
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

      {/* Main content */}
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
          <>
            <TopBar title="Members" subtitle="Principals and dependents covered under insurance policies." query={query} setQuery={setQuery} actionLabel={null} />
            <div style={{ marginTop: 16, background: "#fff", border: "1px solid #E3E6EA", borderRadius: 10, overflow: "hidden" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr 1fr 0.8fr", padding: "10px 16px", fontSize: 11, fontWeight: 700, color: "#55606B", textTransform: "uppercase", letterSpacing: 0.3, borderBottom: "1px solid #E3E6EA" }}>
                <div>Name</div><div>ID</div><div>Company</div><div>Role</div><div>Status</div>
              </div>
              {filteredMembers.length === 0 && <div style={{ padding: 20 }}><EmptyNote text="No members match your search." /></div>}
              {filteredMembers.map((m) => (
                <div key={m.id} style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr 1fr 0.8fr", padding: "12px 16px", fontSize: 13.5, borderBottom: "1px solid #F0F1F3", alignItems: "center" }}>
                  <div style={{ fontWeight: 600 }}>{m.name}</div>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", color: "#55606B" }}>{m.id}</div>
                  <div>{m.company}</div>
                  <div style={{ color: "#55606B" }}>{m.role}</div>
                  <div><Badge color={m.status === "Active" ? "#0E7A77" : "#C1483F"} bg={m.status === "Active" ? "#E4F3F1" : "#FBEBEA"}>{m.status}</Badge></div>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === "staff" && isAdmin && (
          <ManageStaffPanel
            users={users}
            onAdd={(u) => setUsers((prev) => [...prev, { ...u, id: `u-${Date.now()}`, createdAt: new Date().toISOString().slice(0, 10) }])}
            onRemove={(id) => setUsers((prev) => prev.filter((u) => u.id !== id))}
          />
        )}
      </div>

      {showNew   && <NewRequestModal members={members} onClose={() => setShowNew(false)} onSubmit={addRequest} />}
      {showLogin && <LoginModal users={users} onClose={() => setShowLogin(false)} onSuccess={(u) => { setCurrentUser(u); setShowLogin(false); }} />}
    </div>
  );
}
