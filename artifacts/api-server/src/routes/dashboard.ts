import { Router, type IRouter } from "express";
import { eq, ne, count } from "drizzle-orm";
import { db, requestsTable, membersTable } from "@workspace/db";

const router: IRouter = Router();

router.get("/dashboard/summary", async (_req, res): Promise<void> => {
  const [openRequestsResult] = await db
    .select({ value: count() })
    .from(requestsTable)
    .where(ne(requestsTable.stage, "Confirmed"));

  const [confirmedRequestsResult] = await db
    .select({ value: count() })
    .from(requestsTable)
    .where(eq(requestsTable.stage, "Confirmed"));

  const [activeMembersResult] = await db
    .select({ value: count() })
    .from(membersTable)
    .where(eq(membersTable.status, "Active"));

  const [deactivatedMembersResult] = await db
    .select({ value: count() })
    .from(membersTable)
    .where(eq(membersTable.status, "Inactive"));

  const inProgress = await db
    .select()
    .from(requestsTable)
    .where(ne(requestsTable.stage, "Confirmed"))
    .orderBy(requestsTable.createdAt);

  res.json({
    openRequests: openRequestsResult?.value ?? 0,
    confirmedRequests: confirmedRequestsResult?.value ?? 0,
    activeMembers: activeMembersResult?.value ?? 0,
    deactivatedMembers: deactivatedMembersResult?.value ?? 0,
    inProgress,
  });
});

export default router;
