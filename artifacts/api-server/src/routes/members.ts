import { Router, type IRouter } from "express";
import { eq, ilike, or } from "drizzle-orm";
import { db, membersTable } from "@workspace/db";
import {
  CreateMemberBody,
  UpdateMemberBody,
  GetMemberParams,
  UpdateMemberParams,
  DeleteMemberParams,
} from "@workspace/api-zod";
import { requireAuth } from "../middlewares/requireAuth";

const router: IRouter = Router();

router.get("/members", async (req, res): Promise<void> => {
  const search =
    typeof req.query.search === "string" ? req.query.search.trim() : "";

  const members = search
    ? await db
        .select()
        .from(membersTable)
        .where(
          or(
            ilike(membersTable.policyNo, `%${search}%`),
            ilike(membersTable.name, `%${search}%`),
            ilike(membersTable.insurer, `%${search}%`),
            ilike(membersTable.employer, `%${search}%`),
          ),
        )
        .orderBy(membersTable.name)
    : await db.select().from(membersTable).orderBy(membersTable.name);

  res.json(members);
});

router.post("/members", requireAuth, async (req, res): Promise<void> => {
  const parsed = CreateMemberBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [existing] = await db
    .select()
    .from(membersTable)
    .where(eq(membersTable.policyNo, parsed.data.policyNo));

  if (existing) {
    res.status(400).json({ error: "Policy number already exists" });
    return;
  }

  const [member] = await db
    .insert(membersTable)
    .values(parsed.data)
    .returning();

  res.status(201).json(member);
});

router.get("/members/:policyNo", async (req, res): Promise<void> => {
  const params = GetMemberParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [member] = await db
    .select()
    .from(membersTable)
    .where(eq(membersTable.policyNo, params.data.policyNo));

  if (!member) {
    res.status(404).json({ error: "Member not found" });
    return;
  }

  res.json(member);
});

router.patch(
  "/members/:policyNo",
  requireAuth,
  async (req, res): Promise<void> => {
    const params = UpdateMemberParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: params.error.message });
      return;
    }

    const parsed = UpdateMemberBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }

    const [member] = await db
      .update(membersTable)
      .set(parsed.data)
      .where(eq(membersTable.policyNo, params.data.policyNo))
      .returning();

    if (!member) {
      res.status(404).json({ error: "Member not found" });
      return;
    }

    res.json(member);
  },
);

router.delete(
  "/members/:policyNo",
  requireAuth,
  async (req, res): Promise<void> => {
    const params = DeleteMemberParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: params.error.message });
      return;
    }

    const [member] = await db
      .delete(membersTable)
      .where(eq(membersTable.policyNo, params.data.policyNo))
      .returning();

    if (!member) {
      res.status(404).json({ error: "Member not found" });
      return;
    }

    res.sendStatus(204);
  },
);

export default router;
