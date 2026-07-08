import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, usersTable } from "@workspace/db";
import { CreateStaffBody, DeleteStaffParams } from "@workspace/api-zod";
import { requireAdmin } from "../middlewares/requireAuth";
import { hashPassword } from "../lib/auth";
import { toStaffUser } from "../lib/serializers";

const router: IRouter = Router();

router.get("/staff", requireAdmin, async (_req, res): Promise<void> => {
  const users = await db
    .select()
    .from(usersTable)
    .orderBy(usersTable.createdAt);
  res.json(users.map(toStaffUser));
});

router.post("/staff", requireAdmin, async (req, res): Promise<void> => {
  const parsed = CreateStaffBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [existing] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.username, parsed.data.username));

  if (existing) {
    res.status(400).json({ error: "Username already taken" });
    return;
  }

  const passwordHash = await hashPassword(parsed.data.password);
  const [user] = await db
    .insert(usersTable)
    .values({
      username: parsed.data.username,
      passwordHash,
      role: parsed.data.role,
    })
    .returning();

  if (!user) {
    res.status(500).json({ error: "Failed to create staff account" });
    return;
  }

  res.status(201).json(toStaffUser(user));
});

router.delete("/staff/:id", requireAdmin, async (req, res): Promise<void> => {
  const params = DeleteStaffParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  if (req.currentUser?.id === params.data.id) {
    res.status(400).json({ error: "You cannot delete your own account" });
    return;
  }

  const [deleted] = await db
    .delete(usersTable)
    .where(eq(usersTable.id, params.data.id))
    .returning();

  if (!deleted) {
    res.status(404).json({ error: "Staff account not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
