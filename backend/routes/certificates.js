import { Router } from "express";
import { z } from "zod";
import { supabaseAdmin } from "../supabase.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = Router();

const certSchema = z.object({
  certificate_id: z.string().trim().min(1).max(100),
  candidate_name: z.string().trim().min(1).max(200),
  course_name: z.string().trim().min(1).max(200),
  issuer: z.string().trim().min(1).max(200),
  issue_date: z.string().min(1),
  status: z.enum(["active", "expired"]).default("active"),
});

// Public — verify a certificate by certificate_id
router.get("/verify/:certificateId", async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from("certificates")
    .select("certificate_id, candidate_name, course_name, issuer, issue_date, status")
    .eq("certificate_id", req.params.certificateId)
    .maybeSingle();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data || null);
});

// Admin — list all
router.get("/", requireAuth, requireAdmin, async (_req, res) => {
  const { data, error } = await supabaseAdmin
    .from("certificates")
    .select("id, certificate_id, candidate_name, course_name, issuer, issue_date, status, created_at")
    .order("created_at", { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Admin — create
router.post("/", requireAuth, requireAdmin, async (req, res) => {
  const parsed = certSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0].message });

  const { data, error } = await supabaseAdmin
    .from("certificates")
    .insert({ ...parsed.data, created_by: req.user.id })
    .select()
    .single();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

// Admin — update
router.put("/:id", requireAuth, requireAdmin, async (req, res) => {
  const parsed = certSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0].message });

  const { data, error } = await supabaseAdmin
    .from("certificates")
    .update(parsed.data)
    .eq("id", req.params.id)
    .select()
    .single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// Admin — delete
router.delete("/:id", requireAuth, requireAdmin, async (req, res) => {
  const { error } = await supabaseAdmin
    .from("certificates")
    .delete()
    .eq("id", req.params.id);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ ok: true });
});

export default router;
