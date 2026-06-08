import { supabaseAdmin } from "../supabase.js";

export async function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Missing token" });

  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data?.user) return res.status(401).json({ error: "Invalid token" });

  req.user = data.user;
  req.token = token;
  next();
}

export async function requireAdmin(req, res, next) {
  const { data, error } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", req.user.id);
  if (error) return res.status(500).json({ error: error.message });
  if (!data?.some((r) => r.role === "admin")) {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
}
