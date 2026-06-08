import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Loader2, CheckCircle2, XCircle, ShieldCheck } from "lucide-react";
import api from "../api.js";
import Logo from "../Logo.jsx";

const EXAMPLES = ["CERT-2026-0001", "VER-AWS-2024-001"];

export default function Home() {
  const [certId, setCertId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState({ status: "idle" });

  const verify = async (id) => {
    const value = id.trim();
    if (!value) return;
    setLoading(true);
    setResult({ status: "idle" });
    try {
      const { data } = await api.get(`/certificates/verify/${encodeURIComponent(value)}`);
      setResult(data ? { status: "valid", cert: data } : { status: "invalid" });
    } catch {
      setResult({ status: "invalid" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrap">
      {/* ── Navbar ── */}
      <header className="navbar">
        <Link to="/" className="nav-brand">
          <Logo size={34} rounded="9px" />
          <span className="nav-brand-text">CertVerify</span>
        </Link>

        <nav className="nav-links">
          <Link to="/" className="nav-pill">
            <Search size={14} />
            Verify
          </Link>
          <Link to="/admin/login" className="nav-pill">
            <ShieldCheck size={14} />
            Admin
          </Link>
        </nav>
      </header>

      <main className="verify-wrap">
        <div className="card verify-card">
          <Logo size={72} rounded="18px" style={{ margin: "0 auto 20px" }} />
          <h1 className="title">Verify a Certificate</h1>
          <p className="muted">Enter a certificate ID to check its authenticity</p>

          <form
            className="search-row"
            onSubmit={(e) => { e.preventDefault(); verify(certId); }}
          >
            <input
              className="input"
              value={certId}
              onChange={(e) => setCertId(e.target.value)}
              placeholder="Enter Certificate ID or Verification ID"
            />
            <button className="btn search-btn" type="submit" disabled={loading}>
              {loading ? <Loader2 size={20} className="spin" /> : <Search size={20} />}
            </button>
          </form>

          <div style={{ marginTop: 24, fontSize: 14 }}>
            <p className="muted">Try these example IDs:</p>
            <div style={{ display: "flex", gap: 24, justifyContent: "center", marginTop: 8 }}>
              {EXAMPLES.map((id) => (
                <button
                  key={id}
                  type="button"
                  className="btn-ghost"
                  style={{ color: "#2563eb", fontWeight: 600, padding: 0 }}
                  onClick={() => { setCertId(id); verify(id); }}
                >
                  {id}
                </button>
              ))}
            </div>
          </div>

          {result.status === "valid" && (
            <div className="result-ok">
              <div style={{ display: "flex", gap: 12 }}>
                <CheckCircle2 size={28} color="#059669" />
                <div>
                  <h3 style={{ margin: 0, color: "#065f46" }}>Certificate Verified</h3>
                  <p style={{ margin: "4px 0 0", color: "#047857", fontSize: 14 }}>
                    This certificate is authentic and verified
                  </p>
                </div>
              </div>
              <dl className="detail-list">
                <Row label="Certificate Name" value={result.cert.course_name} />
                <Row label="Candidate Name" value={result.cert.candidate_name} />
                <Row label="Issuer" value={result.cert.issuer || "—"} />
                <Row label="Issue Date" value={new Date(result.cert.issue_date).toLocaleDateString()} />
                <Row label="Certificate ID" value={result.cert.certificate_id} />
                <Row label="Status" value={result.cert.status === "expired" ? "Expired" : "Active & Verified"} />
              </dl>
            </div>
          )}

          {result.status === "invalid" && (
            <div className="result-bad">
              <div style={{ display: "flex", gap: 8, alignItems: "center", fontWeight: 600 }}>
                <XCircle size={20} /> Certificate Not Found
              </div>
              <p style={{ margin: "8px 0 0", fontSize: 14 }}>
                No certificate matches that ID. Double-check spelling or contact the issuer.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="detail-row">
      <dt>{label}:</dt>
      <dd>{value}</dd>
    </div>
  );
}
