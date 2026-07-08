import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, requestsTable, membersTable } from "@workspace/db";
import {
  CreateRequestBody,
  AdvanceRequestBody,
  GetRequestParams,
  AdvanceRequestParams,
} from "@workspace/api-zod";
import { requireAuth } from "../middlewares/requireAuth";

const router: IRouter = Router();

const STAGE_ORDER = ["Received", "Reviewed", "Actioned", "Confirmed"] as const;

router.get("/requests", async (_req, res): Promise<void> => {
  const requests = await db
    .select()
    .from(requestsTable)
    .orderBy(requestsTable.createdAt);
  res.json(requests);
});

router.post("/requests", requireAuth, async (req, res): Promise<void> => {
  const parsed = CreateRequestBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [request] = await db
    .insert(requestsTable)
    .values({ ...parsed.data, notes: parsed.data.notes ?? null })
    .returning();

  res.status(201).json(request);
});

router.get("/requests/:id", async (req, res): Promise<void> => {
  const params = GetRequestParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [request] = await db
    .select()
    .from(requestsTable)
    .where(eq(requestsTable.id, params.data.id));

  if (!request) {
    res.status(404).json({ error: "Request not found" });
    return;
  }

  res.json(request);
});

router.patch(
  "/requests/:id/advance",
  requireAuth,
  async (req, res): Promise<void> => {
    const params = AdvanceRequestParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: params.error.message });
      return;
    }

    const parsed = AdvanceRequestBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }

    const [existing] = await db
      .select()
      .from(requestsTable)
      .where(eq(requestsTable.id, params.data.id));

    if (!existing) {
      res.status(404).json({ error: "Request not found" });
      return;
    }

    if (!STAGE_ORDER.includes(parsed.data.stage)) {
      res.status(400).json({ error: "Invalid stage" });
      return;
    }

    const [updated] = await db
      .update(requestsTable)
      .set({ stage: parsed.data.stage })
      .where(eq(requestsTable.id, params.data.id))
      .returning();

    if (!updated) {
      res.status(404).json({ error: "Request not found" });
      return;
    }

    if (parsed.data.stage === "Actioned") {
      if (updated.type === "Remove dependent") {
        await db
          .update(membersTable)
          .set({ status: "Inactive" })
          .where(eq(membersTable.policyNo, updated.policyNo));
      } else if (updated.type === "Reinstate") {
        await db
          .update(membersTable)
          .set({ status: "Active" })
          .where(eq(membersTable.policyNo, updated.policyNo));
      }
    }

    res.json(updated);
  },
);

export default router;
