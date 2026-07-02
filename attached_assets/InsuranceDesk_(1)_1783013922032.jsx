import React, { useState, useEffect } from "react";
import { Plus, Search, Check, FileText, Users, LayoutGrid, X, AlertCircle, ChevronRight, Lock, Unlock, LogOut } from "lucide-react";

// ---- constants -------------------------------------------------------

// Staff who handle insurance instructions sign in with this PIN to unlock
// editing. Everyone else in the hospital can open the app and view
// requests/members, but cannot log or change anything.
// Change this to whatever your team wants to use.
const STAFF_PIN = "2580";

const STAGES = ["Received", "Reviewed", "Actioned", "Confirmed"];

const REQUEST_TYPES = ["Add dependent", "Remove dependent", "Update details", "Reinstate"];

const STAGE_COLOR = {
  Received: "#E3993A",
  Reviewed: "#3D7EA6",
  Actioned: "#0E7A77",
  Confirmed: "#55606B",
};

const seedMembers = [
  { id: "2025/B", name: "Sarjo Badjie", company: "GNPC", role: "Dependent", status: "Active" },
  { id: "2154/B", name: "Asmaw K. Sanyang", company: "GNPC", role: "Dependent", status: "Active" },
  { id: "1180/P", name: "Momodou Ceesay", company: "GNPC", role: "Principal", status: "Active" },
];

const seedRequests = [
  {
    id: "REQ-1001",
    company: "GNPC",
    type: "Remove dependent",
    memberName: "Sarjo Badjie",
    memberId: "2025/B",
    reason: "Exceeded age limit under policy",
    dateReceived: new Date().toISOString().slice(0, 10),
    stage: "Received",
    notes: "Formal letter to follow. Email treated as authorization.",
  },
  {
    id: "REQ-1002",
    company: "GNPC",
    type: "Remove dependent",
    memberName: "Asmaw K. Sanyang",
    memberId: "2154/B",
    reason: "Exceeded age limit under policy",
    dateReceived: new Date().toISOString().slice(0, 10),
    stage: "Received",
    notes: "Formal letter to follow. Email treated as authorization.",
  },
];

// ---- storage helpers ---------------------------------------------------

async function loadCollection(key, seed) {
  try {
    const res = await window.storage.get(key, true);
    return res ? JSON.parse(res.value) : seed;
  } catch {
    return seed;
  }
}

async function saveCollection(key, value) {
  try {
    await window.storage.set(key, JSON.stringify(value), true);
  } catch (e) {
    console.error("Storage error", e);
  }
}

// ---- small UI atoms ------------------------------------------------------

function StageRail({ stage, compact }) {
  const idx = STAGES.indexOf(stage);
  if (compact) {
    return (
      <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
        {STAGES.map((s, i) => (
          <div
            key={s}
            title={s}
            style={{
              width: 8,
              height: 8,
              borderRadius: 99,
              background: i <= idx ? STAGE_COLOR[stage] : "#E3E6EA",
            }}
          />
        ))}
      </div>
    );
  }
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {STAGES.map((s, i) => (
        <React.Fragment key={s}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 74 }}>
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: 99,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: i <= idx ? STAGE_COLOR[s] : "#fff",
                border: `2px solid ${i <= idx ? STAGE_COLOR[s] : "#D7DBE0"}`,
                color: i <= idx ? "#fff" : "#9AA2AB",
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              {i < idx ? <Check size={13} /> : i + 1}
            </div>
            <span
              style={{
                marginTop: 6,
                fontSize: 11,
                fontFamily: "'IBM Plex Mono', monospace",
                color: i <= idx ? "#1B2A41" : "#9AA2AB",
                letterSpacing: 0.2,
              }}
            >
              {s}
            </span>
          </div>
          {i < STAGES.length - 1 && (
            <div style={{ flex: 1, height: 2, background: i < idx ? STAGE_COLOR[s] : "#E3E6EA", marginBottom: 18 }} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

function StatCard({ label, value, accent }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #E3E6EA",
        borderRadius: 10,
        padding: "16px 18px",
        flex: 1,
        minWidth: 140,
      }}
    >
      <div style={{ fontSize: 12, color: "#55606B", fontWeight: 600, letterSpacing: 0.3, textTransform: "uppercase" }}>
        {label}
      </div>
      <div style={{ fontFamily: "'Spectral', serif", fontSize: 32, fontWeight: 600, color: accent || "#1B2A41", marginTop: 4 }}>
        {value}
      </div>
    </div>
  );
}

function Badge({ children, color = "#55606B", bg = "#F0F1F3" }) {
  return (
    <span
      style={{
        display: "inline-block",
        fontSize: 11,
        fontWeight: 700,
        color,
        background: bg,
        borderRadius: 5,
        padding: "3px 8px",
        letterSpacing: 0.2,
      }}
    >
      {children}
    </span>
  );
}

function StaffSignInModal({ onClose, onSuccess }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  function submit() {
    if (pin === STAFF_PIN) {
      onSuccess();
    } else {
      setError(true);
    }
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(27,42,65,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 20 }}>
      <div style={{ background: "#fff", borderRadius: 12, width: 340, maxWidth: "90vw", padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontFamily: "'Spectral', serif", fontSize: 18, fontWeight: 600, margin: 0 }}>Staff sign-in</h2>
          <button onClick={onClose} style={{ border: "none", background: "none" }}><X size={18} /></button>
        </div>
        <p style={{ fontSize: 13, color: "#55606B", marginTop: 8 }}>
          Enter the Insurance Desk PIN to log requests and update member status.
        </p>
        <input
          type="password"
          autoFocus
          value={pin}
          onChange={(e) => { setPin(e.target.value); setError(false); }}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="PIN"
          style={{ ...inputStyle, marginTop: 14, width: "100%", letterSpacing: 3, fontSize: 16, textAlign: "center" }}
        />
        {error && (
          <div style={{ color: "#C1483F", fontSize: 12.5, marginTop: 8, fontWeight: 600 }}>
            Incorrect PIN. Try again.
          </div>
        )}
        <button
          onClick={submit}
          style={{ marginTop: 16, width: "100%", border: "none", background: "#0E7A77", color: "#fff", borderRadius: 7, padding: "10px 14px", fontSize: 13.5, fontWeight: 700 }}
        >
          Sign in
        </button>
      </div>
    </div>
  );
}

// ---- main app -------------------------------------------------------------

export default function InsuranceDesk() {
  const [tab, setTab] = useState("overview");
  const [requests, setRequests] = useState([]);
  const [members, setMembers] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [selected, setSelected] = useState(null);
  const [showNewRequest, setShowNewRequest] = useState(false);
  const [query, setQuery] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);

  useEffect(() => {
    (async () => {
      const [r, m] = await Promise.all([
        loadCollection("insurance-desk-requests", seedRequests),
        loadCollection("insurance-desk-members", seedMembers),
      ]);
      setRequests(r);
      setMembers(m);
      setLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (loaded) saveCollection("insurance-desk-requests", requests);
  }, [requests, loaded]);

  useEffect(() => {
    if (loaded) saveCollection("insurance-desk-members", members);
  }, [members, loaded]);

  const pending = requests.filter((r) => r.stage !== "Confirmed").length;
  const confirmedThisWeek = requests.filter((r) => r.stage === "Confirmed").length;
  const activeMembers = members.filter((m) => m.status === "Active").length;
  const inactiveMembers = members.filter((m) => m.status === "Inactive").length;

  function advanceStage(reqId) {
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id !== reqId) return r;
        const idx = STAGES.indexOf(r.stage);
        const next = STAGES[Math.min(idx + 1, STAGES.length - 1)];
        if (next === "Actioned" && r.type === "Remove dependent") {
          setMembers((ms) =>
            ms.map((m) => (m.id === r.memberId ? { ...m, status: "Inactive" } : m))
          );
        }
        if (next === "Actioned" && r.type === "Reinstate") {
          setMembers((ms) =>
            ms.map((m) => (m.id === r.memberId ? { ...m, status: "Active" } : m))
          );
        }
        if (next === "Actioned" && r.type === "Add dependent") {
          setMembers((ms) => {
            if (ms.some((m) => m.id === r.memberId)) return ms;
            return [...ms, {
              id: r.memberId,
              name: r.memberName,
              company: r.company,
              role: "Dependent",
              status: "Active",
            }];
          });
        }
        return { ...r, stage: next };
      })
    );
    setSelected((s) => (s ? { ...s, stage: STAGES[Math.min(STAGES.indexOf(s.stage) + 1, 3)] } : s));
  }

  function addRequest(newReq) {
    setRequests((prev) => [{ ...newReq, id: `REQ-${1000 + prev.length + 1}`, stage: "Received" }, ...prev]);
    setShowNewRequest(false);
  }

  const filteredRequests = requests.filter(
    (r) =>
      r.memberName.toLowerCase().includes(query.toLowerCase()) ||
      r.memberId.toLowerCase().includes(query.toLowerCase()) ||
      r.company.toLowerCase().includes(query.toLowerCase())
  );

  const filteredMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(query.toLowerCase()) ||
      m.id.toLowerCase().includes(query.toLowerCase()) ||
      m.company.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div
      style={{
        fontFamily: "'Inter', sans-serif",
        display: "flex",
        minHeight: "100vh",
        background: "#F6F7F9",
        color: "#1B2A41",
      }}
    >
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Spectral:wght@500;600&family=IBM+Plex+Mono:wght@400;600&display=swap');
        * { box-sizing: border-box; }
        button { font-family: inherit; cursor: pointer; }
        button:focus-visible, input:focus-visible { outline: 2px solid #0E7A77; outline-offset: 1px; }
      `}</style>

      {/* Sidebar */}
      <div style={{ width: 220, background: "#1B2A41", color: "#fff", padding: "22px 16px", flexShrink: 0, display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <div style={{ fontFamily: "'Spectral', serif", fontSize: 19, fontWeight: 600, letterSpacing: 0.2 }}>
          AfricMed
        </div>
        <div style={{ fontSize: 11.5, color: "#93A0B4", fontFamily: "'IBM Plex Mono', monospace", marginTop: 2 }}>
          Insurance Desk
        </div>

        <div style={{ marginTop: 30, display: "flex", flexDirection: "column", gap: 2 }}>
          {[
            { key: "overview", label: "Overview", icon: LayoutGrid },
            { key: "requests", label: "Requests", icon: FileText },
            { key: "members", label: "Members", icon: Users },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => { setTab(key); setQuery(""); setSelected(null); }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "9px 10px",
                borderRadius: 7,
                border: "none",
                background: tab === key ? "rgba(255,255,255,0.12)" : "transparent",
                color: tab === key ? "#fff" : "#B8C1CE",
                fontSize: 13.5,
                fontWeight: 600,
                textAlign: "left",
              }}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>

        {pending > 0 && (
          <div style={{ marginTop: 28, padding: "10px 12px", background: "rgba(227,153,58,0.15)", borderRadius: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#E3993A", fontSize: 12, fontWeight: 700 }}>
              <AlertCircle size={13} /> {pending} open
            </div>
            <div style={{ fontSize: 11.5, color: "#B8C1CE", marginTop: 3 }}>
              request{pending !== 1 ? "s" : ""} awaiting action
            </div>
          </div>
        )}

        <div style={{ marginTop: "auto", paddingTop: 24 }}>
          {editMode ? (
            <div style={{ padding: "10px 12px", background: "rgba(14,122,119,0.18)", borderRadius: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#6FD6D1", fontSize: 12, fontWeight: 700 }}>
                <Unlock size={13} /> Editing unlocked
              </div>
              <button
                onClick={() => setEditMode(false)}
                style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 6, border: "none", background: "none", color: "#B8C1CE", fontSize: 11.5, fontWeight: 600, padding: 0 }}
              >
                <LogOut size={12} /> Sign out
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowSignIn(true)}
              style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", border: "1px solid rgba(255,255,255,0.15)", background: "transparent", color: "#B8C1CE", borderRadius: 8, padding: "9px 12px", fontSize: 12.5, fontWeight: 600 }}
            >
              <Lock size={13} /> Staff sign-in to edit
            </button>
          )}
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: "26px 34px", maxWidth: 1100 }}>
        {tab === "overview" && (
          <>
            <h1 style={{ fontFamily: "'Spectral', serif", fontSize: 26, fontWeight: 600, margin: 0 }}>Overview</h1>
            <p style={{ color: "#55606B", fontSize: 14, marginTop: 4 }}>
              Every add, remove, and update instruction from insurance providers, tracked in one place.
            </p>

            <div style={{ display: "flex", gap: 14, marginTop: 22, flexWrap: "wrap" }}>
              <StatCard label="Open requests" value={pending} accent="#E3993A" />
              <StatCard label="Confirmed" value={confirmedThisWeek} accent="#0E7A77" />
              <StatCard label="Active members" value={activeMembers} accent="#1B2A41" />
              <StatCard label="Deactivated" value={inactiveMembers} accent="#C1483F" />
            </div>

            <div style={{ marginTop: 30 }}>
              <h2 style={{ fontSize: 14, fontWeight: 700, color: "#55606B", textTransform: "uppercase", letterSpacing: 0.4 }}>
                Requests in progress
              </h2>
              <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
                {requests.filter((r) => r.stage !== "Confirmed").length === 0 && (
                  <EmptyNote text="Nothing open. New instructions you log will show up here." />
                )}
                {requests
                  .filter((r) => r.stage !== "Confirmed")
                  .map((r) => (
                    <RequestRow key={r.id} r={r} onClick={() => { setSelected(r); setTab("requests"); }} />
                  ))}
              </div>
            </div>
          </>
        )}

        {tab === "requests" && !selected && (
          <>
            <TopBar
              title="Requests"
              subtitle="Instructions received from insurance providers by email or message."
              query={query}
              setQuery={setQuery}
              actionLabel={editMode ? "Log request" : null}
              onAction={() => setShowNewRequest(true)}
            />
            {!editMode && (
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 10, color: "#9AA2AB", fontSize: 12.5 }}>
                <Lock size={12} /> View only — Insurance Desk staff can sign in to log or update requests.
              </div>
            )}
            <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
              {filteredRequests.length === 0 && <EmptyNote text="No requests match. Try a different search, or log a new one." />}
              {filteredRequests.map((r) => (
                <RequestRow key={r.id} r={r} onClick={() => setSelected(r)} />
              ))}
            </div>
          </>
        )}

        {tab === "requests" && selected && (
          <RequestDetail
            r={selected}
            editMode={editMode}
            onBack={() => setSelected(null)}
            onAdvance={() => advanceStage(selected.id)}
          />
        )}

        {tab === "members" && (
          <>
            <TopBar
              title="Members"
              subtitle="Principals and dependents covered under insurance policies."
              query={query}
              setQuery={setQuery}
              actionLabel={null}
            />
            <div style={{ marginTop: 16, background: "#fff", border: "1px solid #E3E6EA", borderRadius: 10, overflow: "hidden" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr 1fr 0.8fr", padding: "10px 16px", fontSize: 11, fontWeight: 700, color: "#55606B", textTransform: "uppercase", letterSpacing: 0.3, borderBottom: "1px solid #E3E6EA" }}>
                <div>Name</div><div>ID</div><div>Company</div><div>Role</div><div>Status</div>
              </div>
              {filteredMembers.length === 0 && <div style={{ padding: 20 }}><EmptyNote text="No members match your search." /></div>}
              {filteredMembers.map((m) => (
                <div
                  key={m.id}
                  style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr 1fr 0.8fr", padding: "12px 16px", fontSize: 13.5, borderBottom: "1px solid #F0F1F3", alignItems: "center" }}
                >
                  <div style={{ fontWeight: 600 }}>{m.name}</div>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", color: "#55606B" }}>{m.id}</div>
                  <div>{m.company}</div>
                  <div style={{ color: "#55606B" }}>{m.role}</div>
                  <div>
                    <Badge
                      color={m.status === "Active" ? "#0E7A77" : "#C1483F"}
                      bg={m.status === "Active" ? "#E4F3F1" : "#FBEBEA"}
                    >
                      {m.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {showNewRequest && (
        <NewRequestModal
          members={members}
          onClose={() => setShowNewRequest(false)}
          onSubmit={addRequest}
        />
      )}

      {showSignIn && (
        <StaffSignInModal
          onClose={() => setShowSignIn(false)}
          onSuccess={() => { setEditMode(true); setShowSignIn(false); }}
        />
      )}
    </div>
  );
}

// ---- composite pieces ------------------------------------------------------

function TopBar({ title, subtitle, query, setQuery, actionLabel, onAction }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12 }}>
      <div>
        <h1 style={{ fontFamily: "'Spectral', serif", fontSize: 26, fontWeight: 600, margin: 0 }}>{title}</h1>
        <p style={{ color: "#55606B", fontSize: 14, marginTop: 4 }}>{subtitle}</p>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <div style={{ position: "relative" }}>
          <Search size={14} style={{ position: "absolute", left: 10, top: 10, color: "#9AA2AB" }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, ID, company"
            style={{
              padding: "8px 10px 8px 30px",
              fontSize: 13,
              border: "1px solid #D7DBE0",
              borderRadius: 7,
              width: 220,
            }}
          />
        </div>
        {actionLabel && (
          <button
            onClick={onAction}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "#0E7A77",
              color: "#fff",
              border: "none",
              borderRadius: 7,
              padding: "8px 14px",
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            <Plus size={14} /> {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}

function RequestRow({ r, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: "#fff",
        border: "1px solid #E3E6EA",
        borderRadius: 9,
        padding: "12px 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        cursor: "pointer",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <StageRail stage={r.stage} compact />
        <div>
          <div style={{ fontWeight: 700, fontSize: 13.5 }}>
            {r.memberName} <span style={{ color: "#9AA2AB", fontWeight: 500 }}>· {r.memberId}</span>
          </div>
          <div style={{ fontSize: 12, color: "#55606B", marginTop: 1 }}>
            {r.type} — {r.company}
          </div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Badge color={STAGE_COLOR[r.stage]} bg="#F0F1F3">{r.stage}</Badge>
        <ChevronRight size={15} color="#9AA2AB" />
      </div>
    </div>
  );
}

function RequestDetail({ r, editMode, onBack, onAdvance }) {
  const isFinal = r.stage === "Confirmed";
  return (
    <div>
      <button onClick={onBack} style={{ border: "none", background: "none", color: "#0E7A77", fontSize: 13, fontWeight: 700, padding: 0, marginBottom: 14 }}>
        ← Back to requests
      </button>
      <div style={{ background: "#fff", border: "1px solid #E3E6EA", borderRadius: 12, padding: 26 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 12, fontFamily: "'IBM Plex Mono', monospace", color: "#9AA2AB" }}>{r.id}</div>
            <h2 style={{ fontFamily: "'Spectral', serif", fontSize: 22, fontWeight: 600, margin: "4px 0" }}>
              {r.type} — {r.memberName}
            </h2>
            <div style={{ fontSize: 13, color: "#55606B" }}>
              {r.company} · Member ID {r.memberId} · received {r.dateReceived}
            </div>
          </div>
          {!isFinal && editMode && (
            <button
              onClick={onAdvance}
              style={{ background: "#0E7A77", color: "#fff", border: "none", borderRadius: 7, padding: "9px 16px", fontSize: 13, fontWeight: 700 }}
            >
              Mark as {STAGES[STAGES.indexOf(r.stage) + 1]}
            </button>
          )}
          {!isFinal && !editMode && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#9AA2AB", fontSize: 12.5 }}>
              <Lock size={12} /> Staff sign-in required to update
            </div>
          )}
        </div>

        <div style={{ marginTop: 28, padding: "18px 10px", background: "#FAFBFC", borderRadius: 10 }}>
          <StageRail stage={r.stage} />
        </div>

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

function EmptyNote({ text }) {
  return (
    <div style={{ padding: "16px 4px", color: "#9AA2AB", fontSize: 13.5, fontStyle: "italic" }}>{text}</div>
  );
}

function NewRequestModal({ members, onClose, onSubmit }) {
  const [form, setForm] = useState({
    company: "GNPC",
    type: REQUEST_TYPES[0],
    memberName: "",
    memberId: "",
    reason: "",
    notes: "",
    dateReceived: new Date().toISOString().slice(0, 10),
  });
  const [idSuggestions, setIdSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const needsExistingMember = form.type === "Remove dependent" || form.type === "Reinstate";
  const needsNewMember = form.type === "Add dependent";

  const matchedMember = members.find((m) => m.id === form.memberId);
  const idAlreadyExists = needsNewMember && !!matchedMember;
  const idMissing = needsExistingMember && form.memberId.length > 0 && !matchedMember;

  function handleIdChange(e) {
    const val = e.target.value;
    setForm((f) => ({ ...f, memberId: val }));
    if (needsExistingMember && val.length > 0) {
      const hits = members.filter(
        (m) =>
          m.id.toLowerCase().includes(val.toLowerCase()) ||
          m.name.toLowerCase().includes(val.toLowerCase())
      );
      setIdSuggestions(hits);
      setShowSuggestions(hits.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }

  function pickSuggestion(m) {
    setForm((f) => ({ ...f, memberId: m.id, memberName: m.name, company: m.company }));
    setShowSuggestions(false);
  }

  const canSubmit = form.memberName && form.memberId && !idAlreadyExists;

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(27,42,65,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10 }}>
      <div style={{ background: "#fff", borderRadius: 12, width: 460, maxWidth: "90vw", padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontFamily: "'Spectral', serif", fontSize: 19, fontWeight: 600, margin: 0 }}>Log a request</h2>
          <button onClick={onClose} style={{ border: "none", background: "none" }}><X size={18} /></button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
          <Field label="Request type">
            <select
              value={form.type}
              onChange={(e) => {
                setForm((f) => ({ ...f, type: e.target.value, memberId: "", memberName: "" }));
                setShowSuggestions(false);
              }}
              style={inputStyle}
            >
              {REQUEST_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Insurance company">
            <input value={form.company} onChange={set("company")} style={inputStyle} />
          </Field>
          <div style={{ display: "flex", gap: 10 }}>
            <Field label="Member name" style={{ flex: 1 }}>
              <input
                value={form.memberName}
                onChange={set("memberName")}
                style={inputStyle}
                placeholder="e.g. Sarjo Badjie"
              />
            </Field>
            <Field label="Member ID" style={{ flex: 1, position: "relative" }}>
              <input
                value={form.memberId}
                onChange={handleIdChange}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                onFocus={() => {
                  if (needsExistingMember && form.memberId.length > 0 && idSuggestions.length > 0)
                    setShowSuggestions(true);
                }}
                style={{
                  ...inputStyle,
                  borderColor: idMissing ? "#C1483F" : idAlreadyExists ? "#C1483F" : "#D7DBE0",
                }}
                placeholder="e.g. 2025/B"
              />
              {showSuggestions && (
                <div style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  background: "#fff",
                  border: "1px solid #D7DBE0",
                  borderRadius: 7,
                  boxShadow: "0 4px 12px rgba(27,42,65,0.12)",
                  zIndex: 30,
                  marginTop: 2,
                  overflow: "hidden",
                }}>
                  {idSuggestions.map((m) => (
                    <button
                      key={m.id}
                      onMouseDown={() => pickSuggestion(m)}
                      style={{
                        display: "block",
                        width: "100%",
                        textAlign: "left",
                        padding: "9px 12px",
                        border: "none",
                        background: "none",
                        borderBottom: "1px solid #F0F1F3",
                        fontSize: 12.5,
                        cursor: "pointer",
                      }}
                    >
                      <span style={{ fontWeight: 700 }}>{m.id}</span>
                      <span style={{ color: "#55606B", marginLeft: 8 }}>{m.name}</span>
                      <span style={{
                        float: "right",
                        fontSize: 11,
                        fontWeight: 700,
                        color: m.status === "Active" ? "#0E7A77" : "#C1483F",
                      }}>
                        {m.status}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </Field>
          </div>

          {idMissing && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#C1483F", fontSize: 12, fontWeight: 600, marginTop: -4 }}>
              <AlertCircle size={12} />
              No member with this ID — check the Members list. For Remove / Reinstate the ID must already exist.
            </div>
          )}
          {idAlreadyExists && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#C1483F", fontSize: 12, fontWeight: 600, marginTop: -4 }}>
              <AlertCircle size={12} />
              Member ID {form.memberId} already exists ({matchedMember.name}). Use a new ID for an addition.
            </div>
          )}

          <Field label="Reason">
            <input value={form.reason} onChange={set("reason")} style={inputStyle} placeholder="e.g. Exceeded age limit under policy" />
          </Field>
          <Field label="Notes (optional)">
            <textarea value={form.notes} onChange={set("notes")} style={{ ...inputStyle, minHeight: 56, resize: "vertical" }} />
          </Field>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 20 }}>
          <button onClick={onClose} style={{ border: "1px solid #D7DBE0", background: "#fff", borderRadius: 7, padding: "8px 14px", fontSize: 13, fontWeight: 600 }}>
            Cancel
          </button>
          <button
            disabled={!canSubmit}
            onClick={() => onSubmit(form)}
            style={{
              border: "none",
              background: !canSubmit ? "#A9C9C7" : "#0E7A77",
              color: "#fff",
              borderRadius: 7,
              padding: "8px 16px",
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            Log request
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children, style }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 5, fontSize: 12.5, fontWeight: 600, color: "#55606B", ...style }}>
      {label}
      {children}
    </label>
  );
}

const inputStyle = {
  padding: "8px 10px",
  fontSize: 13.5,
  border: "1px solid #D7DBE0",
  borderRadius: 7,
  fontFamily: "inherit",
  color: "#1B2A41",
};
