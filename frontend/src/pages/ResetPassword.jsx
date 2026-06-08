import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Loader2, ArrowLeft, Search, ShieldCheck } from "lucide-react";
import api from "../api.js";
import Logo from "../Logo.jsx";

export default function ResetPassword() {
  const [email, setEmail]     = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/reset-password", { email });
      setSent(true);
      toast.success("Reset email sent — check your inbox");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="al-page">
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
          <Link to="/admin/login" className="nav-pill nav-pill-active">
            <ShieldCheck size={14} />
            Admin
          </Link>
        </nav>
      </header>

      {/* ── Auth Card ── */}
      <div className="al-center">
        <div className="al-card">
          {/* Brand */}
          <div className="al-brand">
            <Logo size={32} rounded="8px" />
            <span className="al-brand-text">CertVerify Admin</span>
          </div>

          <h1 className="al-title">Reset Password</h1>
          <p className="al-sub">
            {sent
              ? "Check your email for a reset link. It may take a minute."
              : "Enter your admin email and we'll send you a password reset link."}
          </p>

          {!sent && (
            <form onSubmit={onSubmit} className="al-form">
              <div className="al-field">
                <label className="al-label" htmlFor="reset-email">Email</label>
                <input
                  id="reset-email"
                  className="al-input"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                />
              </div>
              <button className="al-btn" disabled={loading}>
                {loading ? <Loader2 size={18} className="spin" /> : "Send Reset Link"}
              </button>
            </form>
          )}

          <Link
            to="/admin/login"
            style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 20, fontSize: 14, color: "#6b7280", fontWeight: 500 }}
          >
            <ArrowLeft size={14} /> Back to Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
