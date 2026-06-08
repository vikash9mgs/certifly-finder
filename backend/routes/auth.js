import { Router } from "express";
import { z } from "zod";
import { supabaseAdmin } from "../supabase.js";

const router = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

router.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0].message });

  const { data, error } = await supabaseAdmin.auth.signInWithPassword(parsed.data);
  if (error || !data.session) return res.status(401).json({ error: error?.message || "Login failed" });

  res.json({
    token: data.session.access_token,
    user: { id: data.user.id, email: data.user.email },
  });
});

router.post("/reset-password", async (req, res) => {
  const schema = z.object({ email: z.string().email() });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid email" });

  const { error } = await supabaseAdmin.auth.resetPasswordForEmail(parsed.data.email);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ ok: true });
});

export default router;
