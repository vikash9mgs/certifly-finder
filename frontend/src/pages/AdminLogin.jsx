import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Loader2, Eye, EyeOff, Search, ShieldCheck } from "lucide-react";
import api from "../api.js";
import Logo from "../Logo.jsx";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [showPwd, setShowPwd]   = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", data.token);
      toast.success("Signed in successfully");
      navigate("/admin");
    } catch (err) {
      toast.error(err.response?.data?.error || "Login failed. Check your credentials.");
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

          {/* Heading */}
          <h1 className="al-title">Sign in</h1>
          <p className="al-sub">Access the admin dashboard to manage certificates.</p>

          {/* Form */}
          <form onSubmit={onSubmit} className="al-form">
            {/* Email */}
            <div className="al-field">
              <label className="al-label" htmlFor="admin-email">Email</label>
              <input
                id="admin-email"
                className="al-input"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
              />
            </div>

            {/* Password */}
            <div className="al-field">
              <div className="al-label-row">
                <label className="al-label" htmlFor="admin-password">Password</label>
                <Link to="/reset-password" className="al-forgot">Forgot password?</Link>
              </div>
              <div className="al-input-wrap">
                <input
                  id="admin-password"
                  className="al-input al-input-pwd"
                  type={showPwd ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="al-eye"
                  onClick={() => setShowPwd((v) => !v)}
                  aria-label={showPwd ? "Hide password" : "Show password"}
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button id="admin-signin-btn" className="al-btn" disabled={loading}>
              {loading ? <Loader2 size={18} className="spin" /> : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
