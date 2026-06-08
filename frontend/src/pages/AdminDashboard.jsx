import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { LogOut, Plus, Trash2, Pencil, Award, Loader2 } from "lucide-react";
import api from "../api.js";
import Logo from "../Logo.jsx";

const emptyForm = () => ({
  certificate_id: "",
  candidate_name: "",
  course_name: "",
  issuer: "",
  issue_date: new Date().toISOString().slice(0, 10),
  status: "active",
});

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [certs, setCerts] = useState([]);
  const [form, setForm] = useState(emptyForm());
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState(emptyForm());
  const [editLoading, setEditLoading] = useState(false);

  const loadCerts = async () => {
    try {
      const { data } = await api.get("/certificates");
      setCerts(data);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to load");
    }
  };

  useEffect(() => { loadCerts(); }, []);

  const onCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/certificates", form);
      toast.success("Certificate created");
      setForm(emptyForm());
      loadCerts();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async (id) => {
    if (!confirm("Delete this certificate?")) return;
    try {
      await api.delete(`/certificates/${id}`);
      toast.success("Deleted");
      loadCerts();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed");
    }
  };

  const openEdit = (c) => {
    setEditing(c);
    setEditForm({
      certificate_id: c.certificate_id,
      candidate_name: c.candidate_name,
      course_name: c.course_name,
      issuer: c.issuer ?? "",
      issue_date: c.issue_date,
      status: c.status ?? "active",
    });
  };

  const onUpdate = async (e) => {
    e.preventDefault();
    if (!editing) return;
    setEditLoading(true);
    try {
      await api.put(`/certificates/${editing.id}`, editForm);
      toast.success("Updated");
      setEditing(null);
      loadCerts();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed");
    } finally {
      setEditLoading(false);
    }
  };

  const onSignOut = () => {
    localStorage.removeItem("token");
    navigate("/admin/login");
  };

  const activeCount = certs.filter((c) => c.status === "active").length;
  const expiredCount = certs.filter((c) => c.status === "expired").length;

  return (
    <div>
      {/* ── Navbar ── */}
      <header className="navbar">
        <Link to="/" className="nav-brand">
          <Logo size={34} rounded="9px" />
          <span className="nav-brand-text">CertVerify Admin</span>
        </Link>
        <button className="nav-pill nav-pill-danger" onClick={onSignOut}>
          <LogOut size={14} />
          Sign out
        </button>
      </header>

      <main className="container">
        <div className="stats">
          <StatCard label="Total Certificates" value={certs.length} />
          <StatCard label="Active" value={activeCount} />
          <StatCard label="Expired" value={expiredCount} />
        </div>

        <div className="admin-grid">
          <div className="card">
            <h2 style={{ marginTop: 0, display: "flex", gap: 8, alignItems: "center" }}>
              <Plus size={16} /> Create Certificate
            </h2>
            <form onSubmit={onCreate}>
              <FormFields form={form} setForm={setForm} prefix="c" />
              <button className="btn" style={{ width: "100%" }} disabled={loading}>
                {loading ? <Loader2 size={16} className="spin" /> : "Save Certificate"}
              </button>
            </form>
          </div>

          <div className="card">
            <h2 style={{ marginTop: 0 }}>All Certificates ({certs.length})</h2>
            <div>
              {certs.length === 0 && (
                <p className="muted" style={{ textAlign: "center", padding: 24 }}>
                  No certificates yet. Create your first one.
                </p>
              )}
              {certs.map((c) => (
                <div key={c.id} className="cert-row">
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 500 }}>
                      {c.candidate_name}
                      <span className={`badge ${c.status === "active" ? "badge-active" : "badge-expired"}`}>
                        {c.status}
                      </span>
                    </div>
                    <div className="muted" style={{ fontSize: 12 }}>
                      {c.certificate_id} · {c.course_name} · {c.issuer || "—"} · {new Date(c.issue_date).toLocaleDateString()}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 4 }}>
                    <button className="btn-ghost" onClick={() => openEdit(c)}><Pencil size={16} /></button>
                    <button className="btn-danger" onClick={() => onDelete(c.id)}><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {editing && (
        <div className="modal-backdrop" onClick={() => setEditing(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 style={{ marginTop: 0 }}>Update Certificate</h2>
            <form onSubmit={onUpdate}>
              <FormFields form={editForm} setForm={setEditForm} prefix="e" />
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                <button type="button" className="btn btn-outline" onClick={() => setEditing(null)}>Cancel</button>
                <button type="submit" className="btn" disabled={editLoading}>
                  {editLoading ? <Loader2 size={16} className="spin" /> : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function FormFields({ form, setForm, prefix }) {
  const set = (k, v) => setForm({ ...form, [k]: v });
  return (
    <>
      <div className="field">
        <label className="label">Certificate ID</label>
        <input className="input" value={form.certificate_id} onChange={(e) => set("certificate_id", e.target.value)} required />
      </div>
      <div className="field">
        <label className="label">Candidate Name</label>
        <input className="input" value={form.candidate_name} onChange={(e) => set("candidate_name", e.target.value)} required />
      </div>
      <div className="field">
        <label className="label">Course Name</label>
        <input className="input" value={form.course_name} onChange={(e) => set("course_name", e.target.value)} required />
      </div>
      <div className="field">
        <label className="label">Issuer</label>
        <input className="input" value={form.issuer} onChange={(e) => set("issuer", e.target.value)} required />
      </div>
      <div className="field">
        <label className="label">Issue Date</label>
        <input className="input" type="date" value={form.issue_date} onChange={(e) => set("issue_date", e.target.value)} required />
      </div>
      <div className="field">
        <label className="label">Status</label>
        <select className="select" value={form.status} onChange={(e) => set("status", e.target.value)}>
          <option value="active">Active</option>
          <option value="expired">Expired</option>
        </select>
      </div>
    </>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="card stat">
      <div className="stat-icon"><Award size={20} /></div>
      <div>
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
      </div>
    </div>
  );
}
